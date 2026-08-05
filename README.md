# EuroScout AI

## Overview
EuroScout AI is an AI-powered EuroLeague scouting and analytics platform.

Goals:
- Build a production-quality full-stack application.
- Learn modern Backend Development and AI Engineering.

## MVP
- Dashboard
- Games
- Standings
- Teams
- Players leaderboard
- AI Scout (player comparison)

## Long-term Vision
The project will evolve into an AI scouting assistant capable of:
- Similar player search
- Natural language questions
- Scouting reports
- Cross-season comparisons
- Team analysis
- AI Agent with internal tools

## Tech Stack
Backend:
- Python
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- Docker

Frontend:
- Next.js
- TypeScript
- Material UI

AI:
- OpenAI Responses API

## Architecture

```text
Next.js
    ↓
FastAPI
    ↓
Service
    ↓
Repository
    ↓
SQLAlchemy
    ↓
PostgreSQL
```

## Data Source
Unofficial EuroLeague API.

## Roadmap
1. Backend setup
2. Player/Team APIs
3. Import EuroLeague data
4. Leaderboards
5. AI Scout
6. AI Agent
