from sqlalchemy import func
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.team_services import TeamService
from app.models.team import Team
from datetime import datetime

router = APIRouter(tags=["sistema"])

@router.post("/importar")
def importar_dados(db: Session = Depends(get_db)):
    """
    Força importação de dados frescos da football-data.org para o banco local.
    Use este endpoint para atualizar o cache com dados mais recentes.
    """
    try:
        team_service = TeamService()
        result = team_service.import_fresh_data(db)
        return result
        
    except Exception as e:
        return {
            "error": "Erro ao importar dados",
            "detail": str(e),
            "timestamp": datetime.now().isoformat()
        }

@router.get("/indicadores")
def obter_indicadores(db: Session = Depends(get_db)):
    """
    Retorna indicadores e estatísticas dos times do Brasileirão
    baseado nos dados importados da football-data.org
    """
    try:
        # Estatísticas básicas
        total_teams = db.query(Team).count()
        
        if total_teams == 0:
            return {
                "message": "Nenhum dado encontrado. Execute POST /importar primeiro.",
                "total_teams": 0,
                "timestamp": datetime.now().isoformat()
            }
        
        # Agregações de fundação
        teams_with_founded = db.query(Team).filter(Team.founded.isnot(None)).count()
        
        if teams_with_founded > 0:
            oldest_team_year = db.query(func.min(Team.founded)).filter(Team.founded.isnot(None)).scalar()
            newest_team_year = db.query(func.max(Team.founded)).filter(Team.founded.isnot(None)).scalar()
            avg_foundation_year = db.query(func.avg(Team.founded)).filter(Team.founded.isnot(None)).scalar()
            
            # Time mais antigo e mais novo (com nomes)
            oldest_team = db.query(Team).filter(Team.founded == oldest_team_year).first()
            newest_team = db.query(Team).filter(Team.founded == newest_team_year).first()
        else:
            oldest_team_year = newest_team_year = avg_foundation_year = None
            oldest_team = newest_team = None
        
        # Distribuição por década de fundação
        if teams_with_founded > 0:
            decades_query = db.query(
                func.floor(Team.founded / 10) * 10,
                func.count(Team.id)
            ).filter(Team.founded.isnot(None)).group_by(
                func.floor(Team.founded / 10) * 10
            ).all()
            
            decades_distribution = [
                {
                    "decada": f"{int(decade)}s",
                    "quantidade": count,
                    "percentual": round((count / teams_with_founded) * 100, 1)
                }
                for decade, count in decades_query
            ]
        else:
            decades_distribution = []
                                
        # Top 5 times mais antigos
        oldest_teams = db.query(Team).filter(
            Team.founded.isnot(None)
        ).order_by(Team.founded.asc()).limit(5).all()
        
        oldest_teams_list = [
            {
                "nome": team.name,
                "tla": team.tla,
                "fundacao": team.founded,
            }
            for team in oldest_teams
        ]
        
        # Top 5 times mais novos  
        newest_teams = db.query(Team).filter(
            Team.founded.isnot(None)
        ).order_by(Team.founded.desc()).limit(5).all()
        
        newest_teams_list = [
            {
                "nome": team.name,
                "tla": team.tla,
                "fundacao": team.founded,
            }
            for team in newest_teams
        ]
        
        return {
            "estatisticas_historicas": {
                "time_mais_antigo": {
                    "nome": oldest_team.name if oldest_team else None,
                    "tla": oldest_team.tla if oldest_team else None,
                    "ano_fundacao": oldest_team_year,
                } if oldest_team else None,
                
                "time_mais_recente": {
                    "nome": newest_team.name if newest_team else None,
                    "tla": newest_team.tla if newest_team else None,
                    "ano_fundacao": newest_team_year,
                } if newest_team else None,
                
                "media_ano_fundacao": round(avg_foundation_year, 1) if avg_foundation_year else None,
                "periodo_fundacao": f"{oldest_team_year}-{newest_team_year}" if oldest_team_year and newest_team_year else None,
            },
            
            "distribuicao_temporal": {
                "por_decada": decades_distribution,
                "times_centenarios": db.query(Team).filter(Team.founded <= 1924).count(),
                "times_modernos": db.query(Team).filter(Team.founded >= 1990).count()
            },            
            "rankings": {
                "times_mais_antigos": oldest_teams_list,
                "times_mais_novos": newest_teams_list
            },
        }
        
    except Exception as e:
        return {
            "error": "Erro ao calcular indicadores",
            "detail": str(e),
            "timestamp": datetime.now().isoformat()
        }