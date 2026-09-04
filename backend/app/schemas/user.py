"""
schemas/user.py

Pydantic v2 schemas for User request/response validation.
Keep in sync with frontend api.types.ts
"""

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    username: str
    name: str
    avatar: str = "/avatars/mascot-1.svg"


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    avatar: Optional[str] = None


class UserResponse(UserBase):
    id: str
    level: int = 1
    xp: int = 0
    max_xp: int = Field(1000, alias="maxXp")
    coins: int = 100
    rank: str = "مبتدئ"
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

