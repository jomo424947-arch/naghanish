"""
schemas/quiz.py

Pydantic v2 schemas for Quiz request/response validation.
Keep in sync with frontend api.types.ts
"""

from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Any
from datetime import datetime


class QuizQuestionResponse(BaseModel):
    id: str
    question_ar: str = Field(..., serialization_alias="questionAr", validation_alias="question_ar")
    question_en: str = Field(..., serialization_alias="questionEn", validation_alias="question_en")
    options: List[Any]

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class QuizResponse(BaseModel):
    id: str
    title_ar: str = Field(..., serialization_alias="titleAr", validation_alias="title_ar")
    title_en: str = Field(..., serialization_alias="titleEn", validation_alias="title_en")
    world: str = "iqlab"
    category: str
    category_ar: str = Field(..., serialization_alias="categoryAr", validation_alias="category_ar")
    questions_count: int = Field(10, serialization_alias="questionsCount", validation_alias="questions_count")
    time_limit: str = Field("5m", serialization_alias="timeLimit", validation_alias="time_limit")
    completions: str
    rating: float
    badge: Optional[str] = None
    color: str
    xp_reward: int = Field(250, serialization_alias="xpReward", validation_alias="xp_reward")
    desc_ar: str = Field(..., serialization_alias="descAr", validation_alias="desc_ar")
    desc_en: str = Field(..., serialization_alias="descEn", validation_alias="desc_en")
    route: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)



class QuizSubmitRequest(BaseModel):
    answers: List[dict]  # list of {question_id, selected_option_index}
    result_trait: Optional[str] = None


class QuizAttemptResponse(BaseModel):
    id: str
    quiz_id: str
    result_trait: Optional[str] = None
    score: int
    xp_earned: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

