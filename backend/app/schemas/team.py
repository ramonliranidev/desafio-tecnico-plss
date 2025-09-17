from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime


class TeamBase(BaseModel):
    id: int
    name: str
    short_name: Optional[str] = None
    tla: Optional[str] = None
    crest: Optional[str] = None


class TeamResponse(TeamBase):
    external_id: int
    area: Optional[str] = None
    founded: Optional[int] = None
    club_colors: Optional[str] = None
    venue: Optional[str] = None
    website: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class TeamDetails(BaseModel):
    id: int
    name: str
    short_name: Optional[str] = None
    tla: Optional[str] = None
    crest: Optional[str] = None
    area: Optional[dict] = None
    founded: Optional[int] = None
    club_colors: Optional[str] = None
    venue: Optional[str] = None
    website: Optional[str] = None
    coach: Optional[dict] = None
    squad: Optional[List[dict]] = None


class Competition(BaseModel):
    id: int
    name: str
    code: Optional[str] = None
    type: Optional[str] = None
    emblem: Optional[str] = None


class HomeTeam(BaseModel):
    id: int
    name: str
    short_name: Optional[str] = Field(default=None, alias="shortName")
    tla: Optional[str] = None
    crest: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)


class AwayTeam(BaseModel):
    id: int
    name: str
    short_name: Optional[str] = Field(default=None, alias="shortName")
    tla: Optional[str] = None
    crest: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)


class Score(BaseModel):
    winner: Optional[str] = None
    duration: Optional[str] = None
    full_time: Optional[dict] = Field(default=None, alias="fullTime")
    half_time: Optional[dict] = Field(default=None, alias="halfTime")

    model_config = ConfigDict(populate_by_name=True)


class Match(BaseModel):
    id: int
    utc_date: str = Field(alias="utcDate")
    status: str
    matchday: Optional[int] = None
    stage: Optional[str] = None
    group: Optional[str] = None
    last_updated: str = Field(alias="lastUpdated")
    competition: Competition
    home_team: HomeTeam = Field(alias="homeTeam")
    away_team: AwayTeam = Field(alias="awayTeam")
    score: Score

    model_config = ConfigDict(populate_by_name=True)


class TeamsListResponse(BaseModel):
    count: int
    filters: dict
    competition: Competition
    teams: List[TeamBase]


class TeamMatchesResponse(BaseModel):
    count: int
    filters: dict
    matches: List[Match]
