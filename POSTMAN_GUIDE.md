# Guia dos Collections Postman

## Como Importar

1. **Abra o Postman**
2. **Clique em "Import"**
3. **Selecione os arquivos:**
   - `postman_collection.json` - API principal
   - `postman_collection_api_football.json` - API externa

## Configuração

### Collection API Principal
- **base_url**: `http://localhost:8000`
- **access_token**: (preenchido automaticamente após login)

### Collection Football API
- **api_url**: `https://api.football-data.org/v4`
- **api_key**: Sua chave da football-data.org

## Fluxo de Teste

### 1. API Principal
1. **Registrar Usuário** → Cria conta com time favorito
2. **Login** → Token salvo automaticamente
3. **Meu Perfil** → Testa autenticação
4. **Listar Times** → Busca times do Brasileirão
5. **Indicadores** → Estatísticas dos times

### 2. API Externa
1. **Configure sua chave** na variável `api_key`
2. **Teste "Brasileirão - Times"** → Lista times
3. **Teste "Time Específico"** → Detalhes do Palmeiras
4. **Teste "Partidas"** → Partidas do time

## Funcionalidades dos Collections

### Collection Principal
- **Autenticação automática**: Token salvo após login
- **Headers automáticos**: Authorization preenchido
- **Validação de respostas**: Scripts de teste incluídos
- **Logs detalhados**: Console com informações úteis

### Collection Football API
- **Rate limit monitor**: Mostra requisições restantes
- **Validação de chave**: Alerta se não configurada
- **Exemplos práticos**: Times brasileiros populares
- **Filtros úteis**: Status de partidas, limites, etc.

## Endpoints Importantes

### API Principal
- `POST /users/signup` - Registro
- `POST /users/login` - Login
- `GET /users/me` - Perfil
- `GET /teams/brasileirao` - Times
- `GET /indicadores` - Estatísticas

### API Externa
- `GET /competitions/BSA/teams` - Times do Brasileirão
- `GET /teams/{id}` - Detalhes do time
- `GET /teams/{id}/matches` - Partidas
- `GET /competitions/BSA/standings` - Classificação
