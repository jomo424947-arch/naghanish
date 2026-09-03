"""
dependencies/database.py

FastAPI dependency for database session injection.
"""

from app.database.session import get_db
from typing import Annotated
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

DbDep = Annotated[AsyncSession, Depends(get_db)]

