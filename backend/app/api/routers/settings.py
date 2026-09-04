from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from app.models.user import User
from app.dependencies.auth import get_current_active_user

router = APIRouter()


class UserSettingsResponse(BaseModel):
    sound_enabled: bool = True
    music_enabled: bool = True
    notifications_enabled: bool = True
    language: str = "ar"
    theme: str = "dark"

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class UpdateSettingsRequest(BaseModel):
    sound_enabled: bool | None = None
    music_enabled: bool | None = None
    notifications_enabled: bool | None = None
    language: str | None = None
    theme: str | None = None


@router.get("", response_model=UserSettingsResponse)
async def get_settings(current_user: User = Depends(get_current_active_user)):
    """Get player application preferences."""
    return UserSettingsResponse()


@router.patch("", response_model=UserSettingsResponse)
async def update_settings(
    payload: UpdateSettingsRequest,
    current_user: User = Depends(get_current_active_user),
):
    """Save player application preferences."""
    return UserSettingsResponse(
        sound_enabled=payload.sound_enabled if payload.sound_enabled is not None else True,
        music_enabled=payload.music_enabled if payload.music_enabled is not None else True,
        notifications_enabled=payload.notifications_enabled if payload.notifications_enabled is not None else True,
        language=payload.language or "ar",
        theme=payload.theme or "dark",
    )
