from fastapi import FastAPI
from sqlalchemy import text

from euroscout.api.players import router as players_router
from euroscout.api.standings import router as standings_router
from euroscout.api.teams import router as teams_router
from euroscout.database.session import engine

app = FastAPI(
    title="EuroScout AI API",
    description="AI-powered EuroLeague scouting platform.",
    version="0.1.0",
)
app.include_router(players_router)
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
