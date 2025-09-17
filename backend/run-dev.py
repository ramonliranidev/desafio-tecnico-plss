#!/usr/bin/env python3
"""
Script para executar o backend em modo de desenvolvimento
"""
import os
import sys
import subprocess
from pathlib import Path

def main():
    # Garantir que estamos no diretório correto
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    # Verificar se o arquivo .env existe
    if not os.path.exists('.env'):
        if os.path.exists('.env.example'):
            subprocess.run(['cp', '.env.example', '.env'], check=True)
        else:
            print("Arquivo .env não encontrado!")
            return 1
    
    # Verificar se as dependências estão instaladas
    try:
        import uvicorn
        import fastapi
    except ImportError:

        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
    
    # Executar o servidor
    print("Iniciando servidor de desenvolvimento...")
    print("URL: http://localhost:8000/status")
    print("Docs: http://localhost:8000/docs")
    
    try:
        subprocess.run([
            sys.executable, '-m', 'uvicorn', 
            'app.main:app',
            '--host', '0.0.0.0',
            '--port', '8000',
            '--reload'
        ], check=True)
    except KeyboardInterrupt:
        return 0
    except Exception as e:
        return 1

if __name__ == "__main__":
    sys.exit(main())
