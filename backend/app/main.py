"""FastAPI Application Entry Point."""

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.health import router as health_router
from backend.app.core.config import settings


def create_application() -> FastAPI:
    """Factory function to build and configure the FastAPI application."""
    app = FastAPI(
        title="Visual Reverse Engineering API",
        description="Backend API and AI engine for system visual reverse engineering.",
        version="0.1.0",
    )

    # Configure CORS middleware
    if settings.CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.CORS_ORIGINS,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # Main API router under /api prefix
    api_router = APIRouter(prefix="/api")
    api_router.include_router(health_router, tags=["Health"])

    app.include_router(api_router)

    return app


app = create_application()
