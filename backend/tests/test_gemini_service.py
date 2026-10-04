"""Tests for Gemini Service Abstraction."""

import asyncio
import pytest
from backend.app.services.gemini.service import GeminiService


def test_gemini_service_not_configured_by_default():
    """Verify is_configured returns False when no API key provided."""
    service = GeminiService(api_key="")
    assert service.is_configured() is False


def test_gemini_service_configured_with_key():
    """Verify is_configured returns True when valid key is provided."""
    service = GeminiService(api_key="test_dummy_key")
    assert service.is_configured() is True


def test_get_client_raises_value_error_when_unconfigured():
    """Verify get_client raises ValueError when key is missing."""
    service = GeminiService(api_key="")
    with pytest.raises(ValueError) as exc_info:
        service.get_client()
    assert "Gemini API key is not configured" in str(exc_info.value)


def test_analyze_visual_input_raises_not_implemented():
    """Verify analyze_visual_input raises NotImplementedError when configured."""
    service = GeminiService(api_key="test_dummy_key")
    with pytest.raises(NotImplementedError) as exc_info:
        asyncio.run(service.analyze_visual_input(b"fake_image_data"))
    assert "Milestone 3" in str(exc_info.value)
