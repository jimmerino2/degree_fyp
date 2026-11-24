from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_diagnose_returns_mock():
    files = {
        "whole_plant": ("plant.jpg", b"\xff\xd8fake", "image/jpeg"),
        "leaf_underside": ("leaf.jpg", b"\xff\xd8fake", "image/jpeg"),
    }
    r = client.post("/api/diagnose", files=files)
    assert r.status_code == 200
    assert r.json()["mock"] is True


def test_diagnose_rejects_non_image():
    files = {
        "whole_plant": ("a.txt", b"hi", "text/plain"),
        "leaf_underside": ("leaf.jpg", b"\xff\xd8", "image/jpeg"),
    }
    assert client.post("/api/diagnose", files=files).status_code == 415
