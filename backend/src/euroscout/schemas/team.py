from pydantic import BaseModel, ConfigDict


class TeamResponse(BaseModel):
    id: int
    external_id: str
    name: str
    country: str | None
    logo_url: str | None

    model_config = ConfigDict(from_attributes=True)


class TeamListResponse(BaseModel):
    team_id: int
    external_id: str
    name: str
    country: str | None
    logo_url: str | None


class TeamRosterPlayerResponse(BaseModel):
    player_id: int
    external_id: str
    first_name: str
    last_name: str
    image_url: str | None
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


class TeamProfileResponse(TeamListResponse):
    season_code: str
    roster: list[TeamRosterPlayerResponse]
