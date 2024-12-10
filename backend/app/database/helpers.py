from uuid import UUID
from typing import Self
from sqlmodel import SQLModel
from datetime import datetime
from pydantic import RootModel, model_validator


class SessionToken(SQLModel):
    access_token: str


class Notification(SQLModel):
    id: UUID
    message: str
    date: datetime | None


class NotificationList(RootModel):
    root: list['Notification']


class PasswordChange(SQLModel):
    old_password: str
    new_password: str
    new_password_confirm: str

    @model_validator(mode='after')
    def check_password(self) -> Self:
        if self.new_password != self.new_password_confirm:
            raise ValueError('passwords do not match')
        return self
    
