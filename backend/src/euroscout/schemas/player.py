from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict


class PlayerResponse(BaseModel):
    id: int
    external_id: str
    first_name: str
    last_name: str
    birth_date: date | None
    height_cm: int | None
    position: str | None
    nationality: str | None
    image_url: str | None

    model_config = ConfigDict(from_attributes=True)


PlayerLeaderboardSort = Literal[
    "pir",
    "points",
    "rebounds",
    "assists",
    "steals",
    "blocks",
    "turnovers",
    "minutes",
    "two_point_percentage",
    "three_point_percentage",
    "free_throw_percentage",
]
PlayerLeaderboardOrder = Literal["asc", "desc"]


class PlayerLeaderboardResponse(BaseModel):
    player_id: int
    external_id: str
    first_name: str
    last_name: str
    image_url: str | None
    team_id: int
    team_name: str
    team_logo_url: str | None
    season_code: str
    games_played: int
    minutes_per_game: float
    points_per_game: float
    rebounds_per_game: float
    assists_per_game: float
    steals_per_game: float
    blocks_per_game: float
    turnovers_per_game: float
    two_point_percentage: float
    three_point_percentage: float
    free_throw_percentage: float
    pir_per_game: float


class PaginatedPlayerLeaderboardResponse(BaseModel):
    items: list[PlayerLeaderboardResponse]
    page: int
    page_size: int
    total_items: int
    total_pages: int
