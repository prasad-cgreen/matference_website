from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
import smtplib
import ssl
import resend
from email.message import EmailMessage
from email.utils import formataddr, formatdate, make_msgid
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')


def required_env(name: str) -> str:
    """Return a required setting or fail with an actionable startup error."""
    value = os.environ.get(name, '').strip()
    if not value:
        raise RuntimeError(f"Required environment variable {name} is not set")
    return value

# MongoDB connection
mongo_url = required_env('MONGO_URL')
# Fail fast: the contact form must not block on an unreachable database, so the
# driver gives up in seconds rather than sitting through its 30s default.
client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
db = client[required_env('DB_NAME')]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ---------- Email ----------
# Two transports are supported. SMTP (Zoho) is preferred when configured: the
# mailbox that receives the leads is also the mailbox that sends them, so there
# is no third-party sending domain to verify. Resend stays available as an
# alternative for deployments that already use it.
SMTP_HOST = os.environ.get('SMTP_HOST', '').strip()
SMTP_PORT = int(os.environ.get('SMTP_PORT', '465'))
SMTP_USER = os.environ.get('SMTP_USER', '').strip()
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')
# Port 465 is implicit TLS; 587 upgrades a plain connection with STARTTLS.
SMTP_USE_SSL = os.environ.get('SMTP_USE_SSL', '').strip().lower() in ('1', 'true', 'yes') or SMTP_PORT == 465

RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
# Comma-separated, so a lead can reach more than one inbox.
NOTIFY_EMAILS = [e.strip() for e in os.environ.get('NOTIFY_EMAIL', 'info@cgreen.in').split(',') if e.strip()]
NOTIFY_TO = ', '.join(NOTIFY_EMAILS)
# Zoho only accepts a From address the authenticated user owns, so the SMTP user
# is the correct default rather than the Resend sandbox sender.
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', '').strip() or SMTP_USER or 'onboarding@resend.dev'
SENDER_NAME = os.environ.get('SENDER_NAME', 'CGreen Website')

SMTP_CONFIGURED = bool(SMTP_HOST and SMTP_USER and SMTP_PASSWORD)
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


def _esc(v):
    return (str(v).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def _lead_email_html(sub):
    rows = [
        ("First Name", sub.first_name),
        ("Last Name", sub.last_name),
        ("Email", sub.email),
        ("Subject", sub.subject),
        ("Message", sub.message),
        ("Accepted Terms", "Yes" if sub.accepted_terms else "No"),
        ("Submitted At", sub.created_at),
    ]
    trs = "".join(
        f'<tr><td style="padding:8px 12px;font-weight:600;color:#142984;'
        f'border:1px solid #eee;background:#FFFCFA;white-space:nowrap;vertical-align:top">{_esc(l)}</td>'
        f'<td style="padding:8px 12px;color:#333;border:1px solid #eee">{_esc(v)}</td></tr>'
        for l, v in rows
    )
    return (
        '<div style="font-family:Arial,sans-serif;color:#142984">'
        '<h2 style="color:#142984;margin:0 0 12px">New Contact Form Submission &mdash; CGreen</h2>'
        '<table style="border-collapse:collapse;width:100%;max-width:640px">'
        f'{trs}</table>'
        '<p style="color:#888;font-size:12px;margin-top:16px">Sent automatically from the cgreen.in contact form.</p>'
        '</div>'
    )


def _lead_email_text(sub):
    """Plain-text alternative. Mail that offers only HTML scores worse on spam filters."""
    return (
        "New Contact Form Submission - CGreen\n\n"
        f"First Name: {sub.first_name}\n"
        f"Last Name: {sub.last_name}\n"
        f"Email: {sub.email}\n"
        f"Subject: {sub.subject}\n"
        f"Accepted Terms: {'Yes' if sub.accepted_terms else 'No'}\n"
        f"Submitted At: {sub.created_at}\n\n"
        "Message:\n"
        f"{sub.message}\n\n"
        "--\nSent automatically from the cgreen.in contact form.\n"
    )


def _lead_subject(sub):
    return f"New Enquiry: {sub.subject} - {sub.first_name} {sub.last_name}"


def _send_via_smtp_blocking(sub):
    """Deliver one lead through SMTP. Runs in a worker thread; smtplib is blocking."""
    msg = EmailMessage()
    msg["Subject"] = _lead_subject(sub)
    msg["From"] = formataddr((SENDER_NAME, SENDER_EMAIL))
    msg["To"] = NOTIFY_TO
    # Replying to the notification answers the visitor directly.
    msg["Reply-To"] = formataddr((f"{sub.first_name} {sub.last_name}".strip(), sub.email))
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain=SENDER_EMAIL.split("@")[-1] or None)
    msg.set_content(_lead_email_text(sub))
    msg.add_alternative(_lead_email_html(sub), subtype="html")

    context = ssl.create_default_context()
    if SMTP_USE_SSL:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context, timeout=20) as smtp:
            smtp.login(SMTP_USER, SMTP_PASSWORD)
            smtp.send_message(msg)
    else:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as smtp:
            smtp.ehlo()
            smtp.starttls(context=context)
            smtp.ehlo()
            smtp.login(SMTP_USER, SMTP_PASSWORD)
            smtp.send_message(msg)
    return msg["Message-ID"]


