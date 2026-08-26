import math
from dataclasses import dataclass
from typing import Any

from sqlalchemy.orm import Session

from euroscout.clients.euroleague_client import EuroLeagueClient
from euroscout.models.player import Player
from euroscout.models.season import Season
from euroscout.models.team import Team
from euroscout.repositories.player_repository import PlayerRepository
from euroscout.repositories.player_season_stats_repository import (
    PlayerSeasonStatsRepository,
)
from euroscout.repositories.season_repository import SeasonRepository
from euroscout.repositories.team_repository import TeamRepository


@dataclass(frozen=True)
class ImportResult:
    players_created: int = 0
    players_updated: int = 0
    teams_created: int = 0
    teams_updated: int = 0
    stat_rows_created: int = 0
    stat_rows_updated: int = 0


class ImportService:
    def __init__(self, client: EuroLeagueClient | None = None) -> None:
        self.client = client or EuroLeagueClient()
        self.seasons = SeasonRepository()
        self.teams = TeamRepository()
        self.players = PlayerRepository()
        self.player_season_stats = PlayerSeasonStatsRepository()

    def import_player_stats_for_season(
        self,
        db: Session,
        season: int,
    ) -> ImportResult:
        if season < 2000:
            raise ValueError("Season must be a four-digit starting year")

        rows = self.client.get_player_stats_for_season(season)
        season_model = self._get_or_create_season(db, season)
        db.flush()

        team_cache: dict[str, Team] = {}
        player_cache: dict[str, Player] = {}
        players_created = 0
        players_updated = 0
        teams_created = 0
        teams_updated = 0
        stat_rows_created = 0
        stat_rows_updated = 0

        for row in rows:
            _validate_single_team_identity(row)
            team_external_id = _required_string(row, "player.team.code")
            player_external_id = _required_string(row, "player.code")

            team = team_cache.get(team_external_id)
            if team is None:
                team, created = self._upsert_team(db, row, team_external_id)
                team_cache[team_external_id] = team
                teams_created += int(created)
                teams_updated += int(not created)

            player = player_cache.get(player_external_id)
            if player is None:
                player, created = self._upsert_player(db, row, player_external_id)
                player_cache[player_external_id] = player
                players_created += int(created)
                players_updated += int(not created)

            db.flush()
            stats = self.player_season_stats.get_by_player_team_season(
                db,
                player_id=player.id,
                team_id=team.id,
                season_id=season_model.id,
            )
            values = _stats_values(row)

            if stats is None:
                self.player_season_stats.create(
                    db,
                    player_id=player.id,
                    team_id=team.id,
                    season_id=season_model.id,
                    values=values,
                )
                stat_rows_created += 1
            else:
                self.player_season_stats.update(stats, values=values)
                stat_rows_updated += 1

        return ImportResult(
            players_created=players_created,
            players_updated=players_updated,
            teams_created=teams_created,
            teams_updated=teams_updated,
            stat_rows_created=stat_rows_created,
            stat_rows_updated=stat_rows_updated,
        )

    def _get_or_create_season(self, db: Session, year: int) -> Season:
        code = f"E{year}"
        name = f"{year}/{str(year + 1)[-2:]}"
        season = self.seasons.get_by_code(db, code)

        if season is None:
            return self.seasons.create(db, code=code, name=name)

        return self.seasons.update(season, name=name)

    def _upsert_team(
        self,
        db: Session,
        row: dict[str, Any],
        external_id: str,
    ) -> tuple[Team, bool]:
        name = _required_string(row, "player.team.name")
        logo_url = _optional_string(row.get("player.team.imageUrl"))
        team = self.teams.get_by_external_id(db, external_id)

        if team is None:
            return (
                self.teams.create(
                    db,
                    external_id=external_id,
                    name=name,
                    logo_url=logo_url,
                ),
                True,
            )

        return self.teams.update(team, name=name, logo_url=logo_url), False

    def _upsert_player(
        self,
        db: Session,
        row: dict[str, Any],
        external_id: str,
    ) -> tuple[Player, bool]:
        first_name, last_name = _split_player_name(_required_string(row, "player.name"))
        image_url = _optional_string(row.get("player.imageUrl"))
        player = self.players.get_by_external_id(db, external_id)

        if player is None:
            return (
                self.players.create(
                    db,
                    external_id=external_id,
                    first_name=first_name,
                    last_name=last_name,
                    image_url=image_url,
                ),
                True,
            )

        return (
            self.players.update(
                player,
                first_name=first_name,
                last_name=last_name,
                image_url=image_url,
            ),
            False,
        )


def _stats_values(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "games_played": int(_to_float(row.get("gamesPlayed"))),
        "minutes_per_game": _to_float(row.get("minutesPlayed")),
        "points_per_game": _to_float(row.get("pointsScored")),
        "rebounds_per_game": _to_float(row.get("totalRebounds")),
        "assists_per_game": _to_float(row.get("assists")),
        "steals_per_game": _to_float(row.get("steals")),
        "blocks_per_game": _to_float(row.get("blocks")),
        "turnovers_per_game": _to_float(row.get("turnovers")),
        "two_point_percentage": _to_percentage(row.get("twoPointersPercentage")),
        "three_point_percentage": _to_percentage(row.get("threePointersPercentage")),
        "free_throw_percentage": _to_percentage(row.get("freeThrowsPercentage")),
        "pir_per_game": _to_float(row.get("pir")),
    }


def _validate_single_team_identity(row: dict[str, Any]) -> None:
    for key in (
        "player.team.code",
        "player.team.name",
        "player.team.imageUrl",
    ):
        value = _optional_string(row.get(key))
        if value is not None and ";" in value:
            raise ValueError(f"Multiple teams are not valid for {key}: {value!r}")


def _split_player_name(full_name: str) -> tuple[str, str]:
    last_name, separator, first_name = full_name.partition(",")
    if not separator:
        return "", last_name.strip()

    return first_name.strip(), last_name.strip()


def _required_string(row: dict[str, Any], key: str) -> str:
    value = _optional_string(row.get(key))
    if value is None:
        raise ValueError(f"Missing required value: {key}")

    return value


def _optional_string(value: Any) -> str | None:
    if value is None or _is_nan(value):
        return None

    text = str(value).strip()
    return text or None


def _to_percentage(value: Any) -> float:
    if isinstance(value, str):
        value = value.strip().removesuffix("%")

    return _to_float(value)


def _to_float(value: Any) -> float:
    if value is None or _is_nan(value):
        return 0.0

    if isinstance(value, str) and not value.strip():
        return 0.0

    try:
        return float(value)
    except (TypeError, ValueError) as error:
        raise ValueError(f"Cannot convert {value!r} to a number") from error


def _is_nan(value: Any) -> bool:
    try:
        return math.isnan(value)
    except TypeError, ValueError:
        return False
