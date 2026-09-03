"""
routers/quizzes.py

Quiz definitions, questions, and submissions.

Prefix: /api/v1/quizzes
Tag:    Quizzes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database.session import get_db
from app.models.quiz import Quiz, QuizAttempt
from app.models.user import User
from app.schemas.quiz import QuizResponse, QuizSubmitRequest, QuizAttemptResponse
from app.dependencies.auth import get_current_active_user

router = APIRouter()


@router.get("", response_model=List[QuizResponse])
async def list_quizzes(db: AsyncSession = Depends(get_db)):
    """List all personality and IQ quizzes."""
    result = await db.execute(select(Quiz))
    quizzes = result.scalars().all()
    return [QuizResponse.model_validate(q) for q in quizzes]


@router.get("/{quiz_id}", response_model=QuizResponse)
async def get_quiz_details(quiz_id: str, db: AsyncSession = Depends(get_db)):
    """Get details of a specific quiz."""
    result = await db.execute(select(Quiz).where(Quiz.id == quiz_id))
    quiz = result.scalars().first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="الاختبار غير موجود")
    return QuizResponse.model_validate(quiz)


@router.post("/{quiz_id}/submit", response_model=QuizAttemptResponse)
async def submit_quiz(
    quiz_id: str,
    payload: QuizSubmitRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Submit quiz answers, calculate reward, and update user XP/coins."""
    result = await db.execute(select(Quiz).where(Quiz.id == quiz_id))
    quiz = result.scalars().first()

    xp_earned = quiz.xp_reward if quiz else 250
    coins_earned = 50

    attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_id=quiz_id,
        result_trait=payload.result_trait,
        score=len(payload.answers) * 10,
        xp_earned=xp_earned,
    )
    db.add(attempt)

    # Award user XP and coins
    current_user.xp += xp_earned
    current_user.coins += coins_earned

    while current_user.xp >= current_user.max_xp:
        current_user.level += 1
        current_user.max_xp = int(current_user.max_xp * 1.5)

    db.add(current_user)
    await db.commit()
    await db.refresh(attempt)
    return QuizAttemptResponse.model_validate(attempt)

