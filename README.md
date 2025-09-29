# 🌱 Brain Agriculture

Aplicação **fullstack** para gerenciamento de produtores rurais, fazendas e culturas agrícolas.  
Desenvolvida como desafio técnico para **Engenharia de Dados / Software**.

---

## 🚀 Tecnologias

### Backend
- [FastAPI](https://fastapi.tiangolo.com/) (API REST)
- [SQLAlchemy](https://www.sqlalchemy.org/) (ORM)
- [Alembic](https://alembic.sqlalchemy.org/) (migrações de banco)
- [PostgreSQL](https://www.postgresql.org/) (banco relacional)
- [Pytest](https://docs.pytest.org/) + `pytest-cov` (testes e cobertura)

### Frontend
- [React](https://react.dev/) + [Vite](https://vitejs.dev/) (SPA moderna)
- [TypeScript](https://www.typescriptlang.org/)
- Estado global com **Redux Toolkit**

### Infra
- [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/)
- Deploy no **Heroku**
- CI/CD com **GitHub Actions**

---

## ▶️ Como rodar localmente

### 1. Subir containers
```bash
docker-compose down -v
docker-compose up --build



## Rodar testes no container

docker exec -it brain-backend pytest app/tests -v
docker exec -it brain-backend pytest --cov=app --cov-report=term-missing

## Banco de dados manual (opcional)

docker exec -it brain-db psql -U postgres -d brain_agriculture

\dt                      -- listar tabelas
SELECT * FROM producers;
SELECT * FROM farms;
SELECT * FROM crops;


Rodar testes localmente (sem Docker)

cd backend
$env:PYTHONPATH="."
$env:TESTING="1"
pytest app/tests -v --cov=app --cov-report=term-missing



## Deploy no Heroku

cd backend
git init
git add .
git commit -m "Deploy inicial no Heroku"


## Criar app e banco

heroku create brain-agriculture-api
heroku addons:create heroku-postgresql:essential-0 --app brain-agriculture-api
heroku config --app brain-agriculture-api


## Deploy

git push heroku main


## Acessar logs e API

heroku logs --tail --app brain-agriculture-api
heroku open --app brain-agriculture-api


