from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, UserDeleteResponse
from app.schemas.auth import Token
from app.services.user_services import UserService
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    return UserService.register_user(user, db)

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    return UserService.authenticate_user(user, db)

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
  
@router.get("/all", response_model=List[UserResponse])
def read_users(db: Session = Depends(get_db)):
    return UserService.get_all_users(db)

@router.delete("/{user_id}", response_model=UserDeleteResponse, status_code=status.HTTP_200_OK)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    return UserService.delete_user(user_id, db)