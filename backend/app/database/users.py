from typing import Self
from pydantic import model_validator
from utils import hash_password

from sqlmodel import Field, SQLModel
from .base import BaseModel

class User(BaseModel, table=True):
    __tablename__ = "users_users" 

    email: str = Field(index=True, nullable=False, unique=True)
    password: str = Field(nullable=False)


class UserCreate(SQLModel):
    email: str
    password: str
    confirm_password: str

    @model_validator(mode='after')
    def check_passwords_match(self) -> Self:
        if self.password != self.confirm_password:
            raise ValueError('passwords do not match')
        return self

    def model_dump(self, *args, **kwargs):
        data = super().model_dump(*args, **kwargs)
        data.pop('confirm_password', None)
        data['password'] = hash_password(data['password'])
        return data

