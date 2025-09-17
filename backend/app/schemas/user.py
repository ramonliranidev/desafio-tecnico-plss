from pydantic import BaseModel, ConfigDict, EmailStr
from typing import List


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    team_favorite: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    team_favorite: str

    model_config = ConfigDict(from_attributes=True)

class UserDeleteResponse(BaseModel):
    message: str

class UserListResponse(BaseModel):
    users: List[UserResponse]