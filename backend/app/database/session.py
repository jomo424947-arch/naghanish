"""
database/session.py

FastAPI dependency for providing an async DB session per request.
"""

# from typing import AsyncGenerator
# from sqlalchemy.ext.asyncio import AsyncSession
# from app.database.engine import AsyncSessionLocal

# async def get_db() -> AsyncGenerator[AsyncSession, None]:
#     async with AsyncSessionLocal() as session:
#         try:
#             yield session
#             await session.commit()
#         except Exception:
#             await session.rollback()
#             raise
#         finally:
#             await session.close()

# TODO: Implement session dependency
