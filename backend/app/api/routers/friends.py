from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_
from sqlalchemy.orm import joinedload
from typing import List
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

from app.database.session import get_db
from app.models.friend import Friendship
from app.models.user import User
from app.models.notification import Notification
from app.dependencies.auth import get_current_active_user

router = APIRouter()


class FriendResponse(BaseModel):
    id: str
    name: str
    username: str
    avatar: str
    level: int
    rank: str
    is_online: bool = Field(True, alias="isOnline")
    status_text: str = Field("متصل 🟢", alias="statusText")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


@router.get("", response_model=List[FriendResponse])
async def list_friends(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """List player's accepted friends directly from database."""
    query = (
        select(Friendship)
        .options(joinedload(Friendship.friend))
        .where(
            and_(
                Friendship.user_id == current_user.id,
                Friendship.status == "accepted",
            )
        )
    )
    result = await db.execute(query)
    friendships = result.scalars().all()

    friends_list: List[FriendResponse] = []
    for f in friendships:
        if f.friend:
            friends_list.append(
                FriendResponse(
                    id=f.friend.id,
                    name=f.friend.name,
                    username=f.friend.username,
                    avatar=f.friend.avatar,
                    level=f.friend.level,
                    rank=f.friend.rank,
                    isOnline=f.friend.is_active,
                    statusText="متصل 🟢" if f.friend.is_active else "غير متصل ⚪",
                )
            )

    return friends_list


@router.post("/request/{target_user_id}")
async def send_friend_request(
    target_user_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Send or accept a friend request in database."""
    if target_user_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="لا يمكنك إضافة نفسك كصديق")

    target_res = await db.execute(select(User).where(User.id == target_user_id))
    target = target_res.scalars().first()
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="المستخدم غير موجود")

    # Check if already friends
    existing = await db.execute(
        select(Friendship).where(
            and_(Friendship.user_id == current_user.id, Friendship.friend_id == target_user_id)
        )
    )
    if existing.scalars().first():
        return {"status": "success", "message": "طلب الصداقة موجود بالفعل أو مقبول"}

    # Create mutual friendship
    f1 = Friendship(user_id=current_user.id, friend_id=target_user_id, status="accepted")
    f2 = Friendship(user_id=target_user_id, friend_id=current_user.id, status="accepted")
    db.add_all([f1, f2])

    # Send notification to target user
    notif = Notification(
        user_id=target_user_id,
        title_ar="طلب صداقة جديد 👥",
        title_en="New Friend Added",
        body_ar=f"أضافك اللاعب {current_user.name} لقائمة أصدقائه في نغنِش.",
        body_en=f"{current_user.name} added you as a friend on Naghanish.",
        icon="👥",
        type="friend",
    )
    db.add(notif)
    await db.commit()

    return {"status": "success", "message": f"تمت إضافة {target.name} إلى قائمة أصدقائك بنجاح! 🤝"}


@router.post("/{friend_id}/invite")
async def send_duel_invite(
    friend_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Send real-time game duel invitation by persisting a notification in database."""
    # Verify friend exists
    friend_res = await db.execute(select(User).where(User.id == friend_id))
    friend = friend_res.scalars().first()
    if not friend:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="الصديق غير موجود")

    notif = Notification(
        user_id=friend_id,
        title_ar="تحدي مباشر جديد! ⚔️",
        title_en="New Duel Challenge! ⚔️",
        body_ar=f"دعاك صديقك {current_user.name} لمبارزة حماسية في عوالم نغنِش!",
        body_en=f"{current_user.name} challenged you to a live duel!",
        icon="⚔️",
        type="game_invite",
        action_url="/party",
    )
    db.add(notif)
    await db.commit()

    return {
        "status": "success",
        "message": f"تم إرسال دعوة التحدي إلى {friend.name} بنجاح! ⚔️",
        "friend_id": friend_id,
    }


@router.delete("/{friend_id}")
async def remove_friend(
    friend_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Remove a friendship record from database."""
    query = select(Friendship).where(
        or_(
            and_(Friendship.user_id == current_user.id, Friendship.friend_id == friend_id),
            and_(Friendship.user_id == friend_id, Friendship.friend_id == current_user.id),
        )
    )
    res = await db.execute(query)
    for row in res.scalars().all():
        await db.delete(row)
    await db.commit()

    return {"status": "success", "message": "تم حذف الصديق بنجاح"}
