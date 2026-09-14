"""
routers/games.py

Game catalog, categories, dynamic sessions, progression & point calculations.
Fully optimized for web client, mobile applications (Flutter/React Native), and API integrations.

Prefix: /api/v1/games
Tag:    Games
"""

import uuid
from datetime import datetime, date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func

from app.database.session import get_db
from app.models.game import Game, GameSession
from app.models.user import User
from app.models.leaderboard import LeaderboardRank
from app.models.mission import DailyMission, UserMissionProgress
from app.models.achievement import Achievement, UserAchievement
from app.schemas.game import GameResponse, GameSubmitRequest, GameSessionResponse
from app.dependencies.auth import get_current_user

router = APIRouter()

DIFFICULTY_AR = {
    "Easy": "سهل",
    "Medium": "متوسط",
    "Hard": "صعب",
}

WORLD_MISSION_ACTIONS = {
    "arcade": "play_arcade_game",
    "reflex": "play_reflex_game",
    "iqlab": "play_iqlab_game",
    "shilla": "play_shilla_game",
    "champions": "play_champions_game",
    "chaos": "play_chaos_game",
}


def _to_game_response(game: Game) -> GameResponse:
    payload = GameResponse.model_validate(game)
    if not payload.difficulty_ar:
        payload.difficulty_ar = DIFFICULTY_AR.get(game.difficulty)
    return payload


@router.get("", response_model=List[GameResponse])
async def list_games(
    world: Optional[str] = Query(None, description="Filter games by world ID (arcade, reflex, iqlab, shilla, champions, chaos)"),
    category: Optional[str] = Query(None, description="Filter by category"),
    db: AsyncSession = Depends(get_db),
):
    """Get catalog of games, optionally filtered by world or category."""
    query = select(Game)
    if world:
        query = query.where(Game.world == world.lower())
    if category:
        query = query.where(Game.category == category)

    result = await db.execute(query)
    games = result.scalars().all()
    return [_to_game_response(g) for g in games]


@router.get("/{game_id}", response_model=GameResponse)
async def get_game_details(game_id: str, db: AsyncSession = Depends(get_db)):
    """Get details of a specific game by ID."""
    result = await db.execute(select(Game).where(Game.id == game_id))
    game = result.scalars().first()
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="اللعبة غير موجودة")
    return _to_game_response(game)


