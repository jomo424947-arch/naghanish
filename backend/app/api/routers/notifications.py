from fastapi import APIRouter, Depends
from typing import List
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

from app.models.user import User
from app.dependencies.auth import get_current_active_user

router = APIRouter()


class NotificationResponse(BaseModel):
    id: str
    title: str = Field(..., alias="titleAr")
    body: str = Field(..., alias="bodyAr")
    icon: str
    type: str
    is_read: bool = Field(False, alias="isRead")
    time_ago: str = Field("الآن", alias="timeAgo")
    action_url: str = Field("/home", alias="actionUrl")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


MOCK_NOTIFS = [
    {
        "id": "n1",
        "titleAr": "ترقية في المستوى! 🎉",
        "bodyAr": "مبروك وصولك لمستوى جديد! حصلت على مكافأة +100 كوينز.",
        "icon": "🎉",
        "type": "level_up",
        "isRead": False,
        "timeAgo": "منذ 5 دقائق",
        "actionUrl": "/profile",
    },
    {
        "id": "n2",
        "titleAr": "تحدي الشلة المباشر ⚔️",
        "bodyAr": "دعاك صديقك أحمد لجولة حاسمة في مبارزة أسئلة الشلة!",
        "icon": "⚔️",
        "type": "game_invite",
        "isRead": False,
        "timeAgo": "منذ 15 دقيقة",
        "actionUrl": "/party/lobby/NAG123",
    },
    {
        "id": "n3",
        "titleAr": "انطلاق كأس الأسبوع 🏆",
        "titleEn": "Weekly Tournament Started",
        "bodyAr": "بدأت تصفيات كأس الأسبوع الكبرى بجوائز تصل إلى 25,000 XP!",
        "icon": "🏆",
        "type": "reward",
        "isRead": True,
        "timeAgo": "منذ ساعتين",
        "actionUrl": "/leaderboard",
    },
]


@router.get("", response_model=List[NotificationResponse])
async def list_notifications(current_user: User = Depends(get_current_active_user)):
    """List notifications for current user."""
    return [NotificationResponse.model_validate(n) for n in MOCK_NOTIFS]


@router.post("/read-all")
async def mark_all_notifications_read(current_user: User = Depends(get_current_active_user)):
    """Mark all notifications as read."""
    return {"status": "success", "message": "تم تحديد كافة الإشعارات كمقروءة"}
