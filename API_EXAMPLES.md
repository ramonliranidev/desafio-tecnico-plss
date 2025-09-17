# Exemplos de Respostas da API

## Autenticação

### POST /users/signup
```json
{
  "username": "teste123",
  "email": "teste@email.com", 
  "password": "minhasenha123",
  "team_favorite": "Palmeiras"
}
```

**Resposta:**
```json
{
  "id": 1,
  "username": "teste123",
  "email": "teste@email.com",
  "team_favorite": "Palmeiras"
}
```

### POST /users/login
```json
{
  "username": "teste123",
  "password": "minhasenha123"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

## Times

### GET /teams/brasileirao
```json
{
  "count": 20,
  "competition": {
    "id": 2013,
    "name": "Campeonato Brasileiro Série A",
    "code": "BSA"
  },
  "teams": [
    {
      "id": 1776,
      "name": "CR Flamengo",
      "short_name": "Flamengo",
      "tla": "FLA",
      "crest": "https://crests.football-data.org/1776.png",
      "founded": 1895
    }
  ]
}
```

### GET /teams/1776
```json
{
  "id": 1769,
  "name": "SE Palmeiras",
  "short_name": "Palmeiras",
  "tla": "PAL",
  "crest": "https://crests.football-data.org/1769.png",
  "founded": 1914,
  "area": {
    "name": "Brazil",
    "code": "BRA",
    "flag": "https://crests.football-data.org/764.svg"
  },
  "venue": "Allianz Parque",
  "website": "http://www.palmeiras.com.br",
  "coach": {
    "id": 45403,
    "name": "Abel Ferreira",
    "nationality": "Portugal"
  },
  "squad": [
    {
      "id": 1686,
      "name": "Raphael Veiga",
      "position": "Midfield",
      "nationality": "Brazil"
    }
  ]
}
```

## Estatísticas

### GET /indicadores
```json
{
  "estatisticas_historicas": {
    "time_mais_antigo": {
      "nome": "CR Vasco da Gama",
      "tla": "VAS",
      "fundacao": 1898
    },
    "time_mais_recente": {
      "nome": "EC Bahia", 
      "tla": "BAH",
      "fundacao": 1931
    },
    "media_ano_fundacao": 1913.2,
    "periodo_fundacao": "1898-1931"
  },
  "distribuicao_temporal": {
    "por_decada": [
      {
        "decada": "1890s",
        "quantidade": 2,
        "percentual": 10
      },
      {
        "decada": "1900s", 
        "quantidade": 6,
        "percentual": 30
      }
    ],
    "times_centenarios": 16,
    "times_modernos": 0
  },
  "rankings": {
    "times_mais_antigos": [
      {
        "nome": "CR Vasco da Gama",
        "tla": "VAS",
        "fundacao": 1898
      }
    ],
    "times_mais_novos": [
      {
        "nome": "EC Bahia",
        "tla": "BAH", 
        "fundacao": 1931
      }
    ]
  }
}
```

## Partidas

### GET /teams/1776/matches
```json
{
  "count": 48,
  "matches": [
    {
      "id": 534937,
      "utcDate": "2025-03-30T19:00:00Z",
      "status": "FINISHED",
      "matchday": 1,
      "competition": {
        "id": 2013,
        "name": "Campeonato Brasileiro Série A"
      },
      "homeTeam": {
        "id": 1769,
        "name": "SE Palmeiras"
      },
      "awayTeam": {
        "id": 1770,
        "name": "Botafogo FR"
      },
      "score": {
        "winner": "DRAW",
        "fullTime": {
          "home": 0,
          "away": 0
        }
      }
    }
  ]
}
```

## Erros Comuns

### 401 - Token inválido
```json
{
  "detail": "Could not validate credentials"
}
```

### 404 - Recurso não encontrado
```json
{
  "detail": "Team not found"
}
```

### 422 - Dados inválidos
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```
