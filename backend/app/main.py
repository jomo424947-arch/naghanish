"""
main.py

FastAPI application factory.
Creates and configures the FastAPI app instance.

To run:
    uvicorn app.main:app --reload
"""

from fastapi import FastAPI

# TODO: Import and register components as they are implemented:
# from app.api.router import api_router
# from app.core.config import settings
# from app.middleware.cors import setup_cors
# from app.middleware.logging import setup_logging


def create_application() -> FastAPI:
    """Create and configure the FastAPI application."""

    application = FastAPI(
        title="Naghanish API",
        description="AI-powered entertainment platform API",
        version="0.1.0",
        # TODO: Set docs_url=None and redoc_url=None in production
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
    )

    # TODO: Register middleware (order matters — outermost first)
    # setup_cors(application)
    # setup_logging(application)

    # TODO: Register event handlers
    # @application.on_event("startup")
    # async def startup(): ...

    # TODO: Register routers
    # application.include_router(api_router, prefix="/api/v1")

    return application


app = create_application()
