from pydantic import BaseModel


class StandingResponse(BaseModel):
    position: int
    team_id: int
    team_name: str
    games_played: int
    wins: int
    losses: int
