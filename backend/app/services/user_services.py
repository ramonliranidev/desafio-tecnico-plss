from app.core import security
from app.repositories.user import UserRepository
from app.schemas.user import UserCreate, UserLogin
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
        return UserRepository.create(db, user.username, user.email, user.team_favorite, hashed_password)

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

    #Casos de uso excluiso no postman
    @staticmethod
    def get_all_users(db: Session):
        return UserRepository.get_all(db)

    @staticmethod
    def delete_user(user_id: int, db: Session):
        # Verifica se o usuário existe
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Deleta o usuário
        success = UserRepository.delete(db, user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete user"
            )
        
        return {"message": "User deleted successfully"}