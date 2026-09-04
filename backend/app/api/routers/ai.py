import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional

from app.database.session import get_db
from app.models.ai import AIQuestion
from app.models.user import User
from app.dependencies.auth import get_current_active_user

router = APIRouter()


class GenerateQuestionRequest(BaseModel):
    topic: str = "تاريخ وثقافة عامة"
    difficulty: str = "medium"
    world: str = "iqlab"


class QuestionOptionDto(BaseModel):
    id: str
    text: str
    is_correct: bool = Field(..., alias="isCorrect")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class AIGeneratedQuestionResponse(BaseModel):
    id: str
    topic: str
    question: str
    options: List[QuestionOptionDto]
    explanation: str
    xp_reward: int = Field(200, alias="xpReward")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


@router.post("/generate-question", response_model=AIGeneratedQuestionResponse)
async def generate_ai_question(
    payload: GenerateQuestionRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Generate or fetch a knowledge trivia challenge directly from the database questions repository.
    """
    # 1. Look for matching questions in DB
    query = select(AIQuestion)
    if payload.world:
        query = query.where(AIQuestion.world == payload.world)

    result = await db.execute(query)
    questions = result.scalars().all()

    if questions:
        selected_q = random.choice(questions)
    else:
        # Fallback query without world filter
        fallback = await db.execute(select(AIQuestion))
        all_q = fallback.scalars().all()
        if all_q:
            selected_q = random.choice(all_q)
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="لا توجد أسئلة ذكاء مسجلة في قاعدة البيانات حالياً",
            )

    return AIGeneratedQuestionResponse(
        id=selected_q.id,
        topic=selected_q.topic,
        question=selected_q.question,
        options=[QuestionOptionDto.model_validate(opt) for opt in selected_q.options],
        explanation=selected_q.explanation,
        xpReward=selected_q.xp_reward,
    )
