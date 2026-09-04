import asyncio
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import create_async_engine
from alembic import context

from app.database.base import Base
from app.config.settings import settings

# Import all models so Alembic can detect their tables in Base.metadata
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

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = settings.DATABASE_URL
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """Run migrations in 'online' mode with async engine."""
    connectable = create_async_engine(
        settings.DATABASE_URL,
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
