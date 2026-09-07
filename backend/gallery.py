"""Gallery content: the one part of this website that is genuinely dynamic.

The shape mirrors what the public Life at CGreen page already renders - years,
each holding one or more labelled albums of photos - so the page's markup does
not have to change, only where its data comes from.
"""
import logging
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from pydantic import BaseModel, ConfigDict, Field

from security import require_admin
from storage import UnsupportedImage, get_storage

logger = logging.getLogger(__name__)

MAX_FILES_PER_UPLOAD = 20


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------- Models ----------
class AlbumCreate(BaseModel):
    year: str = Field(..., min_length=4, max_length=4, pattern=r'^\d{4}$')
    label: str = Field(..., min_length=1, max_length=80)
    sort_order: int = Field(default=0, ge=0, le=9999)


class AlbumUpdate(BaseModel):
    year: Optional[str] = Field(default=None, min_length=4, max_length=4, pattern=r'^\d{4}$')
    label: Optional[str] = Field(default=None, min_length=1, max_length=80)
    sort_order: Optional[int] = Field(default=None, ge=0, le=9999)


class PhotoUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=200)
    sort_order: Optional[int] = Field(default=None, ge=0, le=9999)
    is_cover: Optional[bool] = None


class Photo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    album_id: str
    url: str
    storage_key: str
    title: str = ""
    content_type: str = ""
    size: int = 0
    sort_order: int = 0
    is_cover: bool = False
    created_at: str


