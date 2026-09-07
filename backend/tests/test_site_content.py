"""Editable website content, exercised in-process against an in-memory MongoDB."""
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
        ADMIN_PASSWORD_HASH=bcrypt.hashpw(
            ADMIN_PASSWORD.encode(), bcrypt.gensalt(rounds=4)
        ).decode(),
        ADMIN_JWT_SECRET="test-secret-not-used-in-production",
        UPLOAD_DIR=str(uploads),
        STATIC_DIR=str(uploads / "no-static-here"),
        SMTP_HOST="",
        SMTP_USER="",
        SMTP_PASSWORD="",
        RESEND_API_KEY="",
    )
    os.environ.pop("ADMIN_PASSWORD", None)
    os.environ.pop("CONTACT_EMAIL_ENABLED", None)

    import motor.motor_asyncio
    from mongomock_motor import AsyncMongoMockClient

    motor.motor_asyncio.AsyncIOMotorClient = lambda *a, **k: AsyncMongoMockClient()

    for module in ("server", "gallery", "enquiries", "site_content", "security", "storage"):
        sys.modules.pop(module, None)
    server = importlib.import_module("server")

    from fastapi.testclient import TestClient

    # The context manager runs startup, which is what seeds the content.
    with TestClient(server.app) as test_client:
        yield test_client


