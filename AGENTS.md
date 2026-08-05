# AGENTS.md

## Project

EuroScout AI is an AI-powered EuroLeague scouting and analytics platform.

The main MVP feature is **AI Scout**, which compares two players from a selected season and returns:

- side-by-side statistics
- an AI-generated summary
- strengths
- weaknesses
- key differences

The long-term goal is to evolve the application into an AI scouting assistant capable of answering natural language questions and using internal tools.

---

## Technology Stack

### Backend

- Python
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- Docker
- uv

### Frontend

- Next.js
- TypeScript
- Material UI

### AI

- OpenAI Responses API
- Structured Outputs
- Tool Calling (later)

---

## Architecture

The backend follows a layered architecture:

API Router
→ Service
→ Repository
→ SQLAlchemy
→ PostgreSQL

General rules:

- Routes stay thin.
- Business logic belongs in Services.
- Database queries belong in Repositories.
- Database schema changes always go through Alembic.
- Keep `main.py` small.

---

## Current Database Models

- Season
- Team
- Player
- PlayerSeasonStats

A player does not permanently belong to one team because players can change clubs between seasons.

---

## Current Project Status

Completed:

- FastAPI setup
- PostgreSQL running in Docker
- SQLAlchemy configured
- Alembic configured
- Initial migration applied
- Database connection working
- Initial models created

---

## Next Task

Implement the first real feature:

GET /players

Using:

- database session dependency
- PlayerRepository
- PlayerService
- Pydantic response schemas
- FastAPI router

After that:

1. Import EuroLeague data
2. Build the player leaderboard
3. Implement Teams and Standings
4. Build AI Scout
5. Start the Next.js frontend
6. Build the AI Agent

---

## AI Rules

The first AI Scout version should remain simple.

Application code should:

1. Load player statistics.
2. Validate the selected season.
3. Build structured comparison data.
4. Send only relevant information to the LLM.
5. Return structured AI output.

The LLM should not invent information that is not supported by the available data.

Future agent tools may include:

- search_players
- get_player_stats
- compare_players
- search_teams
- search_games

Introduce frameworks such as LangGraph only if they provide a clear architectural benefit after the basic implementation is working.

---

## Frontend Rules

Initial pages:

- Dashboard
- Games
- Standings
- Players
- Teams
- AI Scout

The first frontend priority is AI Scout.

Prefer reusable components and keep the initial UI clean and simple.

---

## Working Style

Before implementing a change:

1. Inspect the repository.
2. Read the relevant files.
3. Explain the planned change.
4. Modify only related files.
5. Test the result.
6. Summarize what changed.

Prefer simple, readable code over unnecessary abstractions.

---

## Git

Use clear commit messages.

Examples:

- feat: add player repository
- feat: implement player leaderboard
- feat: add AI comparison
- fix: correct season statistics
- docs: update agent instructions