class Album(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    year: str
    label: str
    sort_order: int = 0
    created_at: str


class AlbumWithPhotos(Album):
    photos: List[Photo] = []


# ---------- Helpers ----------
async def _album_or_404(db, album_id: str) -> dict:
    album = await db.gallery_albums.find_one({"id": album_id}, {"_id": 0})
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    return album


async def _photo_or_404(db, photo_id: str) -> dict:
    photo = await db.gallery_photos.find_one({"id": photo_id}, {"_id": 0})
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    return photo


async def _albums_with_photos(db) -> List[dict]:
    albums = await db.gallery_albums.find({}, {"_id": 0}).to_list(500)
    photos = await db.gallery_photos.find({}, {"_id": 0}).to_list(5000)
    by_album: dict[str, list] = {}
    for photo in photos:
        by_album.setdefault(photo["album_id"], []).append(photo)
    for album in albums:
        album["photos"] = sorted(
            by_album.get(album["id"], []),
            key=lambda p: (p.get("sort_order", 0), p.get("created_at", "")),
        )
    # Newest year first, matching how the public timeline reads top to bottom.
    albums.sort(key=lambda a: (a.get("year", ""), -a.get("sort_order", 0)), reverse=True)
    return albums


# ---------- Route factory ----------
def build_routes(db):
    """Bind both routers to a database handle.

    The database lives in server.py, so the routes are constructed here rather
    than importing it and creating a cycle.
    """

    public = APIRouter(prefix="/api/gallery", tags=["gallery"])
    admin = APIRouter(
        prefix="/api/admin/gallery",
        tags=["admin-gallery"],
        dependencies=[Depends(require_admin)],
    )
    storage = get_storage()

    @public.get("", response_model=List[AlbumWithPhotos])
    async def list_gallery():
        """Public gallery feed. Returns [] when empty so the site can fall back."""
        try:
            return await _albums_with_photos(db)
        except Exception as e:
            # A visitor must never see a 500 because the database is down. An
            # empty feed makes the page render its built-in photos instead.
            logger.error("Gallery feed unavailable: %s: %s", e.__class__.__name__, e)
            return []

    # ----- Albums -----
    @admin.get("/albums", response_model=List[AlbumWithPhotos])
    async def admin_list_albums():
        return await _albums_with_photos(db)

    @admin.post("/albums", response_model=Album, status_code=status.HTTP_201_CREATED)
    async def create_album(payload: AlbumCreate):
        album = Album(
            id=str(uuid.uuid4()),
            year=payload.year,
            label=payload.label.strip(),
            sort_order=payload.sort_order,
            created_at=_now(),
        )
        await db.gallery_albums.insert_one(album.model_dump())
        logger.info("Album created: %s %s", album.year, album.label)
        return album

    @admin.patch("/albums/{album_id}", response_model=Album)
    async def update_album(album_id: str, payload: AlbumUpdate):
        await _album_or_404(db, album_id)
        changes = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
        if isinstance(changes.get("label"), str):
            changes["label"] = changes["label"].strip()
        if changes:
            await db.gallery_albums.update_one({"id": album_id}, {"$set": changes})
        return Album(**await _album_or_404(db, album_id))

    @admin.delete("/albums/{album_id}", status_code=status.HTTP_204_NO_CONTENT)
    async def delete_album(album_id: str):
        await _album_or_404(db, album_id)
        # Remove the stored files too, or the disk keeps growing invisibly.
        orphans = await db.gallery_photos.find({"album_id": album_id}, {"_id": 0}).to_list(5000)
        for photo in orphans:
            storage.delete(photo.get("storage_key", ""))
        await db.gallery_photos.delete_many({"album_id": album_id})
        await db.gallery_albums.delete_one({"id": album_id})
        logger.info("Album %s deleted with %d photo(s)", album_id, len(orphans))

    # ----- Photos -----
    @admin.post(
        "/albums/{album_id}/photos",
        response_model=List[Photo],
        status_code=status.HTTP_201_CREATED,
    )
    async def upload_photos(album_id: str, files: List[UploadFile] = File(...)):
        await _album_or_404(db, album_id)
        if not files:
            raise HTTPException(status_code=422, detail="No files were uploaded.")
        if len(files) > MAX_FILES_PER_UPLOAD:
            raise HTTPException(
                status_code=422,
                detail=f"Upload at most {MAX_FILES_PER_UPLOAD} images at a time.",
            )

        existing = await db.gallery_photos.count_documents({"album_id": album_id})
        saved: list[Photo] = []
        for index, upload in enumerate(files):
            data = await upload.read()
            try:
                key, content_type, size = storage.save(data, upload.filename or "photo")
            except UnsupportedImage as e:
                # Roll back this batch so a rejected file cannot leave half an
                # upload behind for the admin to clean up by hand.
                for done in saved:
                    storage.delete(done.storage_key)
                if saved:
                    await db.gallery_photos.delete_many(
                        {"id": {"$in": [p.id for p in saved]}}
                    )
                raise HTTPException(
                    status_code=422,
                    detail=f"{upload.filename or 'File'}: {e}",
                )
            photo = Photo(
                id=str(uuid.uuid4()),
                album_id=album_id,
                url=storage.url_for(key),
                storage_key=key,
                title="",
                content_type=content_type,
                size=size,
                sort_order=existing + index,
                # The first photo in an empty album becomes its cover.
                is_cover=(existing == 0 and index == 0),
                created_at=_now(),
            )
            await db.gallery_photos.insert_one(photo.model_dump())
            saved.append(photo)

        logger.info("Uploaded %d photo(s) to album %s", len(saved), album_id)
        return saved

    @admin.patch("/photos/{photo_id}", response_model=Photo)
    async def update_photo(photo_id: str, payload: PhotoUpdate):
        photo = await _photo_or_404(db, photo_id)
        changes = payload.model_dump(exclude_unset=True)
        if changes.get("is_cover"):
            # Exactly one cover per album.
            await db.gallery_photos.update_many(
                {"album_id": photo["album_id"]}, {"$set": {"is_cover": False}}
            )
        if isinstance(changes.get("title"), str):
            changes["title"] = changes["title"].strip()
        changes = {k: v for k, v in changes.items() if v is not None}
        if changes:
            await db.gallery_photos.update_one({"id": photo_id}, {"$set": changes})
        return Photo(**await _photo_or_404(db, photo_id))

    @admin.delete("/photos/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
    async def delete_photo(photo_id: str):
        photo = await _photo_or_404(db, photo_id)
        storage.delete(photo.get("storage_key", ""))
        await db.gallery_photos.delete_one({"id": photo_id})
        # Keep every album showing a cover where one is still possible.
        if photo.get("is_cover"):
            replacement = await db.gallery_photos.find_one(
                {"album_id": photo["album_id"]}, {"_id": 0}
            )
            if replacement:
                await db.gallery_photos.update_one(
                    {"id": replacement["id"]}, {"$set": {"is_cover": True}}
                )
        logger.info("Photo %s deleted", photo_id)

    return public, admin
