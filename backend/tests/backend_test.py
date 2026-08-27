"""Backend API tests for cGreen landing page."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://cgreen-finance-reach.preview.emergentagent.com').rstrip('/')


@pytest.fixture
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# Health
def test_health(api):
    r = api.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    data = r.json()
    assert "message" in data
    assert "cGreen" in data["message"]


# Contact submission
class TestContact:
    def test_create_and_list(self, api):
        payload = {
            "first_name": "TEST_John",
            "last_name": "Doe",
            "email": "test_john@example.com",
            "subject": "Partnership",
            "message": "Hello, this is a test submission.",
            "accepted_terms": True,
        }
        r = api.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == payload["email"]
        assert data["first_name"] == payload["first_name"]
        assert data["accepted_terms"] == True
        assert "id" in data and isinstance(data["id"], str)
        assert "created_at" in data

        created_id = data["id"]

        # GET list
        r2 = api.get(f"{BASE_URL}/api/contact")
        assert r2.status_code == 200
        listing = r2.json()
        assert isinstance(listing, list)
        ids = [item["id"] for item in listing]
        assert created_id in ids

    def test_invalid_email(self, api):
        payload = {
            "first_name": "TEST_Bad",
            "last_name": "Email",
            "email": "not-an-email",
            "subject": "Test",
            "message": "msg",
            "accepted_terms": True,
        }
        r = api.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 422

    def test_missing_fields(self, api):
        r = api.post(f"{BASE_URL}/api/contact", json={"email": "x@y.com"})
        assert r.status_code == 422
