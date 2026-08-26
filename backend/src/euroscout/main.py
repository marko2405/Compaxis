from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from euroscout.api.players import router as players_router
from euroscout.api.scout import router as scout_router
from euroscout.api.standings import router as standings_router
from euroscout.api.teams import router as teams_router
from euroscout.database.session import engine

app = FastAPI(
    title="EuroScout AI API",
    description="AI-powered EuroLeague scouting platform.",
    version="0.1.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:3000",
        "http://localhost:3000",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(players_router)
app.include_router(scout_router)
app.include_router(teams_router)
app.include_router(standings_router)


@app.get("/")
def root():
    return {"message": "Welcome to EuroScout AI 🚀"}


@app.get("/health/database")
def database_health():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "status": "ok",
        "database": "connected",
    }
