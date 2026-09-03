"""
schemas/game.py

Pydantic v2 schemas for Game request/response validation.
Keep in sync with frontend api.types.ts
"""

from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime


class GameResponse(BaseModel):
    id: str
    title_en: str = Field(..., serialization_alias="titleEn", validation_alias="title_en")
    title_ar: str = Field(..., serialization_alias="titleAr", validation_alias="title_ar")
    world: str
    category: str
    category_ar: str = Field(..., serialization_alias="categoryAr", validation_alias="category_ar")
    icon: str
    color: str
    plays: str
    stars: float
    is_new: Optional[bool] = Field(False, serialization_alias="isNew", validation_alias="is_new")
    is_featured: Optional[bool] = Field(False, serialization_alias="isFeatured", validation_alias="is_featured")
    xp_reward: int = Field(250, serialization_alias="xpReward", validation_alias="xp_reward")
    difficulty: str
    difficulty_ar: Optional[str] = Field(None, serialization_alias="difficultyAr", validation_alias="difficulty_ar")
    desc_ar: str = Field(..., serialization_alias="descAr", validation_alias="desc_ar")
    desc_en: str = Field(..., serialization_alias="descEn", validation_alias="desc_en")
    route: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)



class GameSubmitRequest(BaseModel):
    score: int
    moves: Optional[int] = None
    elapsed_seconds: Optional[int] = None


class GameSessionResponse(BaseModel):
    id: str
    game_id: str
    score: int
    xp_earned: int
    coins_earned: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

