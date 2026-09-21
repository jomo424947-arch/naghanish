"""
config/settings.py

Application settings loaded from environment variables via Pydantic Settings.
All configuration must be read from this module — never from os.environ directly.
"""

import secrets
from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Placeholder value shipped in .env.example. Refused in production.
INSECURE_SECRET_PLACEHOLDER = "change-me"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # App
    APP_ENV: str = "development"
    APP_NAME: str = "Naghanish"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./naghanish.db"
    DB_ECHO: bool = False

    # Security
    SECRET_KEY: str = ""
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    ALGORITHM: str = "HS256"

    # Schema management: in production Alembic owns the schema, so create_all is skipped.
    RUN_CREATE_ALL: bool = True
    RUN_SEED: bool = True

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"

    @property
    def is_production(self) -> bool:
        return self.APP_ENV.lower() in {"production", "prod"}

    @property
    def cors_origins(self) -> List[str]:
        if isinstance(self.ALLOWED_ORIGINS, list):
            return self.ALLOWED_ORIGINS
        return [item.strip() for item in str(self.ALLOWED_ORIGINS).split(",") if item.strip()]

    @model_validator(mode="after")
    def _validate_security(self) -> "Settings":
        weak = not self.SECRET_KEY or self.SECRET_KEY == INSECURE_SECRET_PLACEHOLDER or len(self.SECRET_KEY) < 32

        if self.is_production:
            if weak:
                raise ValueError(
                    "SECRET_KEY must be set to a strong random value (>=32 chars) when APP_ENV=production. "
                    "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(48))\""
                )
            if self.DEBUG:
                object.__setattr__(self, "DEBUG", False)
            if self.DATABASE_URL.startswith("sqlite"):
                raise ValueError(
                    "SQLite is not supported in production. Set DATABASE_URL to a PostgreSQL DSN "
                    "(postgresql+asyncpg://user:pass@host:5432/db)."
                )
        elif weak:
            object.__setattr__(self, "SECRET_KEY", _load_or_create_dev_secret())

        return self


def _load_or_create_dev_secret() -> str:
    """
    Generate and cache a random dev secret on disk so tokens survive `--reload`
    restarts without shipping a known secret in the repository.
    """
    secret_file = Path(__file__).resolve().parents[2] / ".dev-secret"
    try:
        if secret_file.exists():
            cached = secret_file.read_text(encoding="utf-8").strip()
            if len(cached) >= 32:
                return cached
        generated = secrets.token_urlsafe(48)
        secret_file.write_text(generated, encoding="utf-8")
        return generated
    except OSError:
        return secrets.token_urlsafe(48)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
