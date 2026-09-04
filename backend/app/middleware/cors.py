from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings


def setup_cors(app: FastAPI) -> None:
    """
    Configure CORS for Web client, Mobile apps (Flutter / React Native),
    local emulators (Android 10.0.2.2, iOS Simulator), and dev environments.
    """
    origins = settings.cors_origins + [
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://10.0.2.2:8000",
        "capacitor://localhost",
        "ionic://localhost",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(set(origins)),
        allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|10\.0\.2\.2)(:\d+)?",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
