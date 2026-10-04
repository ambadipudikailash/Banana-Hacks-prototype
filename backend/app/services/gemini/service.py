"""Gemini API Service Abstraction Layer."""

from typing import Optional
from backend.app.core.config import settings


class GeminiService:
    """Abstraction layer for Google Gemini API integration."""

    def __init__(self, api_key: Optional[str] = None):
        """Initialize the Gemini service with an explicit or default API key."""
        self._api_key = api_key if api_key is not None else settings.GEMINI_API_KEY

    def is_configured(self) -> bool:
        """Check whether a valid Gemini API key is configured."""
        return bool(self._api_key and self._api_key.strip())

    def get_client(self):
        """Retrieve initialized Gemini client instance.

        Raises:
            ValueError: If Gemini API key is missing or not configured.
        """
        if not self.is_configured():
            raise ValueError(
                "Gemini API key is not configured. Please set GEMINI_API_KEY in environment or .env."
            )

        # Lazy import of google.genai to avoid hard runtime failure if SDK not initialized
        from google import genai

        return genai.Client(api_key=self._api_key)

    async def analyze_visual_input(self, image_bytes: bytes) -> None:
        """Placeholder interface for visual reverse-engineering analysis.

        Full vision analysis pipeline will be implemented in Milestone 3.
        """
        if not self.is_configured():
            raise ValueError("Gemini API key is not configured.")
        raise NotImplementedError(
            "Vision analysis pipeline is scheduled for Milestone 3 implementation."
        )
