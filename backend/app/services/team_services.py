from typing import Dict, Any
from sqlalchemy.orm import Session
from app.repositories.team import TeamRepository
from app.schemas.team import TeamsListResponse, TeamDetails, TeamBase, Competition
from fastapi import HTTPException, status
from datetime import datetime


class TeamService:
    def __init__(self):
        self.team_repository = TeamRepository()

    def get_brasileirao_teams(self, db: Session, force_refresh: bool = False) -> TeamsListResponse:
        """
        Busca times do Brasileirão Série A.
        Usa cache (banco local) por padrão, ou busca da API se force_refresh=True
        """
        try:
            # Se force_refresh=False, tenta buscar do cache primeiro
            if not force_refresh:
                local_teams = self.team_repository.get_all_local(db)
                
                if local_teams and len(local_teams) > 0:
                    # Retorna dados do cache
                    return self._format_local_teams_response(local_teams)
            
            # Se não há dados no cache OU force_refresh=True, busca da API
            api_data = self.team_repository.get_competition_teams("BSA")
            
            # Salva dados no banco local (cache)
            for team_data in api_data.get("teams", []):
                self.team_repository.create_or_update(db, team_data)
            
            return TeamsListResponse(**api_data)
            
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error fetching teams: {str(e)}"
            )

    def _format_local_teams_response(self, local_teams) -> TeamsListResponse:
        """
        Converte dados do banco local para o formato TeamsListResponse
        """
        teams_data = []
        for team in local_teams:
            teams_data.append(TeamBase(
                id=team.external_id,
                name=team.name,
                short_name=team.short_name,
                tla=team.tla,
                crest=team.crest
            ))
        
        # Cria response simulando estrutura da API
        return TeamsListResponse(
            count=len(teams_data),
            filters={"season": "2025"},  # Mock data
            competition=Competition(
                id=2013,
                name="Campeonato Brasileiro Série A", 
                code="BSA",
                type="LEAGUE",
                emblem="https://crests.football-data.org/bsa.png"
            ),
            teams=teams_data
        )

    def import_fresh_data(self, db: Session) -> Dict[str, Any]:
        """
        Força importação de dados frescos da API (usado pelo endpoint /importar)
        """
        try:
            
            # Busca dados da API externa
            data = self.team_repository.get_competition_teams("BSA")
            
            # Conta novos vs atualizados
            teams_importados = 0
            teams_atualizados = 0
            
            for team_data in data.get("teams", []):
                existing_team = self.team_repository.get_by_external_id(db, team_data["id"])
                
                if existing_team:
                    self.team_repository.create_or_update(db, team_data)
                    teams_atualizados += 1
                else:
                    self.team_repository.create_or_update(db, team_data)
                    teams_importados += 1
            
            return {
                "message": "Dados importados com sucesso",
                "fonte": "football-data.org API",
                "competition": data.get("competition", {}).get("name", "Brasileirão Série A"),
                "teams_novos": teams_importados,
                "teams_atualizados": teams_atualizados,
                "total_processados": teams_importados + teams_atualizados,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error importing fresh data: {str(e)}"
            )

    def get_team_details(self, team_id: int, db: Session) -> TeamDetails:
        """
        Busca detalhes de um time específico
        """
        try:
            data = self.team_repository.get_team_details(team_id)
            return TeamDetails(**data)
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error fetching team details: {str(e)}"
            )

    def get_team_matches(self, team_id: int) -> Dict[Any, Any]:
        """
        Busca partidas de um time específico
        """
        try:
            data = self.team_repository.get_team_matches(team_id)
            return data
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error fetching team matches: {str(e)}"
            )