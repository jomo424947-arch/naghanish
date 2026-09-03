import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class PartyRoom(Base):
    __tablename__ = "party_rooms"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, default=lambda: f"room_{uuid.uuid4().hex[:8]}")
    code: Mapped[str] = mapped_column(String(10), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), default="غرفة الشلة الممتعة 🎉")
    host_id: Mapped[str] = mapped_column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    game_id: Mapped[str] = mapped_column(String(50), default="g10")  # Default crew trivia
    game_mode: Mapped[str] = mapped_column(String(50), default="party")
    max_players: Mapped[int] = mapped_column(Integer, default=8)
    status: Mapped[str] = mapped_column(String(50), default="waiting")  # waiting, playing, finished
    is_private: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    host = relationship("User", backref="hosted_rooms")
    participants = relationship("RoomParticipant", back_populates="room", cascade="all, delete-orphan")


class RoomParticipant(Base):
    __tablename__ = "room_participants"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, default=lambda: f"rp_{uuid.uuid4().hex[:10]}")
    room_id: Mapped[str] = mapped_column(String(50), ForeignKey("party_rooms.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(50), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    score: Mapped[int] = mapped_column(Integer, default=0)
    is_ready: Mapped[bool] = mapped_column(Boolean, default=False)
    is_host: Mapped[bool] = mapped_column(Boolean, default=False)
    joined_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    room = relationship("PartyRoom", back_populates="participants")
    user = relationship("User")
