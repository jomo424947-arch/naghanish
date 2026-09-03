"""
routers/auth.py

Registration, login, token refresh, logout.

Prefix: /api/v1/auth
Tag:    Authentication
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, SocialLoginRequest, TokenResponse
from app.schemas.user import UserResponse
from app.core.security import hash_password, verify_password, create_access_token
from app.dependencies.auth import get_current_active_user

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister, db: AsyncSession = Depends(get_db)):
    """Register a new user account."""
    # Check if user with same email or username exists
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

    token = create_access_token(user.id)
    return TokenResponse(token=token, user=UserResponse.model_validate(user))


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

    token = create_access_token(user.id)
    return TokenResponse(token=token, user=UserResponse.model_validate(user))


@router.post("/social", response_model=TokenResponse)
async def social_login(payload: SocialLoginRequest, db: AsyncSession = Depends(get_db)):
    """Google / Apple Social Login endpoint."""
    user_payload = payload.user
    email = user_payload.email if user_payload and user_payload.email else f"{payload.provider}_{payload.idToken[:8]}@naghanish.com"
    name = user_payload.name if user_payload and user_payload.name else f"مستخدم {payload.provider.title()}"
    username = user_payload.username if user_payload and user_payload.username else f"user_{uuid.uuid4().hex[:6]}"

    # Check if existing user
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()

    if not user:
        # Check username collision
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

    token = create_access_token(user.id)
    return TokenResponse(token=token, user=UserResponse.model_validate(user))


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_active_user)):
    """Get profile of current authenticated user."""
    return UserResponse.model_validate(current_user)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(current_user: User = Depends(get_current_active_user)):
    """Refresh JWT access token."""
    new_token = create_access_token(current_user.id)
    return TokenResponse(token=new_token, user=UserResponse.model_validate(current_user))


@router.post("/guest", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def create_guest_session(db: AsyncSession = Depends(get_db)):
    """
    Generate instant guest session for Mobile Apps (Flutter/React Native) or Web.
    Allows instant gameplay, points accumulation, and score tracking with zero onboarding barriers.
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

    token = create_access_token(guest_user.id)
    return TokenResponse(token=token, user=UserResponse.model_validate(guest_user))


