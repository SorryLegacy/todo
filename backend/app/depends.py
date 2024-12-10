from typing import AsyncGenerator, Annotated
from fastapi import Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import User
from database.base import async_session
from sqlalchemy.ext.asyncio import AsyncSession
from services.auth import AuthService
from services.task import TaskService

security = HTTPBearer()


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session


Session = Annotated[AsyncSession, Depends(get_session)]

async def get_auth_service(session: Session) -> 'AuthService':
    return AuthService(session=session)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
) -> "User":
    token = credentials.credentials
    user = await auth_service.get_user_by_session(token)
    return user


async def get_task_service(session: Session, current_user: 'User' = Depends(get_current_user)) -> 'TaskService':
    return TaskService(session=session, current_user=current_user)


async def get_current_user_ws(
    token: str = Query(...),
    auth_service: AuthService = Depends(get_auth_service)
) -> 'User':
    return await auth_service.get_user_by_session(token)


async def get_task_service_ws(
    session: Session, 
    current_user: 'User' = Depends(get_current_user_ws)
) -> 'TaskService':
    return TaskService(session=session, current_user=current_user)
