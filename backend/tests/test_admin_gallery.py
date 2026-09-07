"""Admin auth and gallery API, exercised in-process.

MongoDB is replaced with an in-memory double and uploads go to a temp directory,
so this suite needs no database, no network and no credentials. Unlike the other
files here, which drive a deployed URL, these tests run the real app object.
"""
import importlib
import os
import struct
import sys
import zlib
from pathlib import Path

import pytest

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

ADMIN_EMAIL = "admin@cgreen.in"
ADMIN_PASSWORD = "correct-horse-battery-staple"


def _png_bytes(width: int = 4, height: int = 4) -> bytes:
    """A real, minimal PNG. The API sniffs magic bytes, so this must be genuine."""

    def chunk(tag: bytes, payload: bytes) -> bytes:
        return (
            struct.pack(">I", len(payload))
            + tag
            + payload
            + struct.pack(">I", zlib.crc32(tag + payload) & 0xFFFFFFFF)
        )

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    raw = b"".join(b"\x00" + b"\xff\x00\x00" * width for _ in range(height))
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", zlib.compress(raw))
        + chunk(b"IEND", b"")
    )


@pytest.fixture(scope="module")
def client(tmp_path_factory):
    uploads = tmp_path_factory.mktemp("uploads")

    import bcrypt

    os.environ.update(
        MONGO_URL="mongodb://127.0.0.1:27017",
        DB_NAME="cgreen_test",
        CORS_ORIGINS="http://localhost:3000",
        ADMIN_EMAIL=ADMIN_EMAIL,
        # Set the hash explicitly. server.py calls load_dotenv(), and a real
        # backend/.env would otherwise supply the production hash and make every
        # login here fail against the test password.
        ADMIN_PASSWORD_HASH=bcrypt.hashpw(
            ADMIN_PASSWORD.encode(), bcrypt.gensalt(rounds=4)
        ).decode(),
        ADMIN_JWT_SECRET="test-secret-not-used-in-production",
        UPLOAD_DIR=str(uploads),
        STATIC_DIR=str(uploads / "no-static-here"),
        # Blank, not absent. load_dotenv() does not overwrite a key that is
        # already present, so these empty values shadow any real credentials in
        # backend/.env - without them the contact-form tests below would send
        # genuine email to the live inbox on every run.
        SMTP_HOST="",
        SMTP_USER="",
        SMTP_PASSWORD="",
        RESEND_API_KEY="",
    )
    os.environ.pop("ADMIN_PASSWORD", None)

    # Swap the driver before server.py binds it at import time.
    import motor.motor_asyncio
    from mongomock_motor import AsyncMongoMockClient

    motor.motor_asyncio.AsyncIOMotorClient = lambda *a, **k: AsyncMongoMockClient()

    for module in ("server", "gallery", "security", "storage"):
        sys.modules.pop(module, None)
    server = importlib.import_module("server")

    from fastapi.testclient import TestClient

    with TestClient(server.app) as test_client:
        yield test_client


