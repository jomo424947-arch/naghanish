"""
api/router.py

Aggregates all domain routers into a single APIRouter.
Include this router in main.py with a versioned prefix.
"""

from fastapi import APIRouter
from app.api.routers.auth import router as auth_router
from app.api.routers.users import router as users_router
from app.api.routers.games import router as games_router
from app.api.routers.quizzes import router as quizzes_router
from app.api.routers.party import router as party_router
from app.api.routers.leaderboard import router as leaderboard_router
from app.api.routers.achievements import router as achievements_router
from app.api.routers.missions import router as missions_router
from app.api.routers.friends import router as friends_router
from app.api.routers.notifications import router as notifications_router
from app.api.routers.search import router as search_router
from app.api.routers.profile import router as profile_router
from app.api.routers.settings import router as settings_router
from app.api.routers.community import router as community_router
from app.api.routers.ai import router as ai_router
from app.api.routers.store import router as store_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(users_router, prefix="/users", tags=["Users"])
api_router.include_router(games_router, prefix="/games", tags=["Games"])
api_router.include_router(quizzes_router, prefix="/quizzes", tags=["Quizzes"])
api_router.include_router(party_router, prefix="/party", tags=["Party"])
api_router.include_router(leaderboard_router, prefix="/leaderboard", tags=["Leaderboard"])
api_router.include_router(achievements_router, prefix="/achievements", tags=["Achievements"])
api_router.include_router(missions_router, prefix="/missions", tags=["Missions"])
api_router.include_router(friends_router, prefix="/friends", tags=["Friends"])
api_router.include_router(notifications_router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(search_router, prefix="/search", tags=["Search"])
api_router.include_router(profile_router, prefix="/profile", tags=["Profile"])
api_router.include_router(settings_router, prefix="/settings", tags=["Settings"])
api_router.include_router(community_router, prefix="/community", tags=["Community"])
api_router.include_router(ai_router, prefix="/ai", tags=["AI"])
api_router.include_router(store_router, prefix="/store", tags=["Store"])

