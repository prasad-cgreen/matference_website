"""Editable website content: the sections an administrator maintains by hand.

Two shapes cover everything here:

* **Singletons** - one block of copy per section (Vision & Mission, Our Reach).
* **Groups** - ordered lists of cards (people, partner logos, lender logos).

Both are seeded from ``site_defaults`` the first time the app runs, so the panel
opens on the website's real content instead of empty forms. The public route is
read-only and unauthenticated; everything that writes sits behind the admin
guard.
"""
import logging
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from pydantic import BaseModel, ConfigDict, Field, ValidationError, field_validator

import site_defaults
from security import require_admin
from storage import UnsupportedImage, get_storage

logger = logging.getLogger(__name__)

GROUPS = site_defaults.GROUPS
SINGLETONS = site_defaults.SINGLETONS
MAX_ITEMS_PER_GROUP = 200


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _clean_url(value: str, field: str) -> str:
    """Allow a site-relative path or an http(s) address, and nothing else.

    Both of these end up in the public page's ``src`` and ``href`` attributes,
    so a ``javascript:`` value saved here would be a stored XSS on the live
    website. The check is a whitelist rather than a blacklist for that reason.
    """
    url = (value or "").strip()
    if not url:
        return ""
    if url.startswith("/") and not url.startswith("//"):
        return url
    if url.startswith("http://") or url.startswith("https://"):
        return url
    raise ValueError(f"{field} must start with '/', 'http://' or 'https://'")


# ---------- Models ----------
class Stat(BaseModel):
    value: str = Field(default="", max_length=20)
    label: str = Field(default="", max_length=40)


class VisionMission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    heading: str = Field(default="", max_length=120)
    vision_title: str = Field(default="", max_length=60)
    vision_body: str = Field(default="", max_length=4000)
    mission_title: str = Field(default="", max_length=60)
    mission_body: str = Field(default="", max_length=4000)


class OurReach(BaseModel):
    model_config = ConfigDict(extra="ignore")
    heading: str = Field(default="", max_length=120)
    subheading: str = Field(default="", max_length=120)
    map_image: str = Field(default="", max_length=500)
    stats: List[Stat] = Field(default_factory=list, max_length=8)

    @field_validator("map_image")
    @classmethod
    def _check_map_image(cls, v):
        return _clean_url(v, "map_image")


SINGLETON_MODELS = {"vision_mission": VisionMission, "our_reach": OurReach}


class SiteItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    group: str
    name: str = ""
    title: str = ""
    bio: str = ""
    link: str = ""
    image_url: str = ""
    # Set only when the image was uploaded here, so replacing or deleting the
    # item knows whether there is a file of ours to clean up.
    storage_key: str = ""
    sort_order: int = 0
    created_at: str = ""


class ItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    title: str = Field(default="", max_length=160)
    bio: str = Field(default="", max_length=1200)
    link: str = Field(default="", max_length=500)
    image_url: str = Field(default="", max_length=500)

    @field_validator("link")
    @classmethod
    def _check_link(cls, v):
        return _clean_url(v, "link")

    @field_validator("image_url")
    @classmethod
    def _check_image(cls, v):
        return _clean_url(v, "image_url")


class ItemUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    title: Optional[str] = Field(default=None, max_length=160)
    bio: Optional[str] = Field(default=None, max_length=1200)
    link: Optional[str] = Field(default=None, max_length=500)
    image_url: Optional[str] = Field(default=None, max_length=500)

    @field_validator("link")
    @classmethod
    def _check_link(cls, v):
        return v if v is None else _clean_url(v, "link")

    @field_validator("image_url")
    @classmethod
    def _check_image(cls, v):
        return v if v is None else _clean_url(v, "image_url")


class Reorder(BaseModel):
    ids: List[str] = Field(..., max_length=MAX_ITEMS_PER_GROUP)


class SiteContent(BaseModel):
    singletons: Dict[str, dict]
    groups: Dict[str, List[SiteItem]]


