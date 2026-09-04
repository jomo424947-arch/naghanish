from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

from app.database.session import get_db
from app.models.achievement import Achievement, UserAchievement
from app.models.user import User
from app.dependencies.auth import get_current_active_user

router = APIRouter()


class AchievementResponse(BaseModel):
    id: str
    title: str = Field(..., alias="titleAr")
    title_en: str = Field(..., alias="titleEn")
    desc: str = Field(..., alias="descAr")
    desc_en: str = Field(..., alias="descEn")
    icon: str
    category: str
    tier: str
    xp_reward: int = Field(..., alias="xpReward")
    coins_reward: int = Field(..., alias="coinsReward")
    progress: int = Field(0, alias="progress")
    max_progress: int = Field(1, alias="maxProgress")
    unlocked: bool = Field(False, alias="unlocked")
    claimed: bool = Field(False, alias="claimed")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


@router.get("", response_model=List[AchievementResponse])
async def list_achievements(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """List all platform achievements directly from database and user's unlock/progress state."""
    # 1. Fetch all system achievements from DB
    ach_result = await db.execute(select(Achievement))
    achievements = ach_result.scalars().all()

    # 2. Fetch user's achievements records
    ua_result = await db.execute(
        select(UserAchievement).where(UserAchievement.user_id == current_user.id)
    )
    user_ach_map = {ua.achievement_id: ua for ua in ua_result.scalars().all()}

    output = []
    for ach in achievements:
        ua = user_ach_map.get(ach.id)
        is_unlocked = ua.is_unlocked if ua else False
        is_claimed = ua.is_claimed if ua else False
        progress = ua.current_progress if ua else 0

        output.append(
            AchievementResponse(
                id=ach.id,
                titleAr=ach.title_ar,
                titleEn=ach.title_en,
                descAr=ach.desc_ar,
                descEn=ach.desc_en,
                icon=ach.icon,
                category=ach.category,
                tier=ach.tier,
                xpReward=ach.xp_reward,
                coinsReward=ach.coins_reward,
                progress=progress,
                maxProgress=ach.required_count,
                unlocked=is_unlocked,
                claimed=is_claimed,
            )
        )

    return output


@router.post("/{achievement_id}/claim")
async def claim_achievement_reward(
    achievement_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Claim XP & Coins reward for an unlocked achievement from database."""
    # 1. Find the achievement in DB
    ach_res = await db.execute(select(Achievement).where(Achievement.id == achievement_id))
    ach = ach_res.scalars().first()
    if not ach:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="الإنجاز غير موجود")

    # 2. Find user's achievement progress
    ua_res = await db.execute(
        select(UserAchievement).where(
            and_(
                UserAchievement.user_id == current_user.id,
                UserAchievement.achievement_id == achievement_id,
            )
        )
    )
    ua = ua_res.scalars().first()

    if not ua or not ua.is_unlocked:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="لم تفتح متطلبات هذا الإنجاز بعد",
        )

    if ua.is_claimed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="تم استلام مكافأة هذا الإنجاز مسبقاً",
        )

    # 3. Mark as claimed and award user XP and coins
    ua.is_claimed = True
    db.add(ua)

    xp_bonus = ach.xp_reward
    coins_bonus = ach.coins_reward

    current_user.xp += xp_bonus
    current_user.coins += coins_bonus

    while current_user.xp >= current_user.max_xp:
        current_user.level += 1
        current_user.xp -= current_user.max_xp
        current_user.max_xp = int(current_user.max_xp * 1.25)
        current_user.coins += current_user.level * 50

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)

    return {
        "status": "success",
        "message": f"مبروك! حصلت على +{xp_bonus} XP و +{coins_bonus} عملة 🎉",
        "xp_reward": xp_bonus,
        "coins_reward": coins_bonus,
        "user": {
            "level": current_user.level,
            "xp": current_user.xp,
            "coins": current_user.coins,
        },
    }
