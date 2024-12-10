from typing import Any
from dataclasses import dataclass
from settings import settings
import jwt
from .base import BaseCRUDService
from database import User, UserCreate, SessionToken, PasswordChange
from fastapi import HTTPException
from sqlalchemy import select
from fastapi.security import OAuth2PasswordRequestForm
from utils import verify_password, hash_password



@dataclass(kw_only=True)
class AuthService(BaseCRUDService):

    def _encode_jwt(self, payload: dict[str, Any]) -> str:
        encoded_jwt = jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)
        return encoded_jwt
    
    def _decode_jwt(self, jwt_str: str) -> dict[str, Any]:

        try:
            payload = jwt.decode(jwt_str, settings.secret_key, algorithms=[settings.algorithm])
        except jwt.exceptions.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")
        else:
            return payload
    
    async def get_user_by_session(self, jwt_str: str) -> 'User':
        payload = self._decode_jwt(jwt_str)
        query = select(User).where(User.email == payload.get('email'))
        user = await self.scalar_or_none(query)

        if not user:
            raise HTTPException(status_code=401, detail="User with such email does not exists")
        return user

    async def login_user(self, data: OAuth2PasswordRequestForm) -> SessionToken:
        exception = HTTPException(status_code=404, detail="Invalid credentials")        
        query = select(User).where(User.email == data.username)
        user: User = await self.scalar_or_none(query)

        if not user:
            raise exception
        if verify_password(data.password, user.password):
            return SessionToken(access_token=self._encode_jwt({"email": user.email}))
        
        raise exception
    

    async def sing_up_user(self, new_user: UserCreate) -> 'SessionToken':
        query = select(User).where(User.email == new_user.email)
        exists = await self.scalar_or_none(query)

        if exists:
            raise HTTPException(401, detail="User withh such email exists")

        user = User(**new_user.model_dump())
        self.session.add(user)
        await self.session.commit()
        return SessionToken(access_token=self._encode_jwt({"email": user.email}))


    async def change_password(self, data: PasswordChange, user: User) -> dict[str, str]:
        if verify_password(data.old_password, user.password):
            user.password = hash_password(data.new_password)
            self.session.add(user)
            await self.session.commit()
            return {"status": "Ok"}
        raise HTTPException(400, detail="Old password does not match")
    