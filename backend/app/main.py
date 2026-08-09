"""
main.py

FastAPI application factory.
Creates and configures the FastAPI app instance for Naghanish.

To run:
    uvicorn app.main:app --reload
"""

from fastapi import FastAPI
from app.api.router import api_router
from app.middleware.cors import setup_cors


def create_application() -> FastAPI:
    """Create and configure the FastAPI application."""

    application = FastAPI(
        title="Naghanish API 🧠",
        description="AI-powered entertainment platform API for Naghanish",
        version="0.1.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
    )

    # Enable CORS
    setup_cors(application)

    # Include API Routers under /api/v1
    application.include_router(api_router, prefix="/api/v1")

    @application.get("/", tags=["Health"])
    def root():
        return {
            "status": "online",
            "app": "Naghanish API 🧠",
            "docs": "/api/docs",
            "version": "0.1.0"
        }

    return application


app = create_application()
