import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Boolean, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class LeaderboardRank(Base):
    __tablename__ = "leaderboard_ranks"
    __table_args__ = (
        Index("ix_leaderboard_world_score", "world", "score"),
    )

    id: Mapped[str] = mapped_column(String(50), primary_key=True, default=lambda: f"lr_{uuid.uuid4().hex[:10]}")
    user_id: Mapped[str] = mapped_column(String(50), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    world: Mapped[str] = mapped_column(String(50), index=True, default="global")  # global, arcade, reflex, iqlab, shilla, champions, chaos
    score: Mapped[int] = mapped_column(Integer, default=0, index=True)
    wins: Mapped[int] = mapped_column(Integer, default=0)
    games_played: Mapped[int] = mapped_column(Integer, default=0)
    season: Mapped[str] = mapped_column(String(50), default="season_1")
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", backref="leaderboard_entries")


class Tournament(Base):
    __tablename__ = "tournaments"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    title_ar: Mapped[str] = mapped_column(String(255), nullable=False)
    title_en: Mapped[str] = mapped_column(String(255), nullable=False)
    world: Mapped[str] = mapped_column(String(50), default="champions")
    prize_pool_xp: Mapped[int] = mapped_column(Integer, default=10000)
    prize_pool_coins: Mapped[int] = mapped_column(Integer, default=5000)
    participants_count: Mapped[int] = mapped_column(Integer, default=128)
    status: Mapped[str] = mapped_column(String(50), default="active")  # active, upcoming, completed
    starts_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    ends_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    icon: Mapped[str] = mapped_column(String(50), default="🏆")
    color: Mapped[str] = mapped_column(String(255), default="from-amber-400 to-yellow-600")

    participants = relationship("TournamentParticipant", back_populates="tournament", cascade="all, delete-orphan")


class TournamentParticipant(Base):
    __tablename__ = "tournament_participants"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, default=lambda: f"tp_{uuid.uuid4().hex[:10]}")
    tournament_id: Mapped[str] = mapped_column(String(50), ForeignKey("tournaments.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(50), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    score: Mapped[int] = mapped_column(Integer, default=0)
    rank: Mapped[int] = mapped_column(Integer, default=0)
    joined_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    tournament = relationship("Tournament", back_populates="participants")
    user = relationship("User")

