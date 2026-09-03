from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
import random

from app.models.user import User
from app.dependencies.auth import get_current_active_user

router = APIRouter()


class GenerateQuestionRequest(BaseModel):
    topic: str = "تاريخ وثقافة عامة"
    difficulty: str = "متوسط"
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


AI_QUESTIONS_BANK = [
    {
        "topic": "علوم وفضاء",
        "question": "ما هو الكوكب الذي يمتلك أقوى مجال مغناطيسي في المجموعة الشمسية؟",
        "options": [
            {"id": "o1", "text": "كوكب المشتري 🪐", "isCorrect": True},
            {"id": "o2", "text": "كوكب زحل 🪐", "isCorrect": False},
            {"id": "o3", "text": "كوكب المريخ 🔴", "isCorrect": False},
            {"id": "o4", "text": "كوكب الأرض 🌍", "isCorrect": False},
        ],
        "explanation": "المشتري يمتلك مجالاً مغناطيسياً أقوى بنحو 20 ألف مرة من المجال المغناطيسي للأرض!",
    },
    {
        "topic": "تاريخ وحضارات",
        "question": "ما هي أقدم مكتبة عامة معروفة في التاريخ لا تزال تعمل حتى اليوم؟",
        "options": [
            {"id": "o1", "text": "مكتبة القرويين بفاس 🏛️", "isCorrect": True},
            {"id": "o2", "text": "مكتبة الإسكندرية 📜", "isCorrect": False},
            {"id": "o3", "text": "مكتبة الفاتيكان 📚", "isCorrect": False},
            {"id": "o4", "text": "مكتبة الكونغرس 🏛️", "isCorrect": False},
        ],
        "explanation": "تأسست مكتبة جامعة القرويين في المغرب عام 859م على يد فاطمة الفهرية.",
    },
    {
        "topic": "ذكاء وألغاز",
        "question": "شيء يزداد كلما أخذت منه، فما هو؟",
        "options": [
            {"id": "o1", "text": "الحفرة 🕳️", "isCorrect": True},
            {"id": "o2", "text": "الوقت ⏳", "isCorrect": False},
            {"id": "o3", "text": "العمر 🎂", "isCorrect": False},
            {"id": "o4", "text": "المال 💰", "isCorrect": False},
        ],
        "explanation": "الحفرة تتسع وتكبر كلما حفرت وأخذت منها تراباً!",
    },
]


@router.post("/generate-question", response_model=AIGeneratedQuestionResponse)
async def generate_ai_question(
    payload: GenerateQuestionRequest,
    current_user: User = Depends(get_current_active_user),
):
    """Generate a dynamic smart quiz question using Naghanish AI Game Master."""
    item = random.choice(AI_QUESTIONS_BANK)
    return AIGeneratedQuestionResponse(
        id=f"ai_q_{random.randint(1000, 9999)}",
        topic=payload.topic,
        question=item["question"],
        options=[QuestionOptionDto.model_validate(opt) for opt in item["options"]],
        explanation=item["explanation"],
        xpReward=200,
    )
