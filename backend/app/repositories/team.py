import requests
from typing import List, Dict, Any
from app.core.config import settings
from sqlalchemy.orm import Session
from app.models.team import Team
from fastapi import HTTPException, status


class TeamRepository:
    def __init__(self):
        self.base_url = settings.FOOTBALL_API_BASE_URL
        self.headers = {
            "X-Auth-Token": settings.FOOTBALL_API_SECRET_KEY,
            "Content-Type": "application/json"
        }

    def _make_request(self, endpoint: str) -> Dict[Any, Any]:
        """Faz requisição para a API externa"""
        try:
            url = f"{self.base_url}{endpoint}"
            response = requests.get(url, headers=self.headers)
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 404:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Resource not found"
                )
            elif response.status_code == 403:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access forbidden - check API key"
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"External API error: {response.status_code}"
                )
        except requests.exceptions.RequestException as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"External API unavailable: {str(e)}"
            )

    def get_competition_teams(self, competition_code: str = "BSA") -> Dict[Any, Any]:
        """Busca times de uma competição específica"""
        endpoint = f"/v4/competitions/{competition_code}/teams"
        return self._make_request(endpoint)

    def get_team_details(self, team_id: int) -> Dict[Any, Any]:
        """Busca detalhes de um time específico"""
        endpoint = f"/v4/teams/{team_id}"
        return self._make_request(endpoint)

    def get_team_matches(self, team_id: int) -> Dict[Any, Any]:
        """Busca partidas de um time específico"""
        endpoint = f"/v4/teams/{team_id}/matches"
        return self._make_request(endpoint)

    # Métodos para banco de dados local (cache)
    @staticmethod
    def get_by_external_id(db: Session, external_id: int):
        """Busca time no banco local pelo ID externo"""
        return db.query(Team).filter(Team.external_id == external_id).first()

    @staticmethod
    def get_all_local(db: Session) -> List[Team]:
        """Busca todos os times no banco local"""
        return db.query(Team).all()

    @staticmethod
    def create_or_update(db: Session, team_data: Dict[Any, Any]) -> Team:
        """Cria ou atualiza um time no banco local"""
        existing_team = TeamRepository.get_by_external_id(db, team_data["id"])
        
        if existing_team:
            # Atualiza team existente
            existing_team.name = team_data.get("name", existing_team.name)
            existing_team.short_name = team_data.get("shortName")
            existing_team.tla = team_data.get("tla")
            existing_team.crest = team_data.get("crest")
            existing_team.area = team_data.get("area", {}).get("name") if isinstance(team_data.get("area"), dict) else team_data.get("area")
            existing_team.founded = team_data.get("founded")
            existing_team.club_colors = team_data.get("clubColors")
            existing_team.venue = team_data.get("venue")
            existing_team.website = team_data.get("website")
            db.commit()
            db.refresh(existing_team)
            return existing_team
        else:
            # Cria novo team
            area_value = None
            if team_data.get("area"):
                if isinstance(team_data.get("area"), dict):
                    area_value = team_data["area"].get("name")
                else:
                    area_value = team_data.get("area")
            
            db_team = Team(
                external_id=team_data["id"],
                name=team_data["name"],
                short_name=team_data.get("shortName"),
                tla=team_data.get("tla"),
                crest=team_data.get("crest"),
                area=area_value,
                founded=team_data.get("founded"),
                club_colors=team_data.get("clubColors"),
                venue=team_data.get("venue"),
                website=team_data.get("website")
            )
            db.add(db_team)
            db.commit()
            db.refresh(db_team)
            return db_team
