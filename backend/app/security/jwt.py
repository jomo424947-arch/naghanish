"""
security/jwt.py

JWT token creation and verification.
"""

# from datetime import datetime, timedelta, timezone
# from jose import jwt, JWTError
# from app.config.settings import settings


# def create_access_token(subject: str) -> str:
#     expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
#     payload = {"sub": subject, "exp": expire, "type": "access"}
#     return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


# def create_refresh_token(subject: str) -> str:
#     expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
#     payload = {"sub": subject, "exp": expire, "type": "refresh"}
#     return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


# def verify_token(token: str) -> dict:
#     try:
#         return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
#     except JWTError:
#         raise UnauthorizedException("Invalid token")

# TODO: Implement JWT functions
