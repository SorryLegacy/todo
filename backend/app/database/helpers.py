from uuid import UUID
from sqlmodel import SQLModel
from datetime import datetime
from pydantic import RootModel


class SessionToken(SQLModel):
    access_token: str


class Notification(SQLModel):
    id: UUID
    message: str
    date: datetime | None


class NotificationList(RootModel):
    root: list['Notification']
