"""Seeding, checked against a database nothing else has touched.

These assertions are about exact counts and ordering, so they need their own
app instance: the editing tests in ``test_site_content.py`` add and remove rows
in the same collections, and the two suites can run in either order.
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
        SMTP_HOST="",
        SMTP_USER="",
        SMTP_PASSWORD="",
        RESEND_API_KEY="",
    )
    os.environ.pop("ADMIN_PASSWORD", None)

    import motor.motor_asyncio
    from mongomock_motor import AsyncMongoMockClient

    motor.motor_asyncio.AsyncIOMotorClient = lambda *a, **k: AsyncMongoMockClient()

    for module in ("server", "gallery", "enquiries", "site_content", "security", "storage"):
        sys.modules.pop(module, None)
    server = importlib.import_module("server")

    from fastapi.testclient import TestClient

    with TestClient(server.app) as test_client:
        yield test_client


@pytest.fixture(scope="module")
def content(client):
    r = client.get("/api/content")
    assert r.status_code == 200, r.text
    return r.json()


class TestSeededGroups:
    def test_managing_team_matches_the_live_site(self, content):
        team = content["groups"]["team"]
        assert [m["name"] for m in team] == [
            "Vipr Raj Bhardwaj",
            "Vinay Shetty",
            "Nikhar Agrawal",
            "Dipanshu Rajpurohit",
            "Makrand Manjrekar",
           
        ]
        assert team[0]["title"] == "Co-Founder, MD & CEO"
        assert team[0]["image_url"] == "/team/vipr.png"
        assert team[0]["link"].startswith("https://www.linkedin.com/")

    def test_nominee_directors(self, content):
        assert [m["name"] for m in content["groups"]["nominee_directors"]] == [
            "Vikas Guru",
            "Ankit Kumar",
        ]

    def test_advisors_start_empty(self, content):
        # The live page shows a "Coming Soon" card; seeding must not invent people.
        assert content["groups"]["advisors"] == []

    def test_partner_and_lender_logos(self, content):
        partners = content["groups"]["partners"]
        lenders = content["groups"]["lenders"]
        assert len(partners) == 10
        assert len(lenders) == 30
        assert partners[0]["name"] == "IIMA Ventures"
        assert lenders[0]["image_url"] == "/lenders/union-bank.png"
        assert all(item["image_url"].startswith("/") for item in partners + lenders)

    def test_items_are_ordered(self, content):
        for group, items in content["groups"].items():
            orders = [i["sort_order"] for i in items]
            assert orders == sorted(orders), group


class TestSeededSingletons:
    def test_vision_and_mission(self, content):
        block = content["singletons"]["vision_mission"]
        assert block["heading"] == "VISION AND MISSION"
        assert block["vision_title"] == "VISION"
        assert "Bharat's most trusted" in block["vision_body"]
        assert "200 districts" in block["mission_body"]

    def test_our_reach(self, content):
        reach = content["singletons"]["our_reach"]
        assert reach["heading"] == "OUR REACH"
        assert reach["subheading"] == "OUR FOOTPRINT IN ACTION"
        assert reach["map_image"] == "/india-map-final.png"
        assert [s["value"] for s in reach["stats"]] == ["29+", "3", "35", "957K+"]


class TestSeedingIsIdempotent:
    """Seeding runs on every startup, so it must be safe to run repeatedly."""

    @staticmethod
    def _reseed():
        import server
        import site_content
        from anyio.from_thread import start_blocking_portal

        with start_blocking_portal() as portal:
            portal.call(site_content.ensure_seeded, server.db)

    def test_running_the_seed_again_does_not_duplicate_rows(self, client, content):
        before = [m["name"] for m in content["groups"]["team"]]
        self._reseed()
        after = [m["name"] for m in client.get("/api/content").json()["groups"]["team"]]
        assert after == before

    def test_an_emptied_section_stays_empty(self, client):
        """Deleting everything in a section must survive the next restart."""
        r = client.post(
            "/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        auth = {"Authorization": f"Bearer {r.json()['access_token']}"}

        for item in client.get("/api/admin/content/groups/partners", headers=auth).json():
            deleted = client.delete(f"/api/admin/content/items/{item['id']}", headers=auth)
            assert deleted.status_code == 204

        self._reseed()

        assert client.get("/api/content").json()["groups"]["partners"] == []
