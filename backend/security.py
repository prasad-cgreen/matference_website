"""Admin authentication: password hashing, JWT issuing, and the route guard.

There is exactly one administrator, seeded from environment variables. That is a
deliberate choice for a site this size: it removes an entire user-management
surface (invite flows, role checks, password reset) that would otherwise need to
be built and secured for a single person.
"""
import base64
import hashlib
import hmac
import logging
import os
import secrets
import time
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

logger = logging.getLogger(__name__)

ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', '').strip().lower()
ADMIN_PASSWORD_HASH = os.environ.get('ADMIN_PASSWORD_HASH', '').strip()
# Convenience for local development only: a plaintext password is hashed at
# startup so a developer can get running without generating a hash first.
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', '')

TOKEN_TTL_HOURS = int(os.environ.get('ADMIN_TOKEN_TTL_HOURS', '12'))
# bcrypt silently ignores bytes past 72; reject instead of truncating, so a long
# password can never be accepted on the strength of its first 72 bytes alone.
MAX_PASSWORD_BYTES = 72

_JWT_ALGORITHM = "HS256"


def _resolve_secret() -> str:
    secret = os.environ.get('ADMIN_JWT_SECRET', '').strip()
    if secret:
        return secret
    # An ephemeral secret keeps local development frictionless. It changes on
    # every restart, so sessions do not survive a reload - which is exactly why
    # production must set a real one.
    logger.warning(
        "ADMIN_JWT_SECRET is not set. Using a random per-process secret: admin "
        "sessions will not survive a restart. Set it before deploying."
    )
    return secrets.token_urlsafe(48)


JWT_SECRET = _resolve_secret()


def _resolve_password_hash() -> str:
    if ADMIN_PASSWORD_HASH:
        return ADMIN_PASSWORD_HASH
    if ADMIN_PASSWORD:
        logger.warning(
            "ADMIN_PASSWORD is set in plaintext. Prefer ADMIN_PASSWORD_HASH "
            "(generate one with: python make_admin_password.py)."
        )
        return hash_password(ADMIN_PASSWORD)
    return ''


def hash_password(plain: str) -> str:
    encoded = plain.encode('utf-8')
    if len(encoded) > MAX_PASSWORD_BYTES:
        raise ValueError(f"Password must be at most {MAX_PASSWORD_BYTES} bytes")
    return bcrypt.hashpw(encoded, bcrypt.gensalt()).decode('utf-8')


def verify_password(plain: str, hashed: str) -> bool:
    encoded = plain.encode('utf-8')
    if not hashed or len(encoded) > MAX_PASSWORD_BYTES:
        return False
    try:
        return bcrypt.checkpw(encoded, hashed.encode('utf-8'))
    except (ValueError, TypeError):
        # A malformed hash in configuration must read as "wrong password"
        # rather than crashing the login endpoint.
        logger.error("ADMIN_PASSWORD_HASH is not a valid bcrypt hash.")
        return False


ADMIN_HASH = _resolve_password_hash()
ADMIN_CONFIGURED = bool(ADMIN_EMAIL and ADMIN_HASH)

if not ADMIN_CONFIGURED:
    logger.warning(
        "Admin panel is disabled: set ADMIN_EMAIL and ADMIN_PASSWORD_HASH "
        "(or ADMIN_PASSWORD) to enable it."
    )


# ---------- Brute-force throttling ----------
# In-process and therefore per-worker, which is the right trade for a
# single-admin panel: it needs no shared store, and an attacker gains only as
# many attempts as there are workers.
_FAILED_ATTEMPTS: dict[str, list[float]] = {}
MAX_ATTEMPTS = 5
LOCKOUT_SECONDS = 300


def _prune(attempts: list[float]) -> list[float]:
    cutoff = time.monotonic() - LOCKOUT_SECONDS
    return [t for t in attempts if t > cutoff]


def throttle_check(client_key: str) -> int:
    """Return seconds remaining in a lockout, or 0 when the caller may proceed."""
    attempts = _prune(_FAILED_ATTEMPTS.get(client_key, []))
    _FAILED_ATTEMPTS[client_key] = attempts
    if len(attempts) < MAX_ATTEMPTS:
        return 0
    return max(1, int(LOCKOUT_SECONDS - (time.monotonic() - min(attempts))))


def record_failure(client_key: str) -> None:
    _FAILED_ATTEMPTS.setdefault(client_key, []).append(time.monotonic())


def clear_failures(client_key: str) -> None:
    _FAILED_ATTEMPTS.pop(client_key, None)


def client_key(request: Request) -> str:
    return request.client.host if request.client else 'unknown'


# ---------- Tokens ----------
def create_access_token(subject: str) -> tuple[str, int]:
    """Issue a signed session token. Returns the token and its lifetime in seconds."""
    expires_in = TOKEN_TTL_HOURS * 3600
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "role": "admin",
        "iat": now,
        "exp": now + timedelta(seconds=expires_in),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=_JWT_ALGORITHM), expires_in


_bearer = HTTPBearer(auto_error=False)


async def require_admin(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> str:
    """FastAPI dependency guarding every mutating admin route."""
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None or not credentials.credentials:
        raise unauthorized
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[_JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise unauthorized

    subject = payload.get("sub", "")
    # A token stays valid only while it still names the configured admin, so
    # changing ADMIN_EMAIL immediately invalidates sessions for the old one.
    if payload.get("role") != "admin" or not subject:
        raise unauthorized
    if not hmac.compare_digest(subject.lower(), ADMIN_EMAIL):
        raise unauthorized
    return subject


def authenticate(email: str, password: str) -> bool:
    """Constant-time-ish credential check that does not reveal which half failed."""
    if not ADMIN_CONFIGURED:
        return False
    email_ok = hmac.compare_digest(email.strip().lower(), ADMIN_EMAIL)
    # Always run the bcrypt comparison so a wrong email costs the same as a
    # wrong password, leaking nothing through response timing.
    password_ok = verify_password(password, ADMIN_HASH)
    return email_ok and password_ok
