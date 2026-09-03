"""
routers/games.py

Game catalog, categories, and sessions.

Prefix: /api/v1/games
Tag:    Games
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from app.database.session import get_db
from app.models.game import Game, GameSession
from app.models.user import User
from app.schemas.game import GameResponse, GameSubmitRequest, GameSessionResponse
from app.dependencies.auth import get_current_active_user

router = APIRouter()


@router.get("", response_model=List[GameResponse])
async def list_games(
    world: Optional[str] = Query(None, description="Filter games by world ID (arcade, reflex, iqlab, shilla, champions, chaos)"),
    db: AsyncSession = Depends(get_db),
):
    """Get catalog of games, optionally filtered by world."""
    query = select(Game)
    if world:
        query = query.where(Game.world == world.lower())
    
    result = await db.execute(query)
    games = result.scalars().all()
    return [GameResponse.model_validate(g) for g in games]


@router.get("/{game_id}", response_model=GameResponse)
async def get_game_details(game_id: str, db: AsyncSession = Depends(get_db)):
    """Get details of a specific game by ID."""
    result = await db.execute(select(Game).where(Game.id == game_id))
    game = result.scalars().first()
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="اللعبة غير موجودة")
    return GameResponse.model_validate(game)


@router.post("/{game_id}/submit", response_model=GameSessionResponse)
async def submit_game_session(
    game_id: str,
    payload: GameSubmitRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Submit a completed game session, award XP and coins to user profile."""
    # Check if game exists
    result = await db.execute(select(Game).where(Game.id == game_id))
    game = result.scalars().first()
    
    xp_earned = game.xp_reward if game else 250
    coins_earned = max(10, int(xp_earned * 0.2))

    session_record = GameSession(
        user_id=current_user.id,
        game_id=game_id,
        score=payload.score,
        xp_earned=xp_earned,
        coins_earned=coins_earned,
    )
    db.add(session_record)

    # Award user XP and coins
    current_user.xp += xp_earned
    current_user.coins += coins_earned
    
    # Auto level-up logic
    while current_user.xp >= current_user.max_xp:
        current_user.level += 1
        current_user.max_xp = int(current_user.max_xp * 1.5)

    db.add(current_user)
    await db.commit()
    await db.refresh(session_record)
    return GameSessionResponse.model_validate(session_record)

