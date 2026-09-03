from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

from app.database.session import get_db
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


DAILY_MISSIONS = [
    {
        "id": "m_play_3_arcade",
        "titleAr": "بطل الأركيد اليومي 🕹️",
        "titleEn": "Daily Arcade Hero 🕹️",
        "descAr": "العب 3 مباريات في كابينات عالم الأركيد.",
        "descEn": "Play 3 matches in Arcade World cabinets.",
        "icon": "🕹️",
        "targetCount": 3,
        "currentCount": 1,
        "xpReward": 350,
        "coinsReward": 75,
        "completed": False,
        "claimed": False,
    },
    {
        "id": "m_reflex_lightning",
        "titleAr": "صاعقة ردة الفعل ⚡",
        "titleEn": "Reflex Lightning Strike ⚡",
        "descAr": "حقق 3 محاولات استجابة سريعة في حلبة السرعة.",
        "descEn": "Achieve 3 fast reaction rounds in Speed Arena.",
        "icon": "⚡",
        "targetCount": 3,
        "currentCount": 3,
        "xpReward": 400,
        "coinsReward": 80,
        "completed": True,
        "claimed": False,
    },
    {
        "id": "m_math_rapid",
        "titleAr": "تمرين العقل الصباحي 🧮",
        "titleEn": "Morning Math Sprint 🧮",
        "descAr": "أكمل جولة حساب ذهني واحدة بنجاح.",
        "descEn": "Complete 1 mental math calculation sprint.",
        "icon": "🧮",
        "targetCount": 1,
        "currentCount": 1,
        "xpReward": 250,
        "coinsReward": 50,
        "completed": True,
        "claimed": True,
    },
    {
        "id": "m_shilla_invite",
        "titleAr": "اجتماع الشلة 🎉",
        "titleEn": "Crew Gathering 🎉",
        "descAr": "ادخل غرفة لعب جماعي مع صديق.",
        "descEn": "Join a party room with a friend.",
        "icon": "🎉",
        "targetCount": 1,
        "currentCount": 0,
        "xpReward": 500,
        "coinsReward": 100,
        "completed": False,
        "claimed": False,
    },
]


@router.get("", response_model=List[MissionResponse])
async def list_daily_missions(
    current_user: User = Depends(get_current_active_user),
):
    """Get active daily challenges and user progress."""
    return [MissionResponse.model_validate(m) for m in DAILY_MISSIONS]


@router.post("/{mission_id}/claim")
async def claim_mission(
    mission_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Claim daily challenge XP and coins."""
    m = next((item for item in DAILY_MISSIONS if item["id"] == mission_id), None)
    if not m:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="التحدي غير موجود")

    xp_bonus = m["xpReward"]
    coins_bonus = m["coinsReward"]

    current_user.xp += xp_bonus
    current_user.coins += coins_bonus

    while current_user.xp >= current_user.max_xp:
        current_user.level += 1
        current_user.max_xp = int(current_user.max_xp * 1.5)

    db.add(current_user)
    await db.commit()

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
