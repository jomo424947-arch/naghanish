import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Friendship(Base):
    __tablename__ = "friendships"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, default=lambda: f"fr_{uuid.uuid4().hex[:10]}")
    user_id: Mapped[str] = mapped_column(String(50), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    friend_id: Mapped[str] = mapped_column(String(50), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="accepted")  # pending, accepted, blocked
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    friend = relationship("User", foreign_keys=[friend_id])
    user = relationship("User", foreign_keys=[user_id])
