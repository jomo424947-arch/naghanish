"""
dependencies/auth.py

FastAPI dependency injection for authentication.
Extracts and validates the current user from the JWT token.
"""

# from fastapi import Depends, Security
# from fastapi.security import OAuth2PasswordBearer
# from sqlalchemy.ext.asyncio import AsyncSession
# from app.database.session import get_db
# from app.security.jwt import verify_token
# from app.repositories.user import get_by_id
# from app.types import User

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


# async def get_current_user(
#     token: str = Security(oauth2_scheme),
#     db: AsyncSession = Depends(get_db),
# ) -> User:
#     payload = verify_token(token)
#     user = await get_by_id(db, payload["sub"])
#     if not user:
#         raise UnauthorizedException("User not found")
#     return user


# async def get_current_active_user(
#     current_user: User = Depends(get_current_user),
# ) -> User:
#     # TODO: Check if user account is active
#     return current_user

# TODO: Implement authentication dependencies
