"""
routers/users.py

User management (admin operations).

Prefix: /api/v1/users
Tag:    Users
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.dependencies.auth import get_current_active_user

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def read_user_me(current_user: User = Depends(get_current_active_user)):
    """Get current active user."""
    return UserResponse.model_validate(current_user)


@router.patch("/me", response_model=UserResponse)
async def update_user_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Update current user profile."""
    if payload.name is not None:
        current_user.name = payload.name
    if payload.username is not None:
        # Check if username is taken
        un = await db.execute(select(User).where(User.username == payload.username, User.id != current_user.id))
        if un.scalars().first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="اسم المستخدم مأخوذ بالفعل")
        current_user.username = payload.username
    if payload.avatar is not None:
        current_user.avatar = payload.avatar

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return UserResponse.model_validate(current_user)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(user_id: str, db: AsyncSession = Depends(get_db)):
    """Get public user profile by ID."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="المستخدم غير موجود")
    return UserResponse.model_validate(user)

