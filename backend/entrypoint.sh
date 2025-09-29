#!/bin/sh

echo "⏳ Aguardando o banco de dados iniciar..."

until nc -z db 5432; do
  sleep 1
done

echo "✅ Banco disponível, iniciando FastAPI..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
