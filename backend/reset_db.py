#!/usr/bin/env python3
"""
Script para resetar o banco de dados (para testes ou desenvolvimento).
"""
from app.core.database import engine, Base
# IMPORTANTE: Importar todos os modelos para registrar no metadata
from app.models.user import User
from app.models.team import Team

def reset_database():
    print("Deletando todas as tabelas...")
    Base.metadata.drop_all(bind=engine)
    
    print("Criando tabelas novamente...")
    Base.metadata.create_all(bind=engine)
    
    print("Banco resetado com sucesso!")

if __name__ == "__main__":
    reset_database()