# ---------- Seeding ----------
async def ensure_seeded(db) -> None:
    """Populate empty content collections with what the website already shows.

    A record of what has been seeded is kept, so an administrator who
    deliberately empties a section does not find it refilled on the next
    restart.
    """
    meta = await db.site_meta.find_one({"id": "seed"}, {"_id": 0}) or {}
    seeded = set(meta.get("seeded", []))
    added = []

    for key in SINGLETONS:
        if key in seeded:
            continue
        if not await db.site_singletons.find_one({"key": key}):
            await db.site_singletons.insert_one(
                {"key": key, "value": site_defaults.SINGLETON_DEFAULTS[key], "updated_at": _now()}
            )
        added.append(key)

    for group in GROUPS:
        if group in seeded:
            continue
        if not await db.site_items.count_documents({"group": group}):
            rows = [
                SiteItem(
                    id=str(uuid.uuid4()),
                    group=group,
                    sort_order=index,
                    created_at=_now(),
                    **entry,
                ).model_dump()
                for index, entry in enumerate(site_defaults.GROUP_DEFAULTS[group])
            ]
            if rows:
                await db.site_items.insert_many(rows)
        added.append(group)

    if added:
        await db.site_meta.update_one(
            {"id": "seed"},
            {"$set": {"id": "seed", "seeded": sorted(seeded.union(added))}},
            upsert=True,
        )
        logger.info("Seeded website content: %s", ", ".join(added))


# ---------- Reads ----------
async def _read_singletons(db) -> Dict[str, dict]:
    rows = await db.site_singletons.find({}, {"_id": 0}).to_list(50)
    stored = {row["key"]: row.get("value", {}) for row in rows}
    # Any key never written still answers with its default, so the public page
    # never has to cope with a missing section.
    return {
        key: SINGLETON_MODELS[key](
            **{**site_defaults.SINGLETON_DEFAULTS[key], **stored.get(key, {})}
        ).model_dump()
        for key in SINGLETONS
    }


async def _read_groups(db) -> Dict[str, List[SiteItem]]:
    rows = await db.site_items.find({}, {"_id": 0}).to_list(2000)
    grouped: Dict[str, List[SiteItem]] = {group: [] for group in GROUPS}
    for row in rows:
        if row.get("group") in grouped:
            grouped[row["group"]].append(SiteItem(**row))
    for items in grouped.values():
        items.sort(key=lambda item: (item.sort_order, item.created_at))
    return grouped


