from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime, date

from app.database.session import get_db
from app.models.mission import DailyMission, UserMissionProgress
from app.models.user import User
from app.dependencies.auth import get_current_active_user

router = APIRouter()


class MissionResponse(BaseModel):
    id: str
    title: str = Field(..., alias="titleAr")
    title_en: str = Field(..., alias="titleEn")
    desc: str = Field(..., alias="descAr")
    desc_en: str = Field(..., alias="descEn")
    icon: str
    target_count: int = Field(..., alias="targetCount")
    current_count: int = Field(0, alias="currentCount")
    xp_reward: int = Field(..., alias="xpReward")
    coins_reward: int = Field(..., alias="coinsReward")
    completed: bool = False
    claimed: bool = False
    expires_in: str = Field("14h 25m", alias="expiresIn")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


@router.get("", response_model=List[MissionResponse])
async def list_daily_missions(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Get active daily challenges directly from database with player's real daily progress."""
    today = date.today()

    # 1. Fetch system daily missions from DB
    missions_res = await db.execute(select(DailyMission))
    all_missions = missions_res.scalars().all()

    # 2. Fetch user's progress for today
    ump_res = await db.execute(
        select(UserMissionProgress).where(
            and_(
                UserMissionProgress.user_id == current_user.id,
                UserMissionProgress.mission_date == today,
            )
        )
    )
    user_progress_map = {p.mission_id: p for p in ump_res.scalars().all()}

    output = []
    for m in all_missions:
        ump = user_progress_map.get(m.id)
        current_count = ump.current_progress if ump else 0
        is_completed = ump.is_completed if ump else False
        is_claimed = ump.is_claimed if ump else False

        output.append(
            MissionResponse(
                id=m.id,
                titleAr=m.title_ar,
                titleEn=m.title_en,
                descAr=m.desc_ar,
                descEn=m.desc_en,
                icon=m.icon,
                targetCount=m.target_count,
                currentCount=current_count,
                xpReward=m.xp_reward,
                coinsReward=m.coins_reward,
                completed=is_completed,
                claimed=is_claimed,
                expiresIn="14h 25m",
            )
        )

    return output


@router.post("/{mission_id}/claim")
async def claim_mission(
    mission_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Claim daily challenge XP and coins reward from database."""
    today = date.today()

    # 1. Find the mission definition
    m_res = await db.execute(select(DailyMission).where(DailyMission.id == mission_id))
    m = m_res.scalars().first()
    if not m:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="التحدي غير موجود")

    # 2. Check user progress
    ump_res = await db.execute(
        select(UserMissionProgress).where(
            and_(
                UserMissionProgress.user_id == current_user.id,
                UserMissionProgress.mission_id == mission_id,
                UserMissionProgress.mission_date == today,
            )
        )
    )
    ump = ump_res.scalars().first()

    if not ump or not ump.is_completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="لم تكمل متطلبات هذا التحدي بعد",
        )

    if ump.is_claimed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="تم استلام مكافأة هذا التحدي مسبقاً",
        )

    # 3. Mark as claimed and reward user
    ump.is_claimed = True
    db.add(ump)

    xp_bonus = m.xp_reward
    coins_bonus = m.coins_reward

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
        "message": f"تم استلام مكافأة التحدي: +{xp_bonus} XP و +{coins_bonus} عملة! 🎯",
        "xp_reward": xp_bonus,
        "coins_reward": coins_bonus,
        "user": {
            "level": current_user.level,
            "xp": current_user.xp,
            "coins": current_user.coins,
        },
    }
