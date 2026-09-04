import uuid
from datetime import datetime, date
from sqlalchemy import String, Integer, DateTime, Date, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class DailyMission(Base):
    __tablename__ = "daily_missions"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    title_ar: Mapped[str] = mapped_column(String(255), nullable=False)
    title_en: Mapped[str] = mapped_column(String(255), nullable=False)
    desc_ar: Mapped[str] = mapped_column(String(500), nullable=False)
    desc_en: Mapped[str] = mapped_column(String(500), nullable=False)
    icon: Mapped[str] = mapped_column(String(50), default="🎯")
    target_count: Mapped[int] = mapped_column(Integer, default=3)
    xp_reward: Mapped[int] = mapped_column(Integer, default=300)
    coins_reward: Mapped[int] = mapped_column(Integer, default=50)
    category: Mapped[str] = mapped_column(String(50), default="daily")  # daily, weekly, special
    target_action: Mapped[str] = mapped_column(String(100), default="play_any_game")


class UserMissionProgress(Base):
    __tablename__ = "user_mission_progress"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, default=lambda: f"ump_{uuid.uuid4().hex[:10]}")
    user_id: Mapped[str] = mapped_column(String(50), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    mission_id: Mapped[str] = mapped_column(String(50), ForeignKey("daily_missions.id", ondelete="CASCADE"), index=True, nullable=False)
    current_progress: Mapped[int] = mapped_column(Integer, default=0)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    is_claimed: Mapped[bool] = mapped_column(Boolean, default=False)
    mission_date: Mapped[date] = mapped_column(Date, default=date.today)

    mission = relationship("DailyMission")
    user = relationship("User", backref="user_mission_progresses")
