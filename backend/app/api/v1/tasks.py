from typing import Annotated, Optional
from fastapi import APIRouter, Depends, Query
from database import Task, PatchTask, CreateTask, Notification, NotificationList
from services.task import TaskService
from depends import get_task_service
from uuid import UUID

router = APIRouter(tags=['task',])

taskService = Annotated['TaskService', Depends(get_task_service)]


@router.get('/tasks', response_model=list[Task])
async def get_task(task_service: taskService, search: Optional[str] = Query(None)):
    return await task_service.list_all(search)


@router.post('/tasks', response_model=Task)
async def create_task(new_task: CreateTask, task_service: taskService):
    task = await task_service.create(new_task)
    return task 


@router.patch('/tasks/{task_id}', response_model=Task)
async def update_taks(task_id: str, data: PatchTask, task_service: taskService):
    task = await task_service.patch_update(task_id=task_id, patch_task=data)
    return task

@router.delete('/tasks/{task_id}')
async def delete_task(task_id: UUID, task_service: taskService):
    print('HERE')
    await task_service.delete_taks(task_id)
    return {"status": "Ok"}


@router.get('/tasks/notifications', response_model=NotificationList)
async def get_notifications(task_service: taskService):
    return await task_service.get_upcoming_deadlines_for_user()
