"""
config/settings.py

Application settings loaded from environment variables via Pydantic Settings.
All configuration must be read from this module — never from os.environ directly.
"""

from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # App
    APP_ENV: str = "development"
    APP_NAME: str = "Naghanish"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./naghanish.db"

    # Security
    SECRET_KEY: str = "naghanish-super-secret-key-change-in-production-2026"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"

    @property
    def cors_origins(self) -> List[str]:
        if isinstance(self.ALLOWED_ORIGINS, list):
            return self.ALLOWED_ORIGINS
        return [item.strip() for item in str(self.ALLOWED_ORIGINS).split(",") if item.strip()]



@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

