"""Contact-form submissions, readable by the administrator.

The public ``POST /api/contact`` writes leads here as a backup to the
notification email. There is deliberately no public read route - an
unauthenticated one existed once and leaked every lead's name, email and
message - so this admin router is the only way back to a submission after the
email has been filed away.
"""
import logging
import re
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, ConfigDict, Field

from security import require_admin

logger = logging.getLogger(__name__)

MAX_PAGE_SIZE = 100
SEARCH_FIELDS = ("first_name", "last_name", "email", "subject", "message")


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    first_name: str = ""
    last_name: str = ""
    email: str = ""
    subject: str = ""
    message: str = ""
    accepted_terms: bool = False
    created_at: str = ""
    # Set the first time the administrator opens the enquiry. Absent on every
    # row written before this field existed, which reads correctly as unread.
    read_at: Optional[str] = None


class EnquiryPage(BaseModel):
    items: List[Enquiry]
    total: int
    unread: int


class EnquiryUpdate(BaseModel):
    is_read: bool


def _search_filter(q: str) -> dict:
    """Case-insensitive substring match across the fields worth searching.

    The term is regex-escaped: it arrives from a query string, and an
    unescaped `(` or `*` would otherwise be a syntax error or a pathological
    pattern rather than a search for those characters.
    """
    pattern = {"$regex": re.escape(q), "$options": "i"}
    return {"$or": [{field: pattern} for field in SEARCH_FIELDS]}


def build_routes(db):
    """Bind the router to a database handle owned by server.py."""

    admin = APIRouter(
        prefix="/api/admin/enquiries",
        tags=["admin-enquiries"],
        dependencies=[Depends(require_admin)],
    )

    async def _or_404(enquiry_id: str) -> dict:
        found = await db.contact_submissions.find_one({"id": enquiry_id}, {"_id": 0})
        if not found:
            raise HTTPException(status_code=404, detail="Enquiry not found")
        return found

    @admin.get("", response_model=EnquiryPage)
    async def list_enquiries(
        q: str = Query(default="", max_length=200),
        limit: int = Query(default=25, ge=1, le=MAX_PAGE_SIZE),
        offset: int = Query(default=0, ge=0),
    ):
        term = q.strip()
        query = _search_filter(term) if term else {}
        # Newest first: an enquiry is only useful while it is still fresh.
        cursor = db.contact_submissions.find(query, {"_id": 0}).sort("created_at", -1)
        rows = await cursor.skip(offset).limit(limit).to_list(limit)
        return EnquiryPage(
            items=[Enquiry(**row) for row in rows],
            total=await db.contact_submissions.count_documents(query),
            # Unread counts the whole inbox, not the filtered page, so the
            # sidebar badge does not change as the administrator searches.
            unread=await db.contact_submissions.count_documents({"read_at": None}),
        )

    @admin.get("/{enquiry_id}", response_model=Enquiry)
    async def get_enquiry(enquiry_id: str):
        return Enquiry(**await _or_404(enquiry_id))

    @admin.patch("/{enquiry_id}", response_model=Enquiry)
    async def update_enquiry(enquiry_id: str, changes: EnquiryUpdate):
        await _or_404(enquiry_id)
        await db.contact_submissions.update_one(
            {"id": enquiry_id},
            {"$set": {"read_at": _now() if changes.is_read else None}},
        )
        return Enquiry(**await _or_404(enquiry_id))

    @admin.delete("/{enquiry_id}", status_code=204)
    async def delete_enquiry(enquiry_id: str):
        await _or_404(enquiry_id)
        await db.contact_submissions.delete_one({"id": enquiry_id})
        logger.info("Admin deleted enquiry %s", enquiry_id)

    return admin
