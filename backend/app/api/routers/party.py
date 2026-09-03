import random
import string
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

from app.database.session import get_db
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


# In-memory live active rooms storage for instant multiplayer interaction
ACTIVE_ROOMS = {
    "NAG123": {
        "id": "room_live_1",
        "code": "NAG123",
        "name": "سهرة وتحديات الشلة الكبرى 🎉",
        "gameId": "g10",
        "hostName": "أحمد الملك 👑",
        "playersCount": 4,
        "maxPlayers": 8,
        "status": "waiting",
        "participants": [
            {"id": "p1", "name": "أحمد الملك 👑", "username": "ahmed_boss", "avatar": "/avatars/mascot-1.svg", "isReady": True, "isHost": True, "score": 120},
            {"id": "p2", "name": "سارة 🌸", "username": "sara_gamer", "avatar": "/avatars/mascot-2.svg", "isReady": True, "isHost": False, "score": 90},
            {"id": "p3", "name": "عمر النفاثة 🚀", "username": "omar_speed", "avatar": "/avatars/mascot-3.svg", "isReady": False, "isHost": False, "score": 40},
            {"id": "p4", "name": "كريم العبقري 🧠", "username": "kareem_iq", "avatar": "/avatars/mascot-4.svg", "isReady": True, "isHost": False, "score": 80},
        ],
    },
    "FUN999": {
        "id": "room_live_2",
        "code": "FUN999",
        "name": "تحدي الضحك والمقالب 😂",
        "gameId": "g11",
        "hostName": "مروان الكوميدي 🎭",
        "playersCount": 3,
        "maxPlayers": 6,
        "status": "waiting",
        "participants": [
            {"id": "p5", "name": "مروان الكوميدي 🎭", "username": "marwan_fun", "avatar": "/avatars/mascot-5.svg", "isReady": True, "isHost": True, "score": 150},
            {"id": "p6", "name": "نور الضحك 🌟", "username": "nour_star", "avatar": "/avatars/mascot-1.svg", "isReady": True, "isHost": False, "score": 110},
            {"id": "p7", "name": "خالد 🎮", "username": "khaled_pro", "avatar": "/avatars/mascot-2.svg", "isReady": False, "isHost": False, "score": 30},
        ],
    },
}


@router.get("/rooms", response_model=List[RoomResponse])
async def list_public_rooms():
    """List all public active party rooms."""
    return [RoomResponse.model_validate(r) for r in ACTIVE_ROOMS.values()]


@router.post("/rooms", response_model=RoomResponse)
async def create_room(
    payload: CreateRoomRequest,
    current_user: User = Depends(get_current_active_user),
):
    """Create a new room with a unique 6-digit code."""
    code = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    new_room = {
        "id": f"room_{code.lower()}",
        "code": code,
        "name": payload.name,
        "gameId": payload.game_id,
        "hostName": current_user.name,
        "playersCount": 1,
        "maxPlayers": payload.max_players,
        "status": "waiting",
        "participants": [
            {
                "id": current_user.id,
                "name": current_user.name,
                "username": current_user.username,
                "avatar": current_user.avatar,
                "isReady": True,
                "isHost": True,
                "score": 0,
            }
        ],
    }
    ACTIVE_ROOMS[code] = new_room
    return RoomResponse.model_validate(new_room)


@router.get("/rooms/{code}", response_model=RoomResponse)
async def get_room(code: str):
    """Get details of a specific room by code."""
    code = code.upper()
    if code not in ACTIVE_ROOMS:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="الغرفة غير موجودة أو انتهت الجلسة")
    return RoomResponse.model_validate(ACTIVE_ROOMS[code])


@router.post("/rooms/{code}/join", response_model=RoomResponse)
async def join_room(
    code: str,
    current_user: User = Depends(get_current_active_user),
):
    """Join an existing party room."""
    code = code.upper()
    if code not in ACTIVE_ROOMS:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رمز الغرفة غير صحيح")

    room = ACTIVE_ROOMS[code]
    if any(p["id"] == current_user.id for p in room["participants"]):
        return RoomResponse.model_validate(room)

    if len(room["participants"]) >= room["maxPlayers"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="الغرفة ممتلئة بالكامل")

    room["participants"].append(
        {
            "id": current_user.id,
            "name": current_user.name,
            "username": current_user.username,
            "avatar": current_user.avatar,
            "isReady": False,
            "isHost": False,
            "score": 0,
        }
    )
    room["playersCount"] = len(room["participants"])
    return RoomResponse.model_validate(room)
