from dataclasses import dataclass
from typing import Any, cast

from euroleague_api.standings import Standings


@dataclass(frozen=True)
class UpstreamStanding:
    rank: int
    team_external_id: str
    games_played: int
    wins: int
    losses: int
    win_percentage: float
    points_for: int
    points_against: int
    point_differential: int


class EuroLeagueStandingsClient:
    def __init__(self, competition_code: str = "E") -> None:
        self.client = Standings(competition_code)

    def get_standings(self, season: int, round_number: int) -> list[UpstreamStanding]:
        dataframe = self.client.get_standings(
            season, round_number, endpoint="basicstandings"
        )
        rows = cast(list[dict[str, Any]], dataframe.to_dict(orient="records"))
        return [_to_upstream_standing(row) for row in rows]


def _to_upstream_standing(row: dict[str, Any]) -> UpstreamStanding:
    return UpstreamStanding(
        rank=_required_int(row, "position"),
        team_external_id=_required_string(row, "club.code"),
        games_played=_required_int(row, "gamesPlayed"),
        wins=_required_int(row, "gamesWon"),
        losses=_required_int(row, "gamesLost"),
        win_percentage=_percentage(row.get("winPercentage")),
        points_for=_required_int(row, "pointsFor"),
        points_against=_required_int(row, "pointsAgainst"),
        point_differential=_signed_int(row.get("pointsDifference")),
    )


def _required_string(row: dict[str, Any], key: str) -> str:
    value = str(row.get(key, "")).strip()
    if not value:
        raise ValueError(f"Missing standings value: {key}")
    return value


def _required_int(row: dict[str, Any], key: str) -> int:
    value = row.get(key)
    if isinstance(value, bool):
        raise TypeError(f"Invalid standings integer: {key}")
    try:
        return int(value)
    except (TypeError, ValueError) as error:
        raise ValueError(f"Invalid standings integer: {key}") from error


def _percentage(value: Any) -> float:
    try:
        return float(str(value).strip().removesuffix("%"))
    except (TypeError, ValueError) as error:
        raise ValueError("Invalid standings win percentage") from error


def _signed_int(value: Any) -> int:
    try:
        return int(str(value).strip().removeprefix("+"))
    except (TypeError, ValueError) as error:
        raise ValueError("Invalid standings point differential") from error
