from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)
PREFIX = "/iam/users"


def _create(email="a@example.com", full_name="Ada Lovelace"):
    resp = client.post(PREFIX, json={"email": email, "full_name": full_name})
    assert resp.status_code == 201
    return resp.json()


def test_create_and_get_user():
    user = _create()
    assert user["id"]
    assert user["is_active"] is True

    resp = client.get(f"{PREFIX}/{user['id']}")
    assert resp.status_code == 200
    assert resp.json()["email"] == "a@example.com"


def test_list_users():
    _create(email="list@example.com")
    resp = client.get(PREFIX)
    assert resp.status_code == 200
    assert any(u["email"] == "list@example.com" for u in resp.json())


def test_update_user_is_partial():
    user = _create(email="upd@example.com", full_name="Old Name")
    resp = client.patch(f"{PREFIX}/{user['id']}", json={"full_name": "New Name"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["full_name"] == "New Name"
    assert body["email"] == "upd@example.com"  # untouched


def test_delete_user():
    user = _create(email="del@example.com")
    assert client.delete(f"{PREFIX}/{user['id']}").status_code == 204
    assert client.get(f"{PREFIX}/{user['id']}").status_code == 404


def test_get_missing_user_returns_404():
    resp = client.get(f"{PREFIX}/does-not-exist")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "user not found"
