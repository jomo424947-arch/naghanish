import random
import string
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc
from sqlalchemy.orm import joinedload
from typing import List
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

from app.database.session import get_db
from app.models.room import PartyRoom, RoomParticipant
from app.models.user import User
from app.dependencies.auth import get_current_active_user

router = APIRouter()


class CreateRoomRequest(BaseModel):
    name: str = "سهرة الشلة 🥳"
    game_id: str = "g10"
    max_players: int = 8
    is_private: bool = False


class ParticipantDto(BaseModel):
    id: str
    name: str
    username: str
    avatar: str
    is_ready: bool = Field(..., alias="isReady")
    is_host: bool = Field(..., alias="isHost")
    score: int = 0

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class RoomResponse(BaseModel):
    id: str
    code: str
    name: str
    game_id: str = Field(..., alias="gameId")
    host_name: str = Field(..., alias="hostName")
    players_count: int = Field(..., alias="playersCount")
    max_players: int = Field(..., alias="maxPlayers")
    status: str
    participants: List[ParticipantDto]

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


def _build_room_response(room: PartyRoom) -> RoomResponse:
    participants_dto = []
    host_name = room.host.name if room.host else "المضيف"

    for p in room.participants:
        u = p.user
        if u:
            participants_dto.append(
                ParticipantDto(
                    id=u.id,
                    name=u.name,
                    username=u.username,
                    avatar=u.avatar,
                    isReady=p.is_ready,
                    isHost=p.is_host,
                    score=p.score,
                )
            )

    return RoomResponse(
        id=room.id,
        code=room.code,
        name=room.name,
        gameId=room.game_id,
        hostName=host_name,
        playersCount=len(participants_dto),
        maxPlayers=room.max_players,
        status=room.status,
        participants=participants_dto,
    )


@router.get("/rooms", response_model=List[RoomResponse])
async def list_public_rooms(db: AsyncSession = Depends(get_db)):
    """List all public active party rooms directly from database."""
    query = (
        select(PartyRoom)
        .options(
            joinedload(PartyRoom.host),
            joinedload(PartyRoom.participants).joinedload(RoomParticipant.user),
        )
        .where(
            and_(
                PartyRoom.is_private == False,
                PartyRoom.status != "finished",
            )
        )
        .order_by(desc(PartyRoom.created_at))
        .limit(30)
    )
    result = await db.execute(query)
    rooms = result.unique().scalars().all()

    return [_build_room_response(r) for r in rooms]


@router.post("/rooms", response_model=RoomResponse)
async def create_room(
    payload: CreateRoomRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new party room and save to database."""
    # Generate unique 6-character room code
    while True:
        code = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
        existing = await db.execute(select(PartyRoom).where(PartyRoom.code == code))
        if not existing.scalars().first():
            break

    room = PartyRoom(
        id=f"room_{uuid.uuid4().hex[:10]}",
        code=code,
        name=payload.name,
        host_id=current_user.id,
        game_id=payload.game_id,
        max_players=payload.max_players,
        is_private=payload.is_private,
        status="waiting",
    )
    db.add(room)
    await db.flush()

    # Add host as first participant
    host_participant = RoomParticipant(
        room_id=room.id,
        user_id=current_user.id,
        score=0,
        is_ready=True,
        is_host=True,
    )
    db.add(host_participant)
    await db.commit()

    # Re-fetch with relationships loaded
    q = (
        select(PartyRoom)
        .options(
            joinedload(PartyRoom.host),
            joinedload(PartyRoom.participants).joinedload(RoomParticipant.user),
        )
        .where(PartyRoom.id == room.id)
    )
    full_room = (await db.execute(q)).unique().scalars().first()
    return _build_room_response(full_room)


@router.get("/rooms/{code}", response_model=RoomResponse)
async def get_room(code: str, db: AsyncSession = Depends(get_db)):
    """Get room details by 6-digit code from database."""
    code = code.strip().upper()
    query = (
        select(PartyRoom)
        .options(
            joinedload(PartyRoom.host),
            joinedload(PartyRoom.participants).joinedload(RoomParticipant.user),
        )
        .where(PartyRoom.code == code)
    )
    result = await db.execute(query)
    room = result.unique().scalars().first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="الغرفة غير موجودة أو انتهت الجلسة")

    return _build_room_response(room)


@router.post("/rooms/{code}/join", response_model=RoomResponse)
async def join_room(
    code: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Join an active party room in database."""
    code = code.strip().upper()
    query = (
        select(PartyRoom)
        .options(
            joinedload(PartyRoom.host),
            joinedload(PartyRoom.participants).joinedload(RoomParticipant.user),
        )
        .where(PartyRoom.code == code)
    )
    result = await db.execute(query)
    room = result.unique().scalars().first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رمز الغرفة غير صحيح")

    # Check if already joined
    already_joined = any(p.user_id == current_user.id for p in room.participants)
    if already_joined:
        return _build_room_response(room)

    # Check capacity
    if len(room.participants) >= room.max_players:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="الغرفة ممتلئة بالكامل")

    # Add participant
    new_p = RoomParticipant(
        room_id=room.id,
        user_id=current_user.id,
        score=0,
        is_ready=False,
        is_host=False,
    )
    db.add(new_p)
    await db.commit()

    # Re-fetch
    refreshed = (await db.execute(query)).unique().scalars().first()
    return _build_room_response(refreshed)


@router.post("/rooms/{code}/ready", response_model=RoomResponse)
async def toggle_ready(
    code: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Toggle participant ready status in database."""
    code = code.strip().upper()
    query = (
        select(PartyRoom)
        .options(
            joinedload(PartyRoom.host),
            joinedload(PartyRoom.participants).joinedload(RoomParticipant.user),
        )
        .where(PartyRoom.code == code)
    )
    result = await db.execute(query)
    room = result.unique().scalars().first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="الغرفة غير موجودة")

    participant = next((p for p in room.participants if p.user_id == current_user.id), None)
    if not participant:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="أنت لست عضواً في هذه الغرفة")

    participant.is_ready = not participant.is_ready
    db.add(participant)
    await db.commit()

    refreshed = (await db.execute(query)).unique().scalars().first()
    return _build_room_response(refreshed)


@router.post("/rooms/{code}/leave")
async def leave_room(
    code: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Leave party room in database."""
    code = code.strip().upper()
    res = await db.execute(
        select(PartyRoom)
        .options(joinedload(PartyRoom.participants))
        .where(PartyRoom.code == code)
    )
    room = res.unique().scalars().first()
    if not room:
        return {"status": "success", "message": "تمت المغادرة"}

    for p in room.participants:
        if p.user_id == current_user.id:
            await db.delete(p)

    if room.host_id == current_user.id:
        room.status = "finished"
        db.add(room)

    await db.commit()
    return {"status": "success", "message": "تمت مغادرة الغرفة بنجاح"}