@router.post("/{game_id}/submit", response_model=GameSessionResponse)
async def submit_game_session(
    game_id: str,
    payload: GameSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Submit completed game session with intelligent point & progression calculations:
    1. Accurately calculates XP and Coins based on score & performance.
    2. Handles smooth level-up thresholds with bonus coin payouts.
    3. Updates user's real-time Leaderboard rankings (both global and world).
    4. Progresses today's active Daily Missions.
    5. Checks and unlocks milestones in User Achievements.
    6. Returns complete real-time player progression state for web & mobile apps.
    """
    result = await db.execute(select(Game).where(Game.id == game_id))
    game = result.scalars().first()
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="اللعبة غير موجودة")

    base_xp = game.xp_reward
    world_id = game.world

    score_val = max(0, min(payload.score, 1_000_000))
    performance_bonus_xp = min(200, int(score_val * 0.1))
    total_xp_earned = base_xp + performance_bonus_xp

    # Difficulty multiplier (single source of truth — client must not remultiply)
    diff = (payload.difficulty or "Medium").capitalize()
    diff_multiplier = 2.5 if diff == "Hard" else 1.5 if diff == "Medium" else 1.0
    total_xp_earned = int(total_xp_earned * diff_multiplier)

    # Coins ≈ 25% of earned XP (minimum 20)
    coins_earned = max(20, int(total_xp_earned * 0.25))

    session_record = GameSession(
        id=f"gs_{uuid.uuid4().hex[:12]}",
        user_id=current_user.id,
        game_id=game_id,
        score=score_val,
        xp_earned=total_xp_earned,
        coins_earned=coins_earned,
        created_at=datetime.utcnow(),
    )
    db.add(session_record)

    current_user.xp += total_xp_earned
    current_user.coins += coins_earned

    leveled_up = False
    level_up_reward_coins = 0

    while current_user.xp >= current_user.max_xp:
        leveled_up = True
        current_user.level += 1
        current_user.xp -= current_user.max_xp
        current_user.max_xp = int(current_user.max_xp * 1.25)
        bonus = current_user.level * 50
        level_up_reward_coins += bonus
        current_user.coins += bonus

    if current_user.level >= 30:
        current_user.rank = "أسطورة نغنش 👑"
    elif current_user.level >= 20:
        current_user.rank = "سيد التحديات 💎"
    elif current_user.level >= 10:
        current_user.rank = "بطل محترف ⚡"
    else:
        current_user.rank = "لاعب متقدم 🎮"

    db.add(current_user)

    # Global leaderboard
    global_rank_res = await db.execute(
        select(LeaderboardRank).where(
            and_(LeaderboardRank.user_id == current_user.id, LeaderboardRank.world == "global")
        )
    )
    global_rank = global_rank_res.scalars().first()
    if not global_rank:
        global_rank = LeaderboardRank(
            id=f"lr_{uuid.uuid4().hex[:10]}",
            user_id=current_user.id,
            world="global",
            score=score_val,
            wins=1 if score_val > 0 else 0,
            games_played=1,
        )
        db.add(global_rank)
    else:
        global_rank.score += score_val
        global_rank.games_played += 1
        if score_val > 0:
            global_rank.wins += 1
        db.add(global_rank)

    # World-specific leaderboard
    if world_id != "global":
        world_rank_res = await db.execute(
            select(LeaderboardRank).where(
                and_(LeaderboardRank.user_id == current_user.id, LeaderboardRank.world == world_id)
            )
        )
        world_rank = world_rank_res.scalars().first()
        if not world_rank:
            world_rank = LeaderboardRank(
                id=f"lr_{uuid.uuid4().hex[:10]}",
                user_id=current_user.id,
                world=world_id,
                score=score_val,
                wins=1 if score_val > 0 else 0,
                games_played=1,
            )
            db.add(world_rank)
        else:
            world_rank.score += score_val
            world_rank.games_played += 1
            if score_val > 0:
                world_rank.wins += 1
            db.add(world_rank)

    # Daily missions — match by target_action, not fragile id substring
    missions_updated_list: list[str] = []
    today = date.today()
    world_action = WORLD_MISSION_ACTIONS.get(world_id)

    missions_res = await db.execute(select(DailyMission))
    available_missions = missions_res.scalars().all()

    for m in available_missions:
        should_progress = m.target_action == "play_any_game" or (
            world_action is not None and m.target_action == world_action
        )
        if not should_progress:
            continue

        ump_res = await db.execute(
            select(UserMissionProgress).where(
                and_(
                    UserMissionProgress.user_id == current_user.id,
                    UserMissionProgress.mission_id == m.id,
                    UserMissionProgress.mission_date == today,
                )
            )
        )
        ump = ump_res.scalars().first()

        if not ump:
            ump = UserMissionProgress(
                id=f"ump_{uuid.uuid4().hex[:10]}",
                user_id=current_user.id,
                mission_id=m.id,
                current_progress=1,
                is_completed=(1 >= m.target_count),
                mission_date=today,
            )
            db.add(ump)
            missions_updated_list.append(m.title_ar)
        elif not ump.is_completed:
            ump.current_progress += 1
            if ump.current_progress >= m.target_count:
                ump.is_completed = True
            db.add(ump)
            missions_updated_list.append(m.title_ar)

    # Achievements
    achievements_unlocked_list: list[str] = []
    total_games_res = await db.execute(
        select(func.count()).select_from(GameSession).where(GameSession.user_id == current_user.id)
    )
    # +1 because the current session is not committed yet
    total_games = int(total_games_res.scalar_one() or 0) + 1

    achievements_res = await db.execute(select(Achievement))
    all_achievements = achievements_res.scalars().all()

    for ach in all_achievements:
        ua_res = await db.execute(
            select(UserAchievement).where(
                and_(
                    UserAchievement.user_id == current_user.id,
                    UserAchievement.achievement_id == ach.id,
                )
            )
        )
        ua = ua_res.scalars().first()
        if not ua:
            ua = UserAchievement(
                id=f"ua_{uuid.uuid4().hex[:10]}",
                user_id=current_user.id,
                achievement_id=ach.id,
                current_progress=0,
                is_unlocked=False,
            )
            db.add(ua)

        if ua.is_unlocked:
            continue

        unlocked = False
        if ach.id == "ach_first_game" and total_games >= 1:
            unlocked = True
        elif ach.id == "ach_arcade_master" and total_games >= ach.required_count:
            unlocked = True
        elif ach.id == "ach_streak_hero" and total_games >= ach.required_count:
            unlocked = True
        elif ach.id == "ach_high_score" and score_val >= 1000:
            unlocked = True

        if unlocked:
            ua.is_unlocked = True
            ua.unlocked_at = datetime.utcnow()
            ua.current_progress = ach.required_count
            db.add(ua)
            achievements_unlocked_list.append(ach.title_ar)
            current_user.xp += ach.xp_reward
            current_user.coins += ach.coins_reward

    await db.commit()
    await db.refresh(current_user)

    return GameSessionResponse(
        id=session_record.id,
        gameId=game_id,
        score=score_val,
        xpEarned=total_xp_earned,
        coinsEarned=coins_earned,
        userXp=current_user.xp,
        userMaxXp=current_user.max_xp,
        userLevel=current_user.level,
        userCoins=current_user.coins,
        leveledUp=leveled_up,
        levelUpRewardCoins=level_up_reward_coins,
        rankTitle=current_user.rank,
        achievementsUnlocked=achievements_unlocked_list,
        missionsUpdated=missions_updated_list,
        createdAt=session_record.created_at,
    )
