"""
config/settings.py

Application settings loaded from environment variables via Pydantic Settings.
All configuration must be read from this module — never from os.environ directly.
"""

# from pydantic_settings import BaseSettings, SettingsConfigDict
# from functools import lru_cache


# class Settings(BaseSettings):
#     model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
#
#     # App
#     APP_ENV: str = "development"
#     APP_NAME: str = "Naghanish"
#     DEBUG: bool = False
#
#     # Database
#     DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost:5432/naghanish"
#
#     # Security
#     SECRET_KEY: str = "change-me-in-production"
#     ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
#     REFRESH_TOKEN_EXPIRE_DAYS: int = 7
#     ALGORITHM: str = "HS256"
#
#     # CORS
#     ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]


# @lru_cache
# def get_settings() -> Settings:
#     return Settings()


# settings = get_settings()

# TODO: Uncomment and configure above
