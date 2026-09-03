from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

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


ALL_ACHIEVEMENTS = [
    {
        "id": "ach_first_game",
        "titleAr": "الخطوة الأولى 🚀",
        "titleEn": "First Step 🚀",
        "descAr": "العب أول لعبة لك في أي عالم من عوالم نغنِش.",
        "descEn": "Play your very first game in any Naghanish world.",
        "icon": "🚀",
        "category": "games",
        "tier": "bronze",
        "xpReward": 250,
        "coinsReward": 50,
        "maxProgress": 1,
    },
    {
        "id": "ach_speed_demon",
        "titleAr": "شيطان السرعة ⚡",
        "titleEn": "Speed Demon ⚡",
        "descAr": "حقق وقت استجابة أقل من 250ms في عالم ردة الفعل.",
        "descEn": "Score under 250ms reaction time in Reflex World.",
        "icon": "⚡",
        "category": "reflex",
        "tier": "silver",
        "xpReward": 500,
        "coinsReward": 100,
        "maxProgress": 1,
    },
    {
        "id": "ach_brain_power",
        "titleAr": "العقل المدبر 🧠",
        "titleEn": "Mastermind 🧠",
        "descAr": "أجب على 10 معادلات رياضية متتالية بدون أي خطأ.",
        "descEn": "Solve 10 consecutive math problems with 0 mistakes.",
        "icon": "🧠",
        "category": "iqlab",
        "tier": "gold",
        "xpReward": 750,
        "coinsReward": 150,
        "maxProgress": 10,
    },
    {
        "id": "ach_memory_titan",
        "titleAr": "عملاق الذاكرة 🃏",
        "titleEn": "Memory Titan 🃏",
        "descAr": "أكمل لعبة بطاقات الذاكرة في أقل من 15 حركة.",
        "descEn": "Finish the Memory Cards game in fewer than 15 moves.",
        "icon": "🃏",
        "category": "arcade",
        "tier": "gold",
        "xpReward": 800,
        "coinsReward": 200,
        "maxProgress": 1,
    },
    {
        "id": "ach_party_host",
        "titleAr": "روح الشلة 🎉",
        "titleEn": "Party Animal 🎉",
        "descAr": "أنشئ غرفة والعب جولة كاملة مع أصدقائك في عالم الشلة.",
        "descEn": "Host a room and play a full match with friends.",
        "icon": "🎉",
        "category": "party",
        "tier": "silver",
        "xpReward": 500,
        "coinsReward": 100,
        "maxProgress": 1,
    },
    {
        "id": "ach_champion_throne",
        "titleAr": "عرش الأبطال 👑",
        "titleEn": "Champion Throne 👑",
        "descAr": "ادخل قائمة أفضل 10 لاعبين في لوحة الصدارة العالمية.",
        "descEn": "Reach the Top 10 on the Global Leaderboard.",
        "icon": "👑",
        "category": "champions",
        "tier": "diamond",
        "xpReward": 2000,
        "coinsReward": 500,
        "maxProgress": 1,
    },
]


@router.get("", response_model=List[AchievementResponse])
async def list_achievements(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """List all platform achievements and user's progress/unlock state."""
    # Fetch user unlocked achievements from DB
    res = await db.execute(select(UserAchievement).where(UserAchievement.user_id == current_user.id))
    user_ach_map = {ua.achievement_id: ua for ua in res.scalars().all()}

    output = []
    for item in ALL_ACHIEVEMENTS:
        ua = user_ach_map.get(item["id"])
        # For demo/first-play experience: unlock first achievement if user has XP
        is_unlocked = ua.is_unlocked if ua else (current_user.xp > 0 and item["id"] == "ach_first_game")
        is_claimed = ua.is_claimed if ua else False
        progress = ua.current_progress if ua else (1 if is_unlocked else 0)

        output.append(
            AchievementResponse(
                id=item["id"],
                titleAr=item["titleAr"],
                titleEn=item["titleEn"],
                descAr=item["descAr"],
                descEn=item["descEn"],
                icon=item["icon"],
                category=item["category"],
                tier=item["tier"],
                xpReward=item["xpReward"],
                coinsReward=item["coinsReward"],
                progress=progress,
                maxProgress=item["maxProgress"],
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
    """Claim XP & Coins for an unlocked achievement."""
    ach = next((a for a in ALL_ACHIEVEMENTS if a["id"] == achievement_id), None)
    if not ach:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="الإنجاز غير موجود")

    # Award user
    xp_bonus = ach["xpReward"]
    coins_bonus = ach["coinsReward"]

    current_user.xp += xp_bonus
    current_user.coins += coins_bonus

    while current_user.xp >= current_user.max_xp:
        current_user.level += 1
        current_user.max_xp = int(current_user.max_xp * 1.5)

    db.add(current_user)
    await db.commit()

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
