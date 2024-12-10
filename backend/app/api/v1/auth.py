from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from services.auth import AuthService
from depends import get_auth_service, get_current_user
from database import UserCreate, User, SessionToken, PasswordChange

router = APIRouter(tags=['auth',])


@router.post("/login", response_model=SessionToken)
async def login(login_data: OAuth2PasswordRequestForm = Depends(), auth_service: AuthService = Depends(get_auth_service)):
    access_token = await auth_service.login_user(login_data)
    return access_token


@router.post('/sign-up', response_model=SessionToken)
async def sign_up(new_user: UserCreate, auth_service: AuthService = Depends(get_auth_service)):
    access_token = await auth_service.sing_up_user(new_user)
    return access_token


@router.get('/me', response_model=User)
async def me(user: User = Depends(get_current_user)):
    return user


@router.post('/me')
async def update_password(data: PasswordChange, user: User = Depends(get_current_user), auth_service: AuthService = Depends(get_auth_service)):
    response = await auth_service.change_password(data, user)
    return response