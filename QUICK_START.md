# ⚡ Quick Start - 5 minutos

## 🏃‍♂️ Executar o Projeto

```bash
# 1. Clone e entre no diretório
git clone <repo-url>
cd "desafio tecnico plss"

# 2. Configure o banco
docker-compose -f docker-compose.dev.yml up -d

# 3. Backend (novo terminal)
cd backend
pip install -r requirements.txt
cp .env.example .env  # Configure se necessário
python reset_db.py
python run-dev.py

# 4. Frontend (novo terminal)
cd frontend
npm install
npm run dev
```

## 🌐 Acessar

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **Backend**: http://localhost:8000

## 🧪 Testar

1. **Importe no Postman**:
   - `postman_collection.json`
   - `postman_collection_api_football.json`

2. **Teste no Frontend**:
   - Registre um usuário
   - Navegue pelos times
   - Veja as estatísticas

## ✅ Checklist

- [ ] Docker rodando
- [ ] Backend na porta 8000
- [ ] Frontend na porta 3000
- [ ] Banco de dados conectado
- [ ] Postman collections importados
- [ ] Registro de usuário funcionando
- [ ] Lista de times carregando

## 🆘 Problemas?

```bash
# Reset do banco
cd backend && python reset_db.py

# Logs do Docker
docker-compose -f docker-compose.dev.yml logs
```
