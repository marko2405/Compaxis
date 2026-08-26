from typing import Any, cast

from euroleague_api.boxscore_data import BoxScoreData
from euroleague_api.player_stats import PlayerStats


class EuroLeagueClient:
    def __init__(self, competition_code: str = "E") -> None:
        self.player_stats_client = PlayerStats(competition_code)
        self.boxscore_client = BoxScoreData(competition_code)

    def get_player_stats_for_season(
        self,
        season: int,
    ) -> list[dict[str, Any]]:
        dataframe = self.player_stats_client.get_player_stats_single_season(
            endpoint="traditional",
            season=season,
            statistic_mode="PerGame",
        )

        rows = cast(
            list[dict[str, Any]],
            dataframe.to_dict(orient="records"),
        )
        return _resolve_multi_team_rows(rows, season, self.boxscore_client)


def _resolve_multi_team_rows(
    rows: list[dict[str, Any]],
    season: int,
    boxscore_client: BoxScoreData,
) -> list[dict[str, Any]]:
    unresolved = {
        _required_source_string(row, "player.code"): row
        for row in rows
        if ";" in _required_source_string(row, "player.team.code")
    }
    if not unresolved:
        return rows

    memberships = {
        player_code: set(_split_memberships(row["player.team.code"]))
        for player_code, row in unresolved.items()
    }
    schedule = boxscore_client.get_gamecodes_season(season)
    games = cast(list[dict[str, Any]], schedule.to_dict(orient="records"))

    for game in sorted(games, key=lambda item: int(item["gameCode"]), reverse=True):
        if not bool(game.get("played")):
            continue

        relevant_players = {
            player_code
            for player_code, team_codes in memberships.items()
            if player_code in unresolved
            and (
                str(game.get("homecode", "")).strip() in team_codes
                or str(game.get("awaycode", "")).strip() in team_codes
            )
        }
        if not relevant_players:
            continue

        boxscore = boxscore_client.get_players_boxscore_stats(
            season,
            int(game["gameCode"]),
        )
        appearances = cast(
            list[dict[str, Any]],
            boxscore.to_dict(orient="records"),
        )
        for appearance in appearances:
            player_code = _normalize_boxscore_player_id(appearance.get("Player_ID"))
            if player_code not in relevant_players:
                continue

            team_code = _required_source_string(appearance, "Team")
            if team_code not in memberships[player_code]:
                continue

            _select_team_membership(unresolved[player_code], team_code)
            del unresolved[player_code]

        if not unresolved:
            return rows

    missing_players = ", ".join(sorted(unresolved))
    raise ValueError(
        f"Could not resolve latest team membership for players: {missing_players}"
    )


def _select_team_membership(row: dict[str, Any], selected_code: str) -> None:
    team_codes = _split_memberships(row["player.team.code"])
    try:
        selected_index = team_codes.index(selected_code)
    except ValueError as error:
        raise ValueError(
            f"Resolved team {selected_code!r} is absent from source memberships"
        ) from error

    for key in (
        "player.team.code",
        "player.team.tvCodes",
        "player.team.name",
        "player.team.imageUrl",
    ):
        values = _split_memberships(row.get(key))
        if len(values) != len(team_codes):
            raise ValueError(f"Misaligned multi-team source field: {key}")
        row[key] = values[selected_index]


def _split_memberships(value: Any) -> list[str]:
    if value is None:
        return []

    return [part.strip() for part in str(value).split(";") if part.strip()]


def _normalize_boxscore_player_id(value: Any) -> str:
    return str(value or "").strip().removeprefix("P")


def _required_source_string(row: dict[str, Any], key: str) -> str:
    value = str(row.get(key, "")).strip()
    if not value:
        raise ValueError(f"Missing required source value: {key}")
    return value
