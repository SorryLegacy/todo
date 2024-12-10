from dataclasses import dataclass
from typing import Optional
from datetime import datetime, timedelta
from fastapi import HTTPException
from .base import BaseCRUDService
from database import CreateTask, Task, PatchTask, Status, User, Notification, NotificationList
from sqlalchemy import select, delete, or_, update


@dataclass(kw_only=True)
class TaskService(BaseCRUDService):
    current_user: 'User' 

    async def create(self, new_task: CreateTask) -> 'Task':
        query =  select(Task).where(Task.title == new_task.title, Task.user_id == self.current_user.id, Task.status.in_((Status.IN_PROGRESS, Status.NEW)))
        result = await self.scalar_or_none(query)

        if result:
            raise HTTPException(400, detail="Task exists")

        new_task.user_id = self.current_user.id
        task = Task(**new_task.model_dump())
        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)
        return task
    
    async def patch_update(self, task_id: str, patch_task: PatchTask) -> 'Task':
        query = select(Task).where(Task.id == task_id, Task.user_id == self.current_user.id).with_for_update()
        task: Task = await self.scalar_or_none(query)

        if not task:
            raise HTTPException(404, detail=f"Task with {task_id} Id does not exists")
        
        for field, value in patch_task.model_dump(exclude_unset=True).items():
            setattr(task, field, value)

        await self.session.commit()
        return task

    async def get_upcoming_deadlines_for_user(self, hours: int = 2) ->NotificationList:
        now = datetime.now()
        deadline_threshold = now + timedelta(hours=hours)
        query = select(Task).where(
                Task.deadline.isnot(None),
                Task.deadline <= deadline_threshold,
                Task.status != Status.COMPLETED,
                Task.user_id == self.current_user.id,
                (Task.last_notification.is_(None))
        )
        result = await self.session.execute(query)
        tasks = result.scalars()
        return NotificationList(root=[Notification(id=i.id, message=f"Dedeline soon for task {i.title}", date=i.last_notification) for i in tasks])


    async def list_all(self, search: Optional[str] = None) -> list[Task]:
        query = select(Task).where(Task.user_id == self.current_user.id)

        if search:
            search_term = f"%{search}%"
            query = query.where(or_(Task.title.ilike(search_term), Task.description.ilike(search_term)))
    
        result = await self.session.execute(query)
        await self.session.commit()
        return result.scalars()
    
    async def delete_taks(self, task_id: str) -> None:
        query = delete(Task).where(Task.id == task_id, Task.user_id == self.current_user.id)
        await self.session.execute(query)
        await self.session.commit()

    async def mark_as_read(self, task_id: str) -> None:
        query = update(Task).where(Task.id == task_id).values(last_notification=datetime.now())
        await self.session.execute(query)
        await self.session.commit()
