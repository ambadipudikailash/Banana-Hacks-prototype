"""Tests for Health Check API Endpoint."""

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_health_endpoint_returns_200_and_ok():
    """Verify GET /api/health responds with HTTP 200 and status ok."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
