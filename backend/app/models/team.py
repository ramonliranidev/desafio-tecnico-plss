from app.core.database import Base
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(Integer, unique=True, index=True, nullable=False)  # ID da API externa
    name = Column(String, nullable=False) # Nome do time
    short_name = Column(String, nullable=True) # Nome curto do time
    tla = Column(String, nullable=True)  # 3 Letras do time
    crest = Column(String, nullable=True)  # URL do escudo
    area = Column(String, nullable=True)  # País/Região
    founded = Column(Integer, nullable=True)  # Ano de fundação
    club_colors = Column(String, nullable=True) # Cores do time
    venue = Column(String, nullable=True)  # Estádio
    website = Column(String, nullable=True) # Site do time
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
