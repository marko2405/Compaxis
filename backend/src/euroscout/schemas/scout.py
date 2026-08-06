from pydantic import BaseModel, Field


class PlayerComparisonRequest(BaseModel):
    season_code: str
    player_a_id: int
    player_b_id: int


class ComparedPlayerResponse(BaseModel):
    player_id: int
    external_id: str
    first_name: str
    last_name: str
    image_url: str | None
    team_id: int
    team_name: str
    team_logo_url: str | None
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


class PlayerComparisonDifferences(BaseModel):
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


class PlayerComparisonResponse(BaseModel):
    season_code: str
    player_a: ComparedPlayerResponse
    player_b: ComparedPlayerResponse
    differences: PlayerComparisonDifferences = Field(
        description="All values represent player_a minus player_b."
    )
