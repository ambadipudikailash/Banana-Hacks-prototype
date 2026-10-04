"""Health check API router."""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class HealthResponse(BaseModel):
    """Health check status response schema."""

    status: str


@router.get("/health", response_model=HealthResponse)
async def get_health() -> HealthResponse:
    """Simple deterministic health status check."""
    return HealthResponse(status="ok")
