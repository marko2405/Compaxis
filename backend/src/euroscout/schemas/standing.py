from pydantic import BaseModel


class StandingItemResponse(BaseModel):
    rank: int
    team_id: int
    external_id: str
    team_name: str
    team_logo_url: str | None
    games_played: int
    wins: int
    losses: int
    win_percentage: float
    points_for: int
    points_against: int
    point_differential: int


class StandingsResponse(BaseModel):
    season_code: str
    items: list[StandingItemResponse]
