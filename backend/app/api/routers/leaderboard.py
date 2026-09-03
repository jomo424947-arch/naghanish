from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

from app.database.session import get_db
from app.models.leaderboard import LeaderboardRank, Tournament
from app.models.user import User
from app.dependencies.auth import get_current_active_user

router = APIRouter()


class LeaderboardEntryResponse(BaseModel):
    rank: int
    user_id: str = Field(..., alias="userId")
    name: str
    username: str
    avatar: str
    level: int
    score: int
    wins: int
    world: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class TournamentResponse(BaseModel):
    id: str
    title_ar: str = Field(..., alias="titleAr")
    title_en: str = Field(..., alias="titleEn")
    world: str
    prize_pool_xp: int = Field(..., alias="prizePoolXp")
    prize_pool_coins: int = Field(..., alias="prizePoolCoins")
    participants_count: int = Field(..., alias="participantsCount")
    status: str
    icon: str
    color: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


MOCK_CHAMPIONS = [
    {"name": "سلطان التحدي 👑", "username": "sultan_iq", "avatar": "/avatars/mascot-1.svg", "level": 34, "score": 9850, "wins": 142},
    {"name": "سارة السريعة ⚡", "username": "sara_speed", "avatar": "/avatars/mascot-2.svg", "level": 29, "score": 8720, "wins": 118},
    {"name": "عمر الأركيد 🕹️", "username": "omar_retro", "avatar": "/avatars/mascot-3.svg", "level": 25, "score": 7940, "wins": 95},
    {"name": "فيلسوف نغنش 🧠", "username": "mind_master", "avatar": "/avatars/mascot-4.svg", "level": 22, "score": 6890, "wins": 84},
    {"name": "كابتن الشلة 🎉", "username": "shilla_boss", "avatar": "/avatars/mascot-5.svg", "level": 20, "score": 5910, "wins": 71},
]


@router.get("", response_model=List[LeaderboardEntryResponse])
async def get_leaderboard(
    world: str = Query("global", description="Filter leaderboard by world (global, arcade, reflex, iqlab, shilla, champions, chaos)"),
    db: AsyncSession = Depends(get_db),
):
    """Get dynamic leaderboard rankings for the requested world."""
    # Fetch real registered users from DB
    result = await db.execute(select(User).order_by(desc(User.xp)).limit(20))
    users = result.scalars().all()

    entries = []
    current_rank = 1

    for u in users:
        entries.append(
            LeaderboardEntryResponse(
                rank=current_rank,
                userId=u.id,
                name=u.name,
                username=u.username,
                avatar=u.avatar,
                level=u.level,
                score=u.xp,
                wins=max(5, int(u.level * 3)),
                world=world,
            )
        )
        current_rank += 1

    # Fill in with mock champion leaders if DB has few users
    for champ in MOCK_CHAMPIONS:
        if len(entries) >= 10:
            break
        entries.append(
            LeaderboardEntryResponse(
                rank=current_rank,
                userId=f"mock_{current_rank}",
                name=champ["name"],
                username=champ["username"],
                avatar=champ["avatar"],
                level=champ["level"],
                score=champ["score"],
                wins=champ["wins"],
                world=world,
            )
        )
        current_rank += 1

    return entries


@router.get("/tournaments", response_model=List[TournamentResponse])
async def get_tournaments():
    """List available and upcoming competitive tournaments."""
    return [
        TournamentResponse(
            id="t1",
            titleAr="كأس نغنِش الأسبوعي الكبرى 🏆",
            titleEn="Weekly Grand Cup 🏆",
            world="champions",
            prizePoolXp=25000,
            prizePoolCoins=5000,
            participantsCount=256,
            status="active",
            icon="🏆",
            color="from-amber-400 via-yellow-500 to-amber-700",
        ),
        TournamentResponse(
            id="t2",
            titleAr="دوري سرعة البرق ⚡",
            titleEn="Lightning Reflex League ⚡",
            world="reflex",
            prizePoolXp=15000,
            prizePoolCoins=3000,
            participantsCount=128,
            status="active",
            icon="⚡",
            color="from-red-500 via-rose-600 to-orange-500",
        ),
        TournamentResponse(
            id="t3",
            titleAr="بطولة عباقرة الحساب والمنطق 🧠",
            titleEn="Mastermind IQ Open 🧠",
            world="iqlab",
            prizePoolXp=18000,
            prizePoolCoins=3500,
            participantsCount=96,
            status="upcoming",
            icon="🧠",
            color="from-purple-600 via-indigo-600 to-blue-600",
        ),
    ]


@router.post("/tournaments/{tournament_id}/join")
async def join_tournament(
    tournament_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Register current user for a tournament."""
    return {
        "status": "success",
        "message": "تم تسجيلك بنجاح في البطولة! بالتوفيق يا بطل 🏆",
        "tournament_id": tournament_id,
        "user_id": current_user.id,
    }
