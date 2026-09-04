from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

from app.database.session import get_db
from app.models.user import User
from app.models.notification import Notification
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


def _format_time_ago(dt: datetime) -> str:
    diff = datetime.utcnow() - dt
    seconds = int(diff.total_seconds())
    if seconds < 60:
        return "الآن"
    minutes = seconds // 60
    if minutes < 60:
        return f"منذ {minutes} دقيقة"
    hours = minutes // 60
    if hours < 24:
        return f"منذ {hours} ساعة"
    days = hours // 24
    return f"منذ {days} يوم"


@router.get("", response_model=List[NotificationResponse])
async def list_notifications(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """List notifications for current user directly from database."""
    query = (
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(desc(Notification.created_at))
        .limit(50)
    )
    result = await db.execute(query)
    notifs = result.scalars().all()

    return [
        NotificationResponse(
            id=n.id,
            titleAr=n.title_ar,
            bodyAr=n.body_ar,
            icon=n.icon,
            type=n.type,
            isRead=n.is_read,
            timeAgo=_format_time_ago(n.created_at),
            actionUrl=n.action_url or "/home",
        )
        for n in notifs
    ]


@router.post("/read-all")
async def mark_all_notifications_read(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Mark all notifications as read in database."""
    query = select(Notification).where(
        Notification.user_id == current_user.id,
        Notification.is_read == False,
    )
    result = await db.execute(query)
    unread_notifs = result.scalars().all()
    for n in unread_notifs:
        n.is_read = True
        db.add(n)
    await db.commit()

    return {"status": "success", "message": "تم تحديد كافة الإشعارات كمقروءة"}


@router.post("/{notif_id}/read")
async def mark_notification_read(
    notif_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Mark a single notification as read."""
    res = await db.execute(
        select(Notification).where(Notification.id == notif_id, Notification.user_id == current_user.id)
    )
    notif = res.scalars().first()
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="الإشعار غير موجود")

    notif.is_read = True
    db.add(notif)
    await db.commit()
    return {"status": "success", "message": "تم تحديد الإشعار كمقروء"}


@router.delete("/{notif_id}")
async def delete_notification(
    notif_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete an individual notification from database."""
    res = await db.execute(
        select(Notification).where(Notification.id == notif_id, Notification.user_id == current_user.id)
    )
    notif = res.scalars().first()
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="الإشعار غير موجود")

    await db.delete(notif)
    await db.commit()
    return {"status": "success", "message": "تم حذف الإشعار بنجاح"}