# ---------- Route factory ----------
def build_routes(db):
    public = APIRouter(prefix="/api/content", tags=["content"])
    admin = APIRouter(
        prefix="/api/admin/content",
        tags=["admin-content"],
        dependencies=[Depends(require_admin)],
    )
    storage = get_storage()

    def _valid_group(group: str) -> str:
        if group not in GROUPS:
            raise HTTPException(status_code=404, detail="Unknown content group")
        return group

    def _valid_key(key: str) -> str:
        if key not in SINGLETONS:
            raise HTTPException(status_code=404, detail="Unknown content section")
        return key

    async def _item_or_404(item_id: str) -> dict:
        item = await db.site_items.find_one({"id": item_id}, {"_id": 0})
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        return item

    async def _content() -> SiteContent:
        return SiteContent(singletons=await _read_singletons(db), groups=await _read_groups(db))

    @public.get("", response_model=SiteContent)
    async def get_public_content():
        return await _content()

    @admin.get("", response_model=SiteContent)
    async def get_admin_content():
        return await _content()

    @admin.put("/singletons/{key}")
    async def put_singleton(key: str, payload: dict):
        _valid_key(key)
        model = SINGLETON_MODELS[key]
        # Validated through the section's own model, so an unknown or oversized
        # field is rejected here rather than reaching the live page. The body
        # arrives as a plain dict, so this validation is ours to translate:
        # without it a bad value would surface as a 500 instead of a 422.
        try:
            value = model(**payload).model_dump()
        except ValidationError as e:
            # Only loc/msg/type: pydantic's raw errors carry the original
            # exception object in `ctx`, which cannot be serialised to JSON.
            raise HTTPException(
                status_code=422,
                detail=[
                    {"loc": list(err["loc"]), "msg": err["msg"], "type": err["type"]}
                    for err in e.errors(include_url=False)
                ],
            )
        await db.site_singletons.update_one(
            {"key": key},
            {"$set": {"key": key, "value": value, "updated_at": _now()}},
            upsert=True,
        )
        logger.info("Admin updated site section %s", key)
        return value

    @admin.get("/groups/{group}", response_model=List[SiteItem])
    async def list_group(group: str):
        _valid_group(group)
        return (await _read_groups(db))[group]

    @admin.post("/groups/{group}", response_model=SiteItem, status_code=status.HTTP_201_CREATED)
    async def create_item(group: str, payload: ItemCreate):
        _valid_group(group)
        if await db.site_items.count_documents({"group": group}) >= MAX_ITEMS_PER_GROUP:
            raise HTTPException(
                status_code=422,
                detail=f"This section is limited to {MAX_ITEMS_PER_GROUP} entries.",
            )
        last = await db.site_items.find({"group": group}, {"_id": 0, "sort_order": 1}).to_list(
            MAX_ITEMS_PER_GROUP
        )
        item = SiteItem(
            id=str(uuid.uuid4()),
            group=group,
            sort_order=max((row.get("sort_order", 0) for row in last), default=-1) + 1,
            created_at=_now(),
            **payload.model_dump(),
        )
        await db.site_items.insert_one(item.model_dump())
        return item

    @admin.patch("/items/{item_id}", response_model=SiteItem)
    async def update_item(item_id: str, payload: ItemUpdate):
        await _item_or_404(item_id)
        changes = payload.model_dump(exclude_unset=True, exclude_none=True)
        if changes:
            await db.site_items.update_one({"id": item_id}, {"$set": changes})
        return SiteItem(**await _item_or_404(item_id))

    @admin.post("/items/{item_id}/image", response_model=SiteItem)
    async def upload_item_image(item_id: str, file: UploadFile = File(...)):
        item = await _item_or_404(item_id)
        data = await file.read()
        try:
            key, _content_type, _size = storage.save(data, file.filename or "image")
        except UnsupportedImage as e:
            raise HTTPException(status_code=422, detail=str(e))

        previous = item.get("storage_key", "")
        await db.site_items.update_one(
            {"id": item_id},
            {"$set": {"image_url": storage.url_for(key), "storage_key": key}},
        )
        # Only ever remove a file this panel uploaded. Defaults point at images
        # bundled with the site, which must survive being replaced.
        if previous:
            storage.delete(previous)
        return SiteItem(**await _item_or_404(item_id))

    @admin.post("/uploads")
    async def upload_image(file: UploadFile = File(...)):
        """Store one image and hand back its URL.

        Used by sections whose picture is not attached to a list item - the Our
        Reach map, for instance. The caller decides what to do with the URL, so
        a replaced file is not deleted here; that is the trade for keeping this
        endpoint independent of any one section's shape.
        """
        data = await file.read()
        try:
            key, content_type, size = storage.save(data, file.filename or "image")
        except UnsupportedImage as e:
            raise HTTPException(status_code=422, detail=str(e))
        logger.info("Admin uploaded image %s (%d bytes)", key, size)
        return {"url": storage.url_for(key), "storage_key": key, "content_type": content_type}

    @admin.post("/groups/{group}/reorder", response_model=List[SiteItem])
    async def reorder_group(group: str, payload: Reorder):
        _valid_group(group)
        existing = {
            row["id"]
            for row in await db.site_items.find({"group": group}, {"_id": 0, "id": 1}).to_list(
                MAX_ITEMS_PER_GROUP
            )
        }
        unknown = [item_id for item_id in payload.ids if item_id not in existing]
        if unknown:
            raise HTTPException(status_code=422, detail="Unknown item in the new order")
        for position, item_id in enumerate(payload.ids):
            await db.site_items.update_one({"id": item_id}, {"$set": {"sort_order": position}})
        return (await _read_groups(db))[group]

    @admin.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
    async def delete_item(item_id: str):
        item = await _item_or_404(item_id)
        await db.site_items.delete_one({"id": item_id})
        if item.get("storage_key"):
            storage.delete(item["storage_key"])
        logger.info("Admin deleted %s item %s", item.get("group"), item_id)

    return public, admin
