import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Achievement(Base):
    __tablename__ = "achievements"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    title_ar: Mapped[str] = mapped_column(String(255), nullable=False)
    title_en: Mapped[str] = mapped_column(String(255), nullable=False)
    desc_ar: Mapped[str] = mapped_column(String(500), nullable=False)
    desc_en: Mapped[str] = mapped_column(String(500), nullable=False)
    icon: Mapped[str] = mapped_column(String(50), default="🏆")
    category: Mapped[str] = mapped_column(String(50), default="general")  # games, reflex, iqlab, party, champions, social
    xp_reward: Mapped[int] = mapped_column(Integer, default=500)
    coins_reward: Mapped[int] = mapped_column(Integer, default=100)
    required_count: Mapped[int] = mapped_column(Integer, default=1)
    tier: Mapped[str] = mapped_column(String(50), default="bronze")  # bronze, silver, gold, diamond


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, default=lambda: f"ua_{uuid.uuid4().hex[:10]}")
    user_id: Mapped[str] = mapped_column(String(50), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    achievement_id: Mapped[str] = mapped_column(String(50), ForeignKey("achievements.id", ondelete="CASCADE"), index=True, nullable=False)
    current_progress: Mapped[int] = mapped_column(Integer, default=0)
    is_unlocked: Mapped[bool] = mapped_column(Boolean, default=False)
    is_claimed: Mapped[bool] = mapped_column(Boolean, default=False)
    unlocked_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    achievement = relationship("Achievement")
    user = relationship("User", backref="user_achievements")
