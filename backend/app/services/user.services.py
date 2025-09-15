from app.core import security
from app.repositories.user import UserRepository
from app.user.schemas.user import UserCreate, UserLogin
from fastapi import HTTPException, status
from sqlalchemy.orm import Session


class UserService:
    @staticmethod
    def register_user(user: UserCreate, db: Session):
        if UserRepository.get_by_username(db, user.username):
            raise HTTPException(status_code=400, detail="Username already exists")

        if UserRepository.get_by_email(db, user.email):
            raise HTTPException(status_code=400, detail="Email already exists")

        hashed_password = security.get_password_hash(user.password)
        return UserRepository.create(db, user.username, user.email, hashed_password)

    @staticmethod
    def authenticate_user(user: UserLogin, db: Session):
        db_user = UserRepository.get_by_username(db, user.username)
        if not db_user or not security.verify_password(user.password, db_user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        token = security.create_access_token(data={"sub": db_user.username})
        return {"access_token": token, "token_type": "bearer"}
