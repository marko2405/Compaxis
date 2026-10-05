from pydantic import BaseModel

from euroscout.schemas.player import PlayerLeaderboardResponse
from euroscout.schemas.standing import StandingItemResponse


class OverviewResponse(BaseModel):
    season_code: str
    season_name: str
    player_count: int
    team_count: int
    leader: StandingItemResponse | None
    top_pir: list[PlayerLeaderboardResponse]
    top_scorers: list[PlayerLeaderboardResponse]
    top_assists: list[PlayerLeaderboardResponse]
