"""
models/quiz.py

SQLAlchemy ORM model for the Quiz domain.
Do NOT add business logic here. Models are pure data definitions.
"""

import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Quiz(Base):
    __tablename__ = "quizzes"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    title_ar: Mapped[str] = mapped_column(String(255), nullable=False)
    title_en: Mapped[str] = mapped_column(String(255), nullable=False)
    world: Mapped[str] = mapped_column(String(50), default="iqlab")
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    category_ar: Mapped[str] = mapped_column(String(100), nullable=False)
    questions_count: Mapped[int] = mapped_column(Integer, default=10)
    time_limit: Mapped[str] = mapped_column(String(50), default="5m")
    completions: Mapped[str] = mapped_column(String(50), default="10.0k")
    rating: Mapped[float] = mapped_column(Float, default=4.9)
    badge: Mapped[str | None] = mapped_column(String(50), nullable=True)
    color: Mapped[str] = mapped_column(String(255), default="from-amber-500 to-yellow-600")
    xp_reward: Mapped[int] = mapped_column(Integer, default=250)
    desc_ar: Mapped[str] = mapped_column(String(1000), nullable=False)
    desc_en: Mapped[str] = mapped_column(String(1000), nullable=False)
    route: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    questions: Mapped[list["QuizQuestion"]] = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: f"qq_{uuid.uuid4().hex[:8]}")
    quiz_id: Mapped[str] = mapped_column(String(50), ForeignKey("quizzes.id", ondelete="CASCADE"), index=True, nullable=False)
    question_ar: Mapped[str] = mapped_column(String(1000), nullable=False)
    question_en: Mapped[str] = mapped_column(String(1000), nullable=False)
    options: Mapped[list] = mapped_column(JSON, nullable=False)  # List of dicts {text, textEn, traits/correct}
    
    quiz: Mapped["Quiz"] = relationship("Quiz", back_populates="questions")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: f"qa_{uuid.uuid4().hex[:10]}")
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    quiz_id: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    result_trait: Mapped[str | None] = mapped_column(String(100), nullable=True)
    score: Mapped[int] = mapped_column(Integer, default=0)
    xp_earned: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

