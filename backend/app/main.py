from app.core.database import Base, engine
from app.routers import user, team, sistema
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Cria tabelas no banco
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Teste Técnico PLSS")

# Configuração CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Frontend local
        "http://127.0.0.1:3000",  # Frontend local alternativo
        "http://frontend:3000",   # Frontend no Docker
        "*"  # Para desenvolvimento
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos os métodos
    allow_headers=["*"],  # Permitir todos os headers
)

@app.get("/status")
def root():
    return {"message": "API online"}

app.include_router(user.router)
app.include_router(team.router)
app.include_router(sistema.router)

