from fastapi import APIRouter
from .tasks import router as task_router
from .auth import router as auth_router

router_v1 = APIRouter(prefix="/api/v1")

router_v1.include_router(task_router)
router_v1.include_router(auth_router)
