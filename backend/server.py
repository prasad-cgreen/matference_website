from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
import resend
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ---------- Email (Resend) ----------
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
NOTIFY_EMAIL = os.environ.get('NOTIFY_EMAIL', 'info@cgreen.in')
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
        '<h2 style="color:#142984;margin:0 0 12px">New Contact Form Submission — CGreen</h2>'
        '<table style="border-collapse:collapse;width:100%;max-width:640px">'
        f'{trs}</table>'
        '<p style="color:#888;font-size:12px;margin-top:16px">Sent automatically from the cgreen.in contact form.</p>'
        '</div>'
    )


async def _send_lead_email(sub):
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not set — skipping lead email notification.")
        return
    params = {
        "from": SENDER_EMAIL,
        "to": [NOTIFY_EMAIL],
        "reply_to": sub.email,
        "subject": f"New Enquiry: {sub.subject} — {sub.first_name} {sub.last_name}",
        "html": _lead_email_html(sub),
    }
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Lead email sent to {NOTIFY_EMAIL} (id={result.get('id') if isinstance(result, dict) else result})")
    except Exception as e:
        logger.error(f"Failed to send lead email: {e}")



# ---------- Models ----------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactSubmissionCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    subject: str
    message: str
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


@api_router.post("/contact", response_model=ContactSubmission)
async def create_contact(input: ContactSubmissionCreate):
    # Persist the lead to MongoDB (backup) and email a notification to info@cgreen.in.
    # An email failure is logged but never blocks the user's confirmation.
    submission = ContactSubmission(**input.model_dump())
    await db.contact_submissions.insert_one(submission.model_dump())
    logger.info(f"New contact submission from {submission.email} — subject: {submission.subject}")
    await _send_lead_email(submission)
    return submission


@api_router.get("/contact", response_model=List[ContactSubmission])
async def list_contacts():
    subs = await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return subs


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
