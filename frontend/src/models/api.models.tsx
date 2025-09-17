// Tipos para as requisições
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  team_favorite: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  team_favorite: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// Tipos para Teams
export interface Team {
  id: number;
  name: string;
  short_name?: string;
  tla?: string;
  crest?: string;
  founded?: number;
}

export interface TeamDetails {
  id: number;
  name: string;
  short_name?: string;
  tla?: string;
  crest?: string;
  area?: {
    name: string;
    code: string;
    flag?: string;
  };
  founded?: number;
  club_colors?: string;
  venue?: string;
  website?: string;
  coach?: {
    id: number;
    firstName: string;
    lastName: string;
    name: string;
    dateOfBirth?: string;
    nationality?: string;
  };
  squad?: Array<{
    id: number;
    name: string;
    position: string;
    dateOfBirth?: string;
    nationality?: string;
  }>;
}

export interface Match {
  id: number;
  utcDate: string;
  status: string;
  matchday?: number;
  stage?: string;
  group?: string;
  lastUpdated: string;
  competition: {
    id: number;
    name: string;
    code?: string;
    type?: string;
    emblem?: string;
  };
  homeTeam: Team;
  awayTeam: Team;
  score: {
    winner?: string;
    duration?: string;
    fullTime?: {
      home?: number;
      away?: number;
    };
    halfTime?: {
      home?: number;
      away?: number;
    };
  };
}

export interface TeamsListResponse {
  count: number;
  filters: any;
  competition: {
    id: number;
    name: string;
    code?: string;
    type?: string;
    emblem?: string;
  };
  teams: Team[];
}

export interface TeamMatchesResponse {
  count: number;
  filters: any;
  matches: Match[];
}

// Tipos para Indicadores/Estatísticas
export interface TeamStats {
  nome: string;
  tla: string;
  fundacao: number;
}

export interface DecadeDistribution {
  decada: string;
  quantidade: number;
  percentual: number;
}

export interface IndicadoresResponse {
  estatisticas_historicas: {
    time_mais_antigo: {
      nome: string;
      tla: string;
      fundacao: number;
    };
    time_mais_recente: {
      nome: string;
      tla: string;
      fundacao: number;
    };
    media_ano_fundacao: number;
    periodo_fundacao: string;
  };
  distribuicao_temporal: {
    por_decada: DecadeDistribution[];
    times_centenarios: number;
    times_modernos: number;
  };
  rankings: {
    times_mais_antigos: TeamStats[];
    times_mais_novos: TeamStats[];
  };
}
