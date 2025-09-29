# backend/app/main.py
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging, os

from app.routers import producers, dashboard
from app import models, database

# ✅ Só cria tabelas se não estiver em TESTING
if os.getenv("TESTING") != "1":
    models.Base.metadata.create_all(bind=database.engine)

# ✅ Inicializa app
app = FastAPI(title="🌱 Brain Agriculture API")

# ✅ CORS (libera React em dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn.error")

# ✅ Middleware para capturar e logar erros
@app.middleware("http")
async def log_requests(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        logger.error(f"🔥 Erro na requisição {request.url}: {e}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": str(e)},
        )

# ✅ Rotas
app.include_router(producers.router, prefix="/producers", tags=["Producers"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])

@app.get("/")
def root():
    return {"msg": "🚀 API Brain Agriculture rodando!"}
