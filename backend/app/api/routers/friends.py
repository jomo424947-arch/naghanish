from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from pydantic import BaseModel, ConfigDict, Field

from app.database.session import get_db
from app.models.user import User
from app.dependencies.auth import get_current_active_user

router = APIRouter()


class FriendResponse(BaseModel):
    id: str
    name: str
    username: str
    avatar: str
    level: int
    rank: str
    is_online: bool = Field(..., alias="isOnline")
    status_text: str = Field(..., alias="statusText")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


MOCK_FRIENDS = [
    {"id": "fr_1", "name": "ياسين البطل ⚡", "username": "yassin_speed", "avatar": "/avatars/mascot-1.svg", "level": 18, "rank": "#4", "isOnline": True, "statusText": "يلعب في عالم الأركيد 🕹️"},
    {"id": "fr_2", "name": "مريم العبقرية 🧠", "username": "mariam_iq", "avatar": "/avatars/mascot-2.svg", "level": 24, "rank": "#2", "isOnline": True, "statusText": "في اختبار القيادة 💡"},
    {"id": "fr_3", "name": "أنس التحدي 🎯", "username": "anas_ninja", "avatar": "/avatars/mascot-3.svg", "level": 15, "rank": "#8", "isOnline": False, "statusText": "آخر ظهور منذ ساعتين"},
    {"id": "fr_4", "name": "هدى الشلة 🎉", "username": "hoda_party", "avatar": "/avatars/mascot-4.svg", "level": 12, "rank": "#15", "isOnline": True, "statusText": "متصلة الآن 🟢"},
]


@router.get("", response_model=List[FriendResponse])
async def list_friends(current_user: User = Depends(get_current_active_user)):
    """List player's friends and their online activity."""
    return [FriendResponse.model_validate(f) for f in MOCK_FRIENDS]


@router.post("/{friend_id}/invite")
async def send_duel_invite(
    friend_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Send a real-time game duel invitation to a friend."""
    return {
        "status": "success",
        "message": "تم إرسال دعوة التحدي بنجاح! في انتظار قبول الصديق ⚔️",
        "friend_id": friend_id,
    }
