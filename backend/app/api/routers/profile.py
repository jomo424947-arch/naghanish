from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional

from app.database.session import get_db
from app.models.user import User
from app.models.game import GameSession
from app.models.achievement import UserAchievement
from app.models.economy import UserInventory
from app.schemas.user import UserResponse
from app.dependencies.auth import get_current_active_user

router = APIRouter()


class ProfileStatsResponse(BaseModel):
    user: UserResponse
    games_played: int = Field(0, alias="gamesPlayed")
    achievements_unlocked: int = Field(0, alias="achievementsUnlocked")
    items_owned: int = Field(0, alias="itemsOwned")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    username: Optional[str] = None


@router.get("", response_model=ProfileStatsResponse)
async def get_my_profile(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Get complete player profile and game statistics directly from database."""
    # 1. Total games played
    games_res = await db.execute(
        select(func.count(GameSession.id)).where(GameSession.user_id == current_user.id)
    )
    games_count = games_res.scalar() or 0

    # 2. Unlocked achievements
    ach_res = await db.execute(
        select(func.count(UserAchievement.id)).where(
            UserAchievement.user_id == current_user.id,
            UserAchievement.is_unlocked == True,
        )
    )
    ach_count = ach_res.scalar() or 0

    # 3. Items in inventory
    inv_res = await db.execute(
        select(func.count(UserInventory.id)).where(UserInventory.user_id == current_user.id)
    )
    items_count = inv_res.scalar() or 0

    return ProfileStatsResponse(
        user=UserResponse.model_validate(current_user),
        gamesPlayed=games_count,
        achievementsUnlocked=ach_count,
        itemsOwned=items_count,
    )


@router.patch("", response_model=UserResponse)
async def update_profile(
    payload: ProfileUpdateRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Update profile attributes in database."""
    if payload.name is not None:
        current_user.name = payload.name.strip()
    if payload.avatar is not None:
        current_user.avatar = payload.avatar.strip()
    if payload.username is not None:
        new_username = payload.username.strip()
        collision = await db.execute(
            select(User).where(User.username == new_username, User.id != current_user.id)
        )
        if collision.scalars().first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="اسم المستخدم مأخوذ بالفعل")
        current_user.username = new_username

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return UserResponse.model_validate(current_user)
