from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.services.team_services import TeamService
from app.schemas.team import TeamsListResponse, TeamDetails, TeamResponse

router = APIRouter(prefix="/teams", tags=["teams"])

@router.get("/brasileirao", response_model=TeamsListResponse)
def get_brasileirao_teams(db: Session = Depends(get_db)):
    """
    Busca todos os times do Brasileirão Série A
    """
    team_service = TeamService()
    return team_service.get_brasileirao_teams(db, force_refresh=True)

@router.get("/{team_id}", response_model=TeamDetails)
def get_team_details(team_id: int, db: Session = Depends(get_db)):
    """
    Busca detalhes de um time específico pelo ID
    """
    team_service = TeamService()
    return team_service.get_team_details(team_id, db)


@router.get("/{team_id}/matches")
def get_team_matches(team_id: int):
    """
    Busca as partidas de um time específico
    """
    team_service = TeamService()
    return team_service.get_team_matches(team_id)