@pytest.fixture(scope="module")
def auth(client):
    r = client.post("/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


class TestSeeding:
    """Only what stays true regardless of what the editing tests below do."""

    def test_every_section_is_present_and_populated(self, client):
        body = client.get("/api/content").json()
        assert set(body["groups"]) == {
            "team",
            "nominee_directors",
            "advisors",
            "partners",
            "lenders",
        }
        assert {m["name"] for m in body["groups"]["team"]} >= {
            "Vipr Raj Bhardwaj",
            "Vineet Singh",
        }
        assert {m["name"] for m in body["groups"]["lenders"]} >= {"Axis Bank", "Paytm"}

    def test_singletons_are_present(self, client):
        singletons = client.get("/api/content").json()["singletons"]
        assert set(singletons) == {"vision_mission", "our_reach"}
        assert singletons["vision_mission"]["heading"]


class TestRouteGuard:
    def test_reading_content_is_public(self, client):
        assert client.get("/api/content").status_code == 200

    def test_every_write_needs_a_token(self, client):
        assert client.get("/api/admin/content").status_code == 401
        assert client.put("/api/admin/content/singletons/vision_mission", json={}).status_code == 401
        assert client.post("/api/admin/content/groups/team", json={"name": "X"}).status_code == 401
        assert client.patch("/api/admin/content/items/x", json={}).status_code == 401
        assert client.delete("/api/admin/content/items/x").status_code == 401


class TestSingletons:
    def test_editing_vision_shows_up_publicly(self, client, auth):
        current = client.get("/api/content").json()["singletons"]["vision_mission"]
        current["vision_body"] = "A shorter vision."
        r = client.put(
            "/api/admin/content/singletons/vision_mission", json=current, headers=auth
        )
        assert r.status_code == 200, r.text
        public = client.get("/api/content").json()["singletons"]["vision_mission"]
        assert public["vision_body"] == "A shorter vision."
        # Untouched fields survive the round trip.
        assert public["heading"] == "VISION AND MISSION"

    def test_reach_stats_can_be_rewritten(self, client, auth):
        payload = {
            "heading": "OUR REACH",
            "subheading": "FOOTPRINT",
            "map_image": "/india-map-final.png",
            "stats": [{"value": "40+", "label": "Lenders"}, {"value": "5", "label": "States"}],
        }
        r = client.put("/api/admin/content/singletons/our_reach", json=payload, headers=auth)
        assert r.status_code == 200, r.text
        assert len(client.get("/api/content").json()["singletons"]["our_reach"]["stats"]) == 2

    def test_unknown_section_is_404(self, client, auth):
        r = client.put("/api/admin/content/singletons/nope", json={}, headers=auth)
        assert r.status_code == 404

    def test_a_javascript_image_url_is_rejected(self, client, auth):
        payload = {"heading": "x", "subheading": "y", "map_image": "javascript:alert(1)", "stats": []}
        r = client.put("/api/admin/content/singletons/our_reach", json=payload, headers=auth)
        assert r.status_code == 422


class TestGroupItems:
    def test_add_edit_and_remove_an_advisor(self, client, auth):
        created = client.post(
            "/api/admin/content/groups/advisors",
            json={
                "name": "Meera Iyer",
                "title": "Advisor",
                "bio": "Two decades in rural credit.",
                "link": "https://www.linkedin.com/in/example/",
            },
            headers=auth,
        )
        assert created.status_code == 201, created.text
        item = created.json()
        assert item["group"] == "advisors"

        assert client.get("/api/content").json()["groups"]["advisors"][0]["name"] == "Meera Iyer"

        edited = client.patch(
            f"/api/admin/content/items/{item['id']}",
            json={"title": "Senior Advisor"},
            headers=auth,
        )
        assert edited.status_code == 200
        assert edited.json()["title"] == "Senior Advisor"
        # A partial update must not blank the fields it did not mention.
        assert edited.json()["name"] == "Meera Iyer"

        assert client.delete(f"/api/admin/content/items/{item['id']}", headers=auth).status_code == 204
        assert client.get("/api/content").json()["groups"]["advisors"] == []

    def test_a_new_item_goes_to_the_end(self, client, auth):
        r = client.post(
            "/api/admin/content/groups/partners", json={"name": "Zeta Fund"}, headers=auth
        )
        assert r.status_code == 201
        partners = client.get("/api/content").json()["groups"]["partners"]
        assert partners[-1]["name"] == "Zeta Fund"
        client.delete(f"/api/admin/content/items/{r.json()['id']}", headers=auth)

    def test_reordering(self, client, auth):
        before = client.get("/api/admin/content/groups/team", headers=auth).json()
        flipped = [before[1]["id"], before[0]["id"]] + [i["id"] for i in before[2:]]
        r = client.post(
            "/api/admin/content/groups/team/reorder", json={"ids": flipped}, headers=auth
        )
        assert r.status_code == 200, r.text
        after = client.get("/api/content").json()["groups"]["team"]
        assert after[0]["name"] == before[1]["name"]
        assert after[1]["name"] == before[0]["name"]

    def test_reorder_rejects_an_unknown_id(self, client, auth):
        r = client.post(
            "/api/admin/content/groups/team/reorder", json={"ids": ["not-a-real-id"]}, headers=auth
        )
        assert r.status_code == 422

    def test_unknown_group_is_404(self, client, auth):
        assert client.get("/api/admin/content/groups/aliens", headers=auth).status_code == 404
        r = client.post("/api/admin/content/groups/aliens", json={"name": "X"}, headers=auth)
        assert r.status_code == 404

    def test_a_name_is_required(self, client, auth):
        r = client.post("/api/admin/content/groups/partners", json={"name": ""}, headers=auth)
        assert r.status_code == 422

    def test_javascript_links_are_rejected(self, client, auth):
        r = client.post(
            "/api/admin/content/groups/advisors",
            json={"name": "Mallory", "link": "javascript:alert(document.cookie)"},
            headers=auth,
        )
        assert r.status_code == 422

    def test_protocol_relative_image_is_rejected(self, client, auth):
        r = client.post(
            "/api/admin/content/groups/partners",
            json={"name": "Mallory", "image_url": "//evil.example.com/logo.png"},
            headers=auth,
        )
        assert r.status_code == 422


class TestImageUpload:
    def test_uploading_replaces_the_image(self, client, auth):
        created = client.post(
            "/api/admin/content/groups/partners", json={"name": "Logo Test"}, headers=auth
        ).json()

        r = client.post(
            f"/api/admin/content/items/{created['id']}/image",
            files={"file": ("logo.png", _png_bytes(), "image/png")},
            headers=auth,
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["image_url"].startswith("/uploads/")
        assert body["storage_key"]

        # The file is really on disk and served back.
        assert client.get(body["image_url"]).status_code == 200

        client.delete(f"/api/admin/content/items/{created['id']}", headers=auth)

    def test_a_non_image_is_rejected(self, client, auth):
        created = client.post(
            "/api/admin/content/groups/partners", json={"name": "Bad Upload"}, headers=auth
        ).json()
        r = client.post(
            f"/api/admin/content/items/{created['id']}/image",
            files={"file": ("notes.txt", b"just text, not an image", "text/plain")},
            headers=auth,
        )
        assert r.status_code == 422
        client.delete(f"/api/admin/content/items/{created['id']}", headers=auth)


class TestContactFormUnchanged:
    """The form keeps working exactly as before - it just no longer emails."""

    def test_a_submission_is_still_accepted_and_stored(self, client, auth):
        r = client.post(
            "/api/contact",
            json={
                "first_name": "Ravi",
                "last_name": "Kumar",
                "email": "ravi@example.com",
                "subject": "Partner With Us",
                "message": "Please get in touch.",
                "accepted_terms": True,
            },
        )
        assert r.status_code == 200, r.text
        assert r.json()["email"] == "ravi@example.com"

        inbox = client.get("/api/admin/enquiries", headers=auth).json()
        assert any(i["email"] == "ravi@example.com" for i in inbox["items"])

    def test_validation_is_unchanged(self, client):
        assert client.post("/api/contact", json={}).status_code == 422
        bad_email = {
            "first_name": "A",
            "last_name": "B",
            "email": "not-an-email",
            "subject": "s",
            "message": "m",
            "accepted_terms": True,
        }
        assert client.post("/api/contact", json=bad_email).status_code == 422

    def test_no_email_is_sent(self, client, monkeypatch):
        import server

        assert server.CONTACT_EMAIL_ENABLED is False

        calls = []
        monkeypatch.setattr(server, "_send_lead_email", lambda s: calls.append(s))
        r = client.post(
            "/api/contact",
            json={
                "first_name": "Nina",
                "last_name": "Rao",
                "email": "nina@example.com",
                "subject": "Careers",
                "message": "Hello.",
                "accepted_terms": True,
            },
        )
        assert r.status_code == 200
        assert calls == [], "the contact form must not send email"

    def test_system_status_reports_notifications_off(self, client, auth):
        body = client.get("/api/admin/system", headers=auth).json()
        assert body["email"]["notifications_enabled"] is False
