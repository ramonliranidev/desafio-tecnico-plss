# --- Stage 1: Builder ---
# Uma imagem temporária para construir o ambiente com todas as dependências.
FROM python:3.12-slim as builder

# Define o diretório de trabalho
WORKDIR /app

# Atualiza os pacotes do sistema operacional e instala o essencial para compilação,
RUN apt-get update && apt-get install -y --no-install-recommends build-essential

# Copia o arquivo de dependências para o diretório de trabalho
COPY requirements.txt .

# Instala as dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# --- Stage 2: Final Image ---
# Uma imagem mais leve para a aplicação final.
FROM python:3.12-slim

# Define o diretório de trabalho
WORKDIR /app

# Copia as dependências instaladas do estágio 'builder' para a imagem final.
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /app/requirements.txt .

# Copia o código da sua aplicação para o diretório de trabalho na imagem final.
COPY ./app ./app

# Expõe a porta que a aplicação vai rodar.
EXPOSE 8000

# Comando para iniciar a aplicação.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
