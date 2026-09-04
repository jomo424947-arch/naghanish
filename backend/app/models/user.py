"""
models/user.py

SQLAlchemy ORM model for the User domain.
Do NOT add business logic here. Models are pure data definitions.
"""

import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: f"usr_{uuid.uuid4().hex[:8]}")
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    hashed_password: Mapped[str | None] = mapped_column(String(255), nullable=True)
    avatar: Mapped[str] = mapped_column(String(500), default="/avatars/mascot-1.svg")
    provider: Mapped[str] = mapped_column(String(50), default="email")
    
    level: Mapped[int] = mapped_column(Integer, default=1, index=True)
    xp: Mapped[int] = mapped_column(Integer, default=0, index=True)
    max_xp: Mapped[int] = mapped_column(Integer, default=1000)
    coins: Mapped[int] = mapped_column(Integer, default=100)
    rank: Mapped[str] = mapped_column(String(100), default="مبتدئ")
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