@pytest.fixture(scope="module")
def auth(client):
    r = client.post("/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


class TestAdminLogin:
    def test_correct_credentials_return_a_token(self, client):
        r = client.post(
            "/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["token_type"] == "bearer"
        assert body["email"] == ADMIN_EMAIL
        assert body["expires_in"] > 0
        assert len(body["access_token"]) > 40

    def test_wrong_password_is_rejected(self, client):
        r = client.post(
            "/api/admin/login", json={"email": ADMIN_EMAIL, "password": "not-the-password"}
        )
        assert r.status_code == 401
        # The message must not reveal which half was wrong.
        assert "email or password" in r.json()["detail"].lower()

    def test_unknown_email_gives_the_same_error(self, client):
        r = client.post(
            "/api/admin/login", json={"email": "someone@else.com", "password": ADMIN_PASSWORD}
        )
        assert r.status_code == 401
        assert "email or password" in r.json()["detail"].lower()

    def test_malformed_email_is_validation_error(self, client):
        r = client.post("/api/admin/login", json={"email": "nope", "password": "x"})
        assert r.status_code == 422


class TestRouteGuard:
    def test_admin_routes_require_a_token(self, client):
        assert client.get("/api/admin/gallery/albums").status_code == 401
        assert client.post("/api/admin/gallery/albums", json={}).status_code == 401
        assert client.get("/api/admin/me").status_code == 401

    def test_garbage_token_is_rejected(self, client):
        r = client.get(
            "/api/admin/gallery/albums", headers={"Authorization": "Bearer not.a.jwt"}
        )
        assert r.status_code == 401

    def test_token_signed_with_another_secret_is_rejected(self, client):
        import jwt as pyjwt
        from datetime import datetime, timedelta, timezone

        forged = pyjwt.encode(
            {
                "sub": ADMIN_EMAIL,
                "role": "admin",
                "exp": datetime.now(timezone.utc) + timedelta(hours=1),
            },
            "attacker-chosen-secret",
            algorithm="HS256",
        )
        r = client.get(
            "/api/admin/gallery/albums", headers={"Authorization": f"Bearer {forged}"}
        )
        assert r.status_code == 401

    def test_valid_token_is_accepted(self, client, auth):
        r = client.get("/api/admin/me", headers=auth)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL


class TestAlbums:
    def test_create_list_update_delete(self, client, auth):
        created = client.post(
            "/api/admin/gallery/albums",
            json={"year": "2026", "label": "Diwali", "sort_order": 1},
            headers=auth,
        )
        assert created.status_code == 201, created.text
        album = created.json()
        assert album["year"] == "2026"
        assert album["label"] == "Diwali"

        listed = client.get("/api/admin/gallery/albums", headers=auth)
        assert listed.status_code == 200
        assert any(a["id"] == album["id"] for a in listed.json())

        renamed = client.patch(
            f"/api/admin/gallery/albums/{album['id']}",
            json={"label": "Diwali 2026"},
            headers=auth,
        )
        assert renamed.status_code == 200
        assert renamed.json()["label"] == "Diwali 2026"

        gone = client.delete(f"/api/admin/gallery/albums/{album['id']}", headers=auth)
        assert gone.status_code == 204
        assert client.patch(
            f"/api/admin/gallery/albums/{album['id']}", json={"label": "x"}, headers=auth
        ).status_code == 404

    def test_year_must_be_four_digits(self, client, auth):
        r = client.post(
            "/api/admin/gallery/albums",
            json={"year": "26", "label": "Bad year"},
            headers=auth,
        )
        assert r.status_code == 422

    def test_missing_album_is_404(self, client, auth):
        r = client.delete("/api/admin/gallery/albums/does-not-exist", headers=auth)
        assert r.status_code == 404


class TestPhotos:
    @pytest.fixture
    def album(self, client, auth):
        r = client.post(
            "/api/admin/gallery/albums",
            json={"year": "2025", "label": "Picnic"},
            headers=auth,
        )
        assert r.status_code == 201
        return r.json()

    def test_upload_sets_first_photo_as_cover(self, client, auth, album):
        r = client.post(
            f"/api/admin/gallery/albums/{album['id']}/photos",
            files=[
                ("files", ("one.png", _png_bytes(), "image/png")),
                ("files", ("two.png", _png_bytes(), "image/png")),
            ],
            headers=auth,
        )
        assert r.status_code == 201, r.text
        photos = r.json()
        assert len(photos) == 2
        assert photos[0]["is_cover"] is True
        assert photos[1]["is_cover"] is False
        assert photos[0]["content_type"] == "image/png"
        assert photos[0]["size"] > 0
        # The stored name is generated, never the client's.
        assert photos[0]["storage_key"] != "one.png"
        assert photos[0]["url"].startswith("/uploads/")

    def test_uploaded_file_is_actually_served(self, client, auth, album):
        r = client.post(
            f"/api/admin/gallery/albums/{album['id']}/photos",
            files=[("files", ("served.png", _png_bytes(), "image/png"))],
            headers=auth,
        )
        assert r.status_code == 201
        url = r.json()[0]["url"]
        fetched = client.get(url)
        assert fetched.status_code == 200
        assert fetched.content.startswith(b"\x89PNG")

    def test_non_image_is_rejected(self, client, auth, album):
        r = client.post(
            f"/api/admin/gallery/albums/{album['id']}/photos",
            files=[("files", ("evil.png", b"#!/bin/sh\nrm -rf /", "image/png"))],
            headers=auth,
        )
        # Claiming image/png does not make it one; the bytes decide.
        assert r.status_code == 422
        assert "jpeg" in r.json()["detail"].lower()

    def test_rejected_batch_leaves_nothing_behind(self, client, auth, album):
        before = client.get("/api/admin/gallery/albums", headers=auth).json()
        count_before = sum(len(a["photos"]) for a in before if a["id"] == album["id"])

        r = client.post(
            f"/api/admin/gallery/albums/{album['id']}/photos",
            files=[
                ("files", ("good.png", _png_bytes(), "image/png")),
                ("files", ("bad.png", b"not an image at all", "image/png")),
            ],
            headers=auth,
        )
        assert r.status_code == 422

        after = client.get("/api/admin/gallery/albums", headers=auth).json()
        count_after = sum(len(a["photos"]) for a in after if a["id"] == album["id"])
        assert count_after == count_before, "a failed batch must not persist the good file"

    def test_retitle_and_change_cover(self, client, auth, album):
        uploaded = client.post(
            f"/api/admin/gallery/albums/{album['id']}/photos",
            files=[
                ("files", ("a.png", _png_bytes(), "image/png")),
                ("files", ("b.png", _png_bytes(), "image/png")),
            ],
            headers=auth,
        ).json()

        titled = client.patch(
            f"/api/admin/gallery/photos/{uploaded[0]['id']}",
            json={"title": "  Team lunch  "},
            headers=auth,
        )
        assert titled.status_code == 200
        assert titled.json()["title"] == "Team lunch"

        promoted = client.patch(
            f"/api/admin/gallery/photos/{uploaded[1]['id']}",
            json={"is_cover": True},
            headers=auth,
        )
        assert promoted.status_code == 200
        assert promoted.json()["is_cover"] is True

        albums = client.get("/api/admin/gallery/albums", headers=auth).json()
        this_album = next(a for a in albums if a["id"] == album["id"])
        covers = [p for p in this_album["photos"] if p["is_cover"]]
        assert len(covers) == 1, "an album must have exactly one cover"

    def test_deleting_the_cover_promotes_another(self, client, auth, album):
        uploaded = client.post(
            f"/api/admin/gallery/albums/{album['id']}/photos",
            files=[
                ("files", ("c.png", _png_bytes(), "image/png")),
                ("files", ("d.png", _png_bytes(), "image/png")),
            ],
            headers=auth,
        ).json()
        cover = next(p for p in uploaded if p["is_cover"])

        assert client.delete(
            f"/api/admin/gallery/photos/{cover['id']}", headers=auth
        ).status_code == 204

        albums = client.get("/api/admin/gallery/albums", headers=auth).json()
        this_album = next(a for a in albums if a["id"] == album["id"])
        assert any(p["is_cover"] for p in this_album["photos"])

    def test_deleting_album_removes_its_photos(self, client, auth):
        album = client.post(
            "/api/admin/gallery/albums",
            json={"year": "2024", "label": "Temporary"},
            headers=auth,
        ).json()
        photo = client.post(
            f"/api/admin/gallery/albums/{album['id']}/photos",
            files=[("files", ("gone.png", _png_bytes(), "image/png"))],
            headers=auth,
        ).json()[0]

        assert client.get(photo["url"]).status_code == 200
        assert client.delete(
            f"/api/admin/gallery/albums/{album['id']}", headers=auth
        ).status_code == 204
        # The file is removed from storage, not just the database row.
        assert client.get(photo["url"]).status_code == 404


class TestPublicFeed:
    def test_public_gallery_needs_no_token(self, client):
        r = client.get("/api/gallery")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_public_feed_exposes_uploaded_photos(self, client, auth):
        album = client.post(
            "/api/admin/gallery/albums",
            json={"year": "2023", "label": "Offsite"},
            headers=auth,
        ).json()
        client.post(
            f"/api/admin/gallery/albums/{album['id']}/photos",
            files=[("files", ("e.png", _png_bytes(), "image/png"))],
            headers=auth,
        )
        feed = client.get("/api/gallery").json()
        match = next((a for a in feed if a["id"] == album["id"]), None)
        assert match is not None
        assert len(match["photos"]) == 1
        assert match["photos"][0]["url"].startswith("/uploads/")


class TestContactFormUntouched:
    """The brief's first priority: none of this may disturb the contact form."""

    def test_contact_still_accepts_a_submission(self, client):
        r = client.post(
            "/api/contact",
            json={
                "first_name": "Asha",
                "last_name": "Verma",
                "email": "asha@example.com",
                "subject": "Partnership",
                "message": "Still working.",
                "accepted_terms": True,
            },
        )
        assert r.status_code == 200, r.text
        assert r.json()["email"] == "asha@example.com"

    def test_contact_still_validates(self, client):
        r = client.post("/api/contact", json={"email": "x@y.com"})
        assert r.status_code == 422

    def test_contact_is_not_behind_admin_auth(self, client):
        r = client.post(
            "/api/contact",
            json={
                "first_name": "No",
                "last_name": "Token",
                "email": "anon@example.com",
                "subject": "Book a demo",
                "message": "Visitors are not logged in.",
                "accepted_terms": True,
            },
        )
        assert r.status_code == 200

    def test_health_endpoint_unchanged(self, client):
        r = client.get("/api/")
        assert r.status_code == 200
        assert "cGreen" in r.json()["message"]
