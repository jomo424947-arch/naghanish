"""
models/game.py

SQLAlchemy ORM model for the Game domain.
Do NOT add business logic here. Models are pure data definitions.
"""

import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base


class Game(Base):
    __tablename__ = "games"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    title_ar: Mapped[str] = mapped_column(String(255), nullable=False)
    title_en: Mapped[str] = mapped_column(String(255), nullable=False)
    world: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    category_ar: Mapped[str] = mapped_column(String(100), nullable=False)
    icon: Mapped[str] = mapped_column(String(50), nullable=False)
    color: Mapped[str] = mapped_column(String(255), default="from-purple-600 to-blue-700")
    plays: Mapped[str] = mapped_column(String(50), default="10.0k")
    stars: Mapped[float] = mapped_column(Float, default=4.8)
    xp_reward: Mapped[int] = mapped_column(Integer, default=250)
    difficulty: Mapped[str] = mapped_column(String(50), default="Medium")
    desc_ar: Mapped[str] = mapped_column(String(1000), nullable=False)
    desc_en: Mapped[str] = mapped_column(String(1000), nullable=False)
    route: Mapped[str] = mapped_column(String(255), nullable=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    is_new: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class GameSession(Base):
    __tablename__ = "game_sessions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: f"gs_{uuid.uuid4().hex[:10]}")
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    game_id: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    score: Mapped[int] = mapped_column(Integer, default=0)
    xp_earned: Mapped[int] = mapped_column(Integer, default=0)
    coins_earned: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

