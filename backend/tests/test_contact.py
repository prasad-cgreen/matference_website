"""Backend tests for POST/GET /api/contact endpoint (cGreen contact form)."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://cgreen-landing.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def test_root(client):
    r = client.get(f"{API}/")
    assert r.status_code == 200


def test_contact_post_valid(client):
    payload = {
        "first_name": "TEST_John",
        "last_name": "Doe",
        "email": "test_john@example.com",
        "subject": "Partnership",
        "message": "Interested in partnering.",
        "accepted_terms": True,
    }
    r = client.post(f"{API}/contact", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["email"] == payload["email"]
    assert data["first_name"] == payload["first_name"]
    assert data["accepted_terms"] is True
    assert "id" in data and isinstance(data["id"], str)
    assert "created_at" in data
    # Verify persisted via GET
    listing = client.get(f"{API}/contact")
    assert listing.status_code == 200
    ids = [d["id"] for d in listing.json()]
    assert data["id"] in ids


def test_contact_post_missing_terms(client):
    payload = {
        "first_name": "TEST_Jane",
        "last_name": "Roe",
        "email": "test_jane@example.com",
        "subject": "Demo",
        "message": "Please demo.",
    }
    r = client.post(f"{API}/contact", json=payload)
    assert r.status_code == 422


def test_contact_post_invalid_terms_type(client):
    payload = {
        "first_name": "TEST_Jane",
        "last_name": "Roe",
        "email": "test_jane@example.com",
        "subject": "Demo",
        "message": "Please demo.",
        "accepted_terms": "not-a-bool-xyz",
    }
    r = client.post(f"{API}/contact", json=payload)
    assert r.status_code == 422


def test_contact_post_invalid_email(client):
    payload = {
        "first_name": "TEST_X",
        "last_name": "Y",
        "email": "not-an-email",
        "subject": "Demo",
        "message": "hi",
        "accepted_terms": True,
    }
    r = client.post(f"{API}/contact", json=payload)
    assert r.status_code == 422


def test_contact_get_no_mongo_id(client):
    r = client.get(f"{API}/contact")
    assert r.status_code == 200
    for d in r.json():
        assert "_id" not in d
