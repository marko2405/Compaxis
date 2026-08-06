from typing import Any, cast

from euroleague_api.player_stats import PlayerStats


class EuroLeagueClient:
    def __init__(self, competition_code: str = "E") -> None:
        self.player_stats_client = PlayerStats(competition_code)

    def get_player_stats_for_season(
        self,
        season: int,
    ) -> list[dict[str, Any]]:
        dataframe = self.player_stats_client.get_player_stats_single_season(
            endpoint="traditional",
            season=season,
            statistic_mode="PerGame",
        )

        return cast(
            list[dict[str, Any]],
            dataframe.to_dict(orient="records"),
        )
