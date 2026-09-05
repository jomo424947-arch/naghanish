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


from pydantic import BaseModel, ConfigDict, EmailStr, Field


class TokenResponse(BaseModel):
    token: str
    refresh_token: Optional[str] = Field(None, alias="refreshToken")
    user: UserResponse

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., alias="refreshToken")

    model_config = ConfigDict(populate_by_name=True)


class NameLoginRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=50, description="Player name or nickname")
    avatar: Optional[str] = Field(None, description="Optional chosen avatar")



