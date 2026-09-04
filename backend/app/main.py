"""
main.py

FastAPI application factory.
Creates and configures the FastAPI app instance for Naghanish.

To run:
    uvicorn app.main:app --reload
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket
from app.api.router import api_router
from app.middleware.cors import setup_cors
from app.database.engine import engine
from app.database.base import Base

# Import all models to ensure they are registered with Base metadata
import app.models.user  # noqa: F401
import app.models.game  # noqa: F401
import app.models.quiz  # noqa: F401
import app.models.leaderboard  # noqa: F401
import app.models.achievement  # noqa: F401
import app.models.mission  # noqa: F401
import app.models.room  # noqa: F401
import app.models.economy  # noqa: F401
import app.models.friend  # noqa: F401
import app.models.notification  # noqa: F401
import app.models.auth  # noqa: F401
import app.models.ai  # noqa: F401




from app.database.engine import AsyncSessionLocal
from app.database.seed import seed_initial_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager."""
    # Create database tables if they do not exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Seed initial games and quizzes data
    async with AsyncSessionLocal() as session:
        await seed_initial_data(session)
        
    yield



def create_application() -> FastAPI:
    """Create and configure the FastAPI application."""

    application = FastAPI(
        title="Naghanish API 🧠",
        description="AI-powered entertainment platform API for Naghanish",
        version="0.1.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
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

    @application.websocket("/api/v1/ws/room/{room_code}")
    async def websocket_room_endpoint(websocket: WebSocket, room_code: str):
        """Real-time multiplayer room WebSocket channel."""
        from app.websocket.manager import ws_manager
        from fastapi import WebSocketDisconnect

        await ws_manager.connect_room(websocket, room_code)
        try:
            while True:
                data = await websocket.receive_json()
                event_name = data.get("event", "player_action")
                payload = data.get("data", {})
                await ws_manager.broadcast_to_room(room_code, event_name, payload)
        except WebSocketDisconnect:
            await ws_manager.disconnect_room(websocket, room_code)
        except Exception:
            await ws_manager.disconnect_room(websocket, room_code)

    return application


app = create_application()


