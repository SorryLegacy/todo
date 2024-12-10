from uuid import UUID
from enum import Enum
from typing import Optional
from datetime import datetime, timedelta
from sqlmodel import SQLModel, Field
from .base import BaseModel
from pydantic import ConfigDict


class Priority(Enum):
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'


class Status(Enum):
    NEW = 'new'
    IN_PROGRESS = 'in_progress'
    COMPLETED = 'completed'


class BaseTask(SQLModel):
    deadline: Optional[datetime] = None
    title: str
    description: Optional[str] = None
    priority: Priority

class Task(BaseTask, BaseModel, table=True):
    status: Status
    user_id: UUID = Field(foreign_key='users_users.id')
    last_notification: Optional[datetime] = None


class CreateTask(BaseTask):
    status: Status = Field(default=Status.NEW, nullable=True)
    model_config = ConfigDict(extra='allow')


class PatchTask(SQLModel):
    description: Optional[str] = None
    title: Optional[str] = None
    deadline: Optional[datetime] = None
    priority: Optional[Priority] = None
    status: Optional[Status] = None


from itertools import cycle