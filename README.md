# 🏆 Sistema de Times de Futebol - Desafio Técnico PLSS

Sistema completo para visualização de times do Brasileirão com autenticação JWT, filtros avançados e dashboard de estatísticas.

## 🚀 Tecnologias Utilizadas

### Backend
- **FastAPI** - API moderna e performática
- **PostgreSQL** - Banco de dados robusto
- **SQLAlchemy** - ORM poderoso
- **JWT** - Autenticação segura
- **Football-data.org API** - Dados de times e partidas

### Frontend
- **Next.js 15** - Framework React moderno
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização eficiente
- **React Hook Form** - Gerenciamento de formulários
- **React Toastify** - Notificações visuais

## 📋 Funcionalidades

### ✅ Autenticação
- [x] Registro de usuários com time favorito
- [x] Login com JWT
- [x] Proteção de rotas
- [x] Logout seguro

### ⚽ Gestão de Times
- [x] Lista completa de times do Brasileirão
- [x] Filtro de busca por nome/sigla
- [x] Detalhes completos dos times
- [x] Visualização de partidas
- [x] Informações de técnicos e elenco

### 📊 Dashboard de Estatísticas
- [x] Time mais antigo e mais recente
- [x] Distribuição por década
- [x] Rankings de antiguidade
- [x] Contadores especiais (centenários)

## 🎯 Modos de Execução

### 1. 🏠 **Desenvolvimento Local** (Recomendado)

#### Pré-requisitos
- Python 3.10+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (via Docker)

#### Passo a passo

```bash
# 1. Clone o repositório
git clone <repo-url>
cd "desafio tecnico plss"

# 2. Configurar variáveis de ambiente
cp backend/.env.example backend/.env
# Edite as variáveis conforme necessário

# 3. Suba apenas o banco de dados
docker-compose -f docker-compose.dev.yml up -d

# 4. Configurar Backend (novo terminal)
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate     # Windows
pip install -r requirements.txt
python reset_db.py  # Criar tabelas
python run-dev.py   # Iniciar servidor

# 5. Configurar Frontend (novo terminal)
cd frontend
npm install
npm run dev
```

### 2. 🐳 **Docker Completo**

```bash
# Produção completa em containers
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🌐 URLs de Acesso

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:3000 | Interface do usuário |
| **Backend API** | http://localhost:8000 | API principal |
| **API Docs** | http://localhost:8000/docs | Documentação interativa |
| **ReDoc** | http://localhost:8000/redoc | Documentação alternativa |
| **PostgreSQL** | localhost:5433 | Banco de dados (dev) |

## ⚙️ Configuração

### Backend (.env)
```env
# Banco de dados
DATABASE_URL=postgresql://root:root@localhost:5433/mydatabase

# API Football Data
FOOTBALL_API_URL=https://api.football-data.org/v4
FOOTBALL_API_KEY=sua_api_key_aqui

# Configurações do servidor
DEBUG=True
HOST=0.0.0.0
PORT=8000

# JWT
SECRET_KEY=sua_api_secreta_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## 🛠️ Comandos Úteis

### Backend
```bash
# Reset completo do banco
cd backend && python reset_db.py
```

### Frontend
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

### Docker
```bash
# Logs do banco
docker-compose -f docker-compose.dev.yml logs postgresql

# Restart apenas do banco
docker-compose -f docker-compose.dev.yml restart postgresql

# Parar tudo
docker-compose -f docker-compose.dev.yml down

# Limpar volumes
docker-compose -f docker-compose.dev.yml down -v
```

## 📡 API Endpoints

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/users/signup` | Registrar usuário |
| `POST` | `/users/login` | Login |
| `GET` | `/users/me` | Perfil do usuário |

### Times
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/teams/brasileirao` | Lista times do Brasileirão |
| `GET` | `/teams/{id}` | Detalhes de um time |
| `GET` | `/teams/{id}/matches` | Partidas de um time |

### Sistema
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/indicadores` | Estatísticas dos times |
| `POST` | `/importar` | Importar dados frescos |
| `GET` | `/status` | Status da API |

## 🧪 Testes com Postman

1. **Importe as collections:**
   - `postman_collection.json` - API principal
   - `postman_collection_api_football.json` - API football-data.org

2. **Configure as variáveis:**
   - `base_url`: http://localhost:8000
   - `football_api_key`: Sua chave da football-data.org (chave de teste localizado .env do backend)

3. **Fluxo de teste:**
   1. Registrar usuário
   2. Fazer login (token salvo automaticamente)
   3. Testar endpoints protegidos
   4. Explorar dados de times

## 🔧 Solução de Problemas

### Erro de banco de dados
```bash
# Reset completo
cd backend
python reset_db.py
```

### Problemas de CORS
- Verifique se o frontend está rodando na porta correta
- Confirme as URLs no CORS do backend

## 📊 Estrutura do Projeto

```
desafio tecnico plss/
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── core/           # Configurações
│   │   ├── models/         # Modelos SQLAlchemy
│   │   ├── routers/        # Endpoints
│   │   ├── schemas/        # Schemas Pydantic
│   │   ├── services/       # Lógica de negócio
│   │   └── repositories/   # Acesso a dados
│   ├── requirements.txt
│   └── run-dev.py
├── frontend/               # Interface Next.js
│   ├── src/
│   │   ├── app/           # App Router
│   │   ├── components/    # Componentes React
│   │   ├── contexts/      # Context API
│   │   └── lib/          # Utilitários
│   ├── package.json
│   └── next.config.js
├── postman_collection.json      # Tests API principal
├── postman_collection_api_football.json # Tests API externa
└── docker-compose.*.yml         # Configurações Docker
```

## 📝 Licença

Este projeto está sob a licença MIT ou seja autorizado para alterações.

---


**Desenvolvido para o Desafio Técnico PLSS** 🚀
