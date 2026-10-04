"""Tests for configuration settings."""

from backend.app.core.config import Settings


def test_default_settings_values():
    """Verify default settings values when env is empty."""
    s = Settings(_env_file=None, GEMINI_API_KEY="")
    assert s.BACKEND_PORT == 8000
    assert s.ENVIRONMENT == "development"
    assert s.GEMINI_API_KEY == ""
    assert isinstance(s.CORS_ORIGINS, list)
