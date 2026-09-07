"""Admin enquiries API, exercised in-process.

MongoDB is replaced with an in-memory double, so this suite needs no database,
no network and no credentials.
"""
import importlib
import os
import sys
from pathlib import Path

import pytest

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

ADMIN_EMAIL = "admin@cgreen.in"
ADMIN_PASSWORD = "correct-horse-battery-staple"


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
        # Blank, not absent: load_dotenv() will not overwrite a key that is
        # already set, so these shadow any real credentials in backend/.env and
        # keep the seeded submissions below from emailing the live inbox.
        SMTP_HOST="",
        SMTP_USER="",
        SMTP_PASSWORD="",
        RESEND_API_KEY="",
    )
    os.environ.pop("ADMIN_PASSWORD", None)

    import motor.motor_asyncio
    from mongomock_motor import AsyncMongoMockClient

    motor.motor_asyncio.AsyncIOMotorClient = lambda *a, **k: AsyncMongoMockClient()

    for module in ("server", "gallery", "enquiries", "security", "storage"):
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


def _submit(client, first, subject="Partnership", message="Please call me back."):
    r = client.post(
        "/api/contact",
        json={
            "first_name": first,
            "last_name": "Sharma",
            "email": f"{first.lower()}@example.com",
            "subject": subject,
            "message": message,
            "accepted_terms": True,
        },
    )
    assert r.status_code == 200, r.text
    return r.json()


@pytest.fixture(scope="module")
def seeded(client):
    return [
        _submit(client, "Asha", subject="Lending partnership"),
        _submit(client, "Bhavna", subject="Careers", message="Any openings for analysts?"),
        _submit(client, "Chetan", subject="Media query"),
    ]


class TestRouteGuard:
    def test_enquiries_require_a_token(self, client):
        assert client.get("/api/admin/enquiries").status_code == 401
        assert client.patch("/api/admin/enquiries/x", json={"is_read": True}).status_code == 401
        assert client.delete("/api/admin/enquiries/x").status_code == 401

    def test_there_is_no_public_read_route(self, client):
        # The unauthenticated GET /api/contact was removed as a PII leak and
        # must not come back by way of this feature.
        assert client.get("/api/contact").status_code == 405


class TestListing:
    def test_returns_every_submission_newest_first(self, client, auth, seeded):
        body = client.get("/api/admin/enquiries", headers=auth).json()
        assert body["total"] == 3
        assert [item["first_name"] for item in body["items"]] == ["Chetan", "Bhavna", "Asha"]

    def test_everything_starts_unread(self, client, auth, seeded):
        body = client.get("/api/admin/enquiries", headers=auth).json()
        assert body["unread"] == 3
        assert all(item["read_at"] is None for item in body["items"])

    def test_search_matches_across_fields(self, client, auth, seeded):
        by_name = client.get("/api/admin/enquiries?q=bhavna", headers=auth).json()
        assert [i["first_name"] for i in by_name["items"]] == ["Bhavna"]

        by_message = client.get("/api/admin/enquiries?q=analysts", headers=auth).json()
        assert [i["first_name"] for i in by_message["items"]] == ["Bhavna"]

        by_subject = client.get("/api/admin/enquiries?q=LENDING", headers=auth).json()
        assert [i["first_name"] for i in by_subject["items"]] == ["Asha"]

    def test_regex_characters_are_searched_literally(self, client, auth, seeded):
        # An unescaped "(" would be a bad-pattern 500 rather than a search.
        r = client.get("/api/admin/enquiries?q=%28", headers=auth)
        assert r.status_code == 200
        assert r.json()["items"] == []

    def test_unread_count_ignores_the_search_filter(self, client, auth, seeded):
        body = client.get("/api/admin/enquiries?q=bhavna", headers=auth).json()
        assert body["total"] == 1
        assert body["unread"] == 3

    def test_pagination(self, client, auth, seeded):
        page = client.get("/api/admin/enquiries?limit=2&offset=1", headers=auth).json()
        assert [i["first_name"] for i in page["items"]] == ["Bhavna", "Asha"]
        assert page["total"] == 3

    def test_limit_is_capped(self, client, auth, seeded):
        assert client.get("/api/admin/enquiries?limit=5000", headers=auth).status_code == 422


class TestReadAndDelete:
    def test_marking_read_lowers_the_unread_count(self, client, auth, seeded):
        target = seeded[0]["id"]
        r = client.patch(f"/api/admin/enquiries/{target}", json={"is_read": True}, headers=auth)
        assert r.status_code == 200, r.text
        assert r.json()["read_at"]

        assert client.get("/api/admin/enquiries", headers=auth).json()["unread"] == 2

        # ...and marking it unread again puts it back.
        client.patch(f"/api/admin/enquiries/{target}", json={"is_read": False}, headers=auth)
        assert client.get("/api/admin/enquiries", headers=auth).json()["unread"] == 3

    def test_delete_removes_it(self, client, auth):
        created = _submit(client, "Deepa")
        assert client.delete(f"/api/admin/enquiries/{created['id']}", headers=auth).status_code == 204
        assert client.get(f"/api/admin/enquiries/{created['id']}", headers=auth).status_code == 404

    def test_unknown_id_is_404_not_500(self, client, auth):
        assert client.get("/api/admin/enquiries/nope", headers=auth).status_code == 404
        assert client.delete("/api/admin/enquiries/nope", headers=auth).status_code == 404
        r = client.patch("/api/admin/enquiries/nope", json={"is_read": True}, headers=auth)
        assert r.status_code == 404


class TestSystemStatus:
    def test_requires_a_token(self, client):
        assert client.get("/api/admin/system").status_code == 401

    def test_reports_status_without_leaking_secrets(self, client, auth):
        body = client.get("/api/admin/system", headers=auth).json()
        assert body["database"]["name"] == "cgreen_test"
        assert body["email"]["transport"] == "none"
        assert body["email"]["configured"] is False
        assert body["session"]["admin_email"] == ADMIN_EMAIL
        assert body["session"]["token_ttl_hours"] > 0
        assert body["storage"]["max_upload_mb"] > 0
        # No credential should appear anywhere in the payload.
        blob = str(body).lower()
        assert ADMIN_PASSWORD not in blob
        assert "test-secret-not-used-in-production" not in blob
