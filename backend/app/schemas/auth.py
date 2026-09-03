"""
schemas/auth.py

Pydantic v2 schemas for Auth request/response validation.
Keep in sync with frontend api.types.ts
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from app.schemas.user import UserResponse


class UserRegister(BaseModel):
    email: EmailStr
    username: str
    name: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class SocialLoginUserPayload(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    username: Optional[str] = None


class SocialLoginRequest(BaseModel):
    provider: str
    idToken: str
    user: Optional[SocialLoginUserPayload] = None


class TokenResponse(BaseModel):
    token: str
    user: UserResponse

