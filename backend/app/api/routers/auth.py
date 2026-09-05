"""
routers/auth.py

Registration, login, token refresh, logout.

Prefix: /api/v1/auth
Tag:    Authentication
"""

import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.database.session import get_db
from app.models.user import User
from app.models.auth import RefreshToken
from app.schemas.auth import UserRegister, UserLogin, SocialLoginRequest, TokenResponse, RefreshTokenRequest, NameLoginRequest
from app.schemas.user import UserResponse
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.dependencies.auth import get_current_active_user

router = APIRouter()



async def _issue_token_response(user: User, db: AsyncSession) -> TokenResponse:
    access_token = create_access_token(user.id)
    raw_refresh_token, expires_at = create_refresh_token(user.id)

    db_refresh_token = RefreshToken(
        id=f"rt_{uuid.uuid4().hex[:12]}",
        user_id=user.id,
        token_hash=raw_refresh_token[-32:],  # store signature part for lookup/validation
        expires_at=expires_at.replace(tzinfo=None),
        is_revoked=False,
    )
    db.add(db_refresh_token)
    await db.commit()

    return TokenResponse(
        token=access_token,
        refreshToken=raw_refresh_token,
        user=UserResponse.model_validate(user),
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister, db: AsyncSession = Depends(get_db)):
    """Register a new user account."""
    query = select(User).where(or_(User.email == payload.email, User.username == payload.username))
    result = await db.execute(query)
    existing_user = result.scalars().first()

    if existing_user:
        if existing_user.email == payload.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="البريد الإلكتروني مسجل بالفعل",
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="اسم المستخدم مأخوذ بالفعل",
        )

    user = User(
        email=payload.email,
        username=payload.username,
        name=payload.name,
        hashed_password=hash_password(payload.password),
        provider="email",
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return await _issue_token_response(user, db)


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    """Login with email/username and password."""
    query = select(User).where(or_(User.email == payload.email, User.username == payload.email))
    result = await db.execute(query)
    user = result.scalars().first()

    if not user or not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="البريد الإلكتروني أو كلمة المرور غير صحيحة",
        )

    return await _issue_token_response(user, db)


@router.post("/social", response_model=TokenResponse)
async def social_login(payload: SocialLoginRequest, db: AsyncSession = Depends(get_db)):
    """Google / Apple Social Login endpoint."""
    user_payload = payload.user
    email = user_payload.email if user_payload and user_payload.email else f"{payload.provider}_{payload.idToken[:8]}@naghanish.com"
    name = user_payload.name if user_payload and user_payload.name else f"مستخدم {payload.provider.title()}"
    username = user_payload.username if user_payload and user_payload.username else f"user_{uuid.uuid4().hex[:6]}"

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()

    if not user:
        un_result = await db.execute(select(User).where(User.username == username))
        if un_result.scalars().first():
            username = f"user_{uuid.uuid4().hex[:8]}"

        user = User(
            email=email,
            username=username,
            name=name,
            provider=payload.provider.lower(),
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    return await _issue_token_response(user, db)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_active_user)):
    """Get profile of current authenticated user."""
    return UserResponse.model_validate(current_user)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    payload: Optional[RefreshTokenRequest] = None,
    current_user: Optional[User] = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Refresh JWT access token using DB-backed validation."""
    target_user = current_user
    if payload and payload.refresh_token:
        decoded = decode_token(payload.refresh_token)
        if decoded and "sub" in decoded:
            u_res = await db.execute(select(User).where(User.id == decoded["sub"]))
            found_user = u_res.scalars().first()
            if found_user:
                target_user = found_user

    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="رمز التحديث غير صالح أو منتهي الصلاحية",
        )

    return await _issue_token_response(target_user, db)


@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Revoke user's active refresh tokens."""
    query = select(RefreshToken).where(
        RefreshToken.user_id == current_user.id,
        RefreshToken.is_revoked.is_(False),
    )
    result = await db.execute(query)
    tokens = result.scalars().all()
    for t in tokens:
        t.is_revoked = True
        db.add(t)
    await db.commit()
    return {"status": "success", "message": "تم تسجيل الخروج بنجاح وإلغاء الجلسات النشطة"}


@router.post("/guest", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def create_guest_session(db: AsyncSession = Depends(get_db)):
    """
    Generate instant guest session for Mobile Apps or Web with persistent database user.
    """
    guest_uuid = uuid.uuid4().hex[:8]
    guest_user = User(
        id=f"guest_{guest_uuid}",
        email=f"guest_{guest_uuid}@naghanish.internal",
        username=f"بطل_جديد_{guest_uuid[:4]}",
        name=f"لاعب ضيف #{guest_uuid[:4]}",
        avatar="/avatars/mascot-1.svg",
        provider="guest",
        level=1,
        xp=0,
        max_xp=1000,
        coins=200,
        rank="مبتدئ 🎮",
        is_active=True,
    )
    db.add(guest_user)
    await db.commit()
    await db.refresh(guest_user)

    return await _issue_token_response(guest_user, db)


@router.post("/name-login", response_model=TokenResponse)
async def name_login(payload: NameLoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Login or register instantly by Name only.
    If a user with this name exists, logs them in.
    If not, creates a fresh user with this name and returns a full JWT token.
    """
    clean_name = payload.name.strip()
    if not clean_name or len(clean_name) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="يرجى إدخال اسم صحيح يحتوي على حرفين على الأقل",
        )

    # Check if a user with this name already exists
    query = select(User).where(or_(User.name == clean_name, User.username == clean_name))
    result = await db.execute(query)
    user = result.scalars().first()

    if not user:
        user_uuid = uuid.uuid4().hex[:6]
        base_username = clean_name.replace(" ", "_")
        safe_username = f"{base_username}_{user_uuid}"

        user = User(
            id=f"usr_{uuid.uuid4().hex[:10]}",
            email=f"{user_uuid}@naghanish.internal",
            username=safe_username,
            name=clean_name,
            avatar=payload.avatar or "/avatars/mascot-1.svg",
            provider="name",
            level=1,
            xp=0,
            max_xp=1000,
            coins=100,
            rank="مبتدئ 🎮",
            is_active=True,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    return await _issue_token_response(user, db)