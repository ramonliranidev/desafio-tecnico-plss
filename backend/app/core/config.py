import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://root:root@localhost:5432/mydatabase")
    
    # Football API
    FOOTBALL_API_BASE_URL: str = os.getenv("FOOTBALL_API_BASE_URL", "https://api.football-data.org")
    FOOTBALL_API_SECRET_KEY: str = os.getenv("FOOTBALL_API_SECRET_KEY", "4583c37ddd3340afb58192dc0e31451c")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "blablablablatestestesecretkey")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

settings = Settings()
