from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, and_
from sqlalchemy.orm import joinedload
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

from app.database.session import get_db
from app.models.leaderboard import LeaderboardRank, Tournament, TournamentParticipant
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


@router.get("", response_model=List[LeaderboardEntryResponse])
async def get_leaderboard(
    world: str = Query("global", description="Filter leaderboard by world (global, arcade, reflex, iqlab, shilla, champions, chaos)"),
    limit: int = Query(50, ge=1, le=100, description="Max entries to return for high performance"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get dynamic leaderboard rankings directly from database.
    Optimized with composite indexes and pagination for 100K+ users.
    """
    world_clean = world.strip().lower()

    entries: List[LeaderboardEntryResponse] = []

    if world_clean == "global":
        # Global leaderboard orders users by total accumulated XP
        query = (
            select(User)
            .where(User.is_active == True)
            .order_by(desc(User.xp), desc(User.level))
            .offset(offset)
            .limit(limit)
        )
        result = await db.execute(query)
        users = result.scalars().all()

        current_rank = offset + 1
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
                    wins=max(1, int(u.level * 2)),
                    world="global",
                )
            )
            current_rank += 1
    else:
        # World-specific leaderboard orders by score in LeaderboardRank
        query = (
            select(LeaderboardRank)
            .options(joinedload(LeaderboardRank.user))
            .where(LeaderboardRank.world == world_clean)
            .order_by(desc(LeaderboardRank.score))
            .offset(offset)
            .limit(limit)
        )
        result = await db.execute(query)
        ranks = result.scalars().all()

        current_rank = offset + 1
        for r in ranks:
            if r.user:
                entries.append(
                    LeaderboardEntryResponse(
                        rank=current_rank,
                        userId=r.user.id,
                        name=r.user.name,
                        username=r.user.username,
                        avatar=r.user.avatar,
                        level=r.user.level,
                        score=r.score,
                        wins=r.wins,
                        world=world_clean,
                    )
                )
                current_rank += 1

    return entries


@router.get("/tournaments", response_model=List[TournamentResponse])
async def get_tournaments(db: AsyncSession = Depends(get_db)):
    """List competitive tournaments directly from database."""
    result = await db.execute(select(Tournament).order_by(desc(Tournament.starts_at)))
    tournaments = result.scalars().all()

    return [
        TournamentResponse(
            id=t.id,
            titleAr=t.title_ar,
            titleEn=t.title_en,
            world=t.world,
            prizePoolXp=t.prize_pool_xp,
            prizePoolCoins=t.prize_pool_coins,
            participantsCount=t.participants_count,
            status=t.status,
            icon=t.icon,
            color=t.color,
        )
        for t in tournaments
    ]


@router.post("/tournaments/{tournament_id}/join")
async def join_tournament(
    tournament_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Register current user for a tournament and persist in database."""
    t_res = await db.execute(select(Tournament).where(Tournament.id == tournament_id))
    tournament = t_res.scalars().first()
    if not tournament:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="البطولة غير موجودة")

    # Check if already joined
    existing_res = await db.execute(
        select(TournamentParticipant).where(
            and_(
                TournamentParticipant.tournament_id == tournament_id,
                TournamentParticipant.user_id == current_user.id,
            )
        )
    )
    if existing_res.scalars().first():
        return {
            "status": "success",
            "message": "أنت مسجل بالفعل في هذه البطولة 🏆",
            "tournament_id": tournament_id,
            "user_id": current_user.id,
        }

    # Register participant
    participant = TournamentParticipant(
        tournament_id=tournament_id,
        user_id=current_user.id,
        score=0,
        rank=tournament.participants_count + 1,
    )
    db.add(participant)
    tournament.participants_count += 1
    db.add(tournament)
    await db.commit()

    return {
        "status": "success",
        "message": "تم تسجيلك بنجاح في البطولة! بالتوفيق يا بطل 🏆",
        "tournament_id": tournament_id,
        "user_id": current_user.id,
    }
