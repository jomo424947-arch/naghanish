import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base


class AIQuestion(Base):
    __tablename__ = "ai_questions"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, default=lambda: f"aiq_{uuid.uuid4().hex[:10]}")
    topic: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    difficulty: Mapped[str] = mapped_column(String(50), default="medium")
    world: Mapped[str] = mapped_column(String(50), default="iqlab")
    question: Mapped[str] = mapped_column(String(1000), nullable=False)
    options: Mapped[list] = mapped_column(JSON, nullable=False)  # [{id, text, isCorrect}]
    explanation: Mapped[str] = mapped_column(String(1000), nullable=False)
    xp_reward: Mapped[int] = mapped_column(Integer, default=200)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
