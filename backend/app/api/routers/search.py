from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from pydantic import BaseModel, ConfigDict, Field
from typing import List

from app.database.session import get_db
from app.models.user import User
from app.models.game import Game
from app.schemas.user import UserResponse
from app.schemas.game import GameResponse

router = APIRouter()


class SearchResultsResponse(BaseModel):
    users: List[UserResponse]
    games: List[GameResponse]

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


@router.get("", response_model=SearchResultsResponse)
async def global_search(
    q: str = Query(..., min_length=1, description="Search query keyword"),
    db: AsyncSession = Depends(get_db),
):
    """Search for players and games across the entire platform in database."""
    keyword = f"%{q.strip()}%"

    # Search users
    users_res = await db.execute(
        select(User)
        .where(
            or_(
                User.username.ilike(keyword),
                User.name.ilike(keyword),
            )
        )
        .limit(10)
    )
    users = users_res.scalars().all()

    # Search games
    games_res = await db.execute(
        select(Game)
        .where(
            or_(
                Game.title_ar.ilike(keyword),
                Game.title_en.ilike(keyword),
                Game.category.ilike(keyword),
                Game.category_ar.ilike(keyword),
            )
        )
        .limit(10)
    )
    games = games_res.scalars().all()

    return SearchResultsResponse(
        users=[UserResponse.model_validate(u) for u in users],
        games=[GameResponse.model_validate(g) for g in games],
    )