async def _send_lead_email(sub) -> bool:
    """Email one lead to NOTIFY_EMAILS. Returns whether a transport accepted it."""
    if SMTP_CONFIGURED:
        try:
            message_id = await asyncio.to_thread(_send_via_smtp_blocking, sub)
            logger.info(f"Lead email sent via SMTP to {NOTIFY_TO} (message_id={message_id})")
            return True
        except Exception as e:
            logger.error(f"SMTP lead email failed: {e.__class__.__name__}: {e}")

    if RESEND_API_KEY:
        params = {
            "from": SENDER_EMAIL,
            "to": NOTIFY_EMAILS,
            "reply_to": sub.email,
            "subject": _lead_subject(sub),
            "html": _lead_email_html(sub),
            "text": _lead_email_text(sub),
        }
        try:
            result = await asyncio.to_thread(resend.Emails.send, params)
            logger.info(f"Lead email sent via Resend to {NOTIFY_TO} (id={result.get('id') if isinstance(result, dict) else result})")
            return True
        except Exception as e:
            logger.error(f"Resend lead email failed: {e.__class__.__name__}: {e}")
            return False

    if not SMTP_CONFIGURED:
        logger.warning("No email transport configured (set SMTP_HOST/SMTP_USER/SMTP_PASSWORD) - lead not emailed.")
    return False


# ---------- Models ----------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactSubmissionCreate(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr = Field(..., max_length=254)
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)
    accepted_terms: bool


class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    first_name: str
    last_name: str
    email: str
    subject: str
    message: str
    accepted_terms: bool
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "cGreen API is running"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


async def _store_submission(submission) -> bool:
    """Best-effort MongoDB backup. A database outage must not lose a lead."""
    try:
        await db.contact_submissions.insert_one(submission.model_dump())
        return True
    except Exception as e:
        logger.error(f"Failed to persist contact submission: {e.__class__.__name__}: {e}")
        return False


@api_router.post("/contact", response_model=ContactSubmission)
async def create_contact(input: ContactSubmissionCreate):
    # The email to NOTIFY_EMAILS is what the business acts on; MongoDB is only a
    # backup copy. Either one succeeding means the lead is not lost, so the
    # visitor sees an error only when both fail.
    submission = ContactSubmission(**input.model_dump())
    logger.info(f"New contact submission from {submission.email} - subject: {submission.subject}")
    emailed = await _send_lead_email(submission)
    stored = await _store_submission(submission)
    if not emailed and not stored:
        raise HTTPException(
            status_code=502,
            detail="Unable to deliver your message right now. Please email info@cgreen.in directly.",
        )
    return submission


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=[o.strip() for o in required_env('CORS_ORIGINS').split(',') if o.strip()],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def production_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    if request.url.path.startswith("/static/"):
        response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
    return response


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# The Docker image copies the compiled React application here. Keeping this
# conditional preserves backend-only development and test workflows.
STATIC_DIR = Path(os.environ.get('STATIC_DIR', ROOT_DIR / 'static')).resolve()
if STATIC_DIR.is_dir():
    static_assets = STATIC_DIR / 'static'
    if static_assets.is_dir():
        app.mount('/static', StaticFiles(directory=static_assets), name='static')

    @app.get('/{requested_path:path}', include_in_schema=False)
    async def serve_spa(requested_path: str):
        candidate = (STATIC_DIR / requested_path).resolve()
        try:
            candidate.relative_to(STATIC_DIR)
        except ValueError as exc:
            raise HTTPException(status_code=404) from exc

        if requested_path and candidate.is_file():
            return FileResponse(candidate)

        index_file = STATIC_DIR / 'index.html'
        if index_file.is_file():
            return FileResponse(index_file, headers={"Cache-Control": "no-cache"})
        raise HTTPException(status_code=404)
