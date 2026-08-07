from sqlalchemy.orm import Session

from euroscout.repositories.player_repository import (
    PlayerLeaderboardRow,
    PlayerRepository,
)
from euroscout.schemas.scout import (
    ComparedPlayerResponse,
    DeterministicPlayerComparison,
    PlayerComparisonDifferences,
    PlayerComparisonRequest,
    PlayerComparisonResponse,
)
from euroscout.services.scout_analysis_service import ScoutAnalysisService


class SamePlayerComparisonError(ValueError):
    pass


class PlayerSeasonStatsNotFoundError(LookupError):
    def __init__(self, player_label: str, player_id: int, season_code: str) -> None:
        self.player_label = player_label
        self.player_id = player_id
        self.season_code = season_code
        super().__init__(
            f"Player {player_label} with id {player_id} was not found "
            f"for season {season_code}."
        )


class ScoutService:
    def __init__(
        self,
        analysis_service: ScoutAnalysisService | None = None,
    ) -> None:
        self.players = PlayerRepository()
        self.analysis_service = analysis_service or ScoutAnalysisService()

    def compare_players(
        self,
        db: Session,
        comparison: PlayerComparisonRequest,
    ) -> DeterministicPlayerComparison:
        if comparison.player_a_id == comparison.player_b_id:
            raise SamePlayerComparisonError("Player IDs must be different.")

        player_a_row = self._get_player_or_raise(
            db,
            player_label="A",
            player_id=comparison.player_a_id,
            season_code=comparison.season_code,
        )
        player_b_row = self._get_player_or_raise(
            db,
            player_label="B",
            player_id=comparison.player_b_id,
            season_code=comparison.season_code,
        )
        player_a = _to_compared_player(player_a_row)
        player_b = _to_compared_player(player_b_row)

        return DeterministicPlayerComparison(
            season_code=comparison.season_code,
            player_a=player_a,
            player_b=player_b,
            differences=_calculate_differences(player_a, player_b),
        )

    def compare_players_with_analysis(
        self,
        db: Session,
        comparison: PlayerComparisonRequest,
    ) -> PlayerComparisonResponse:
        deterministic_comparison = self.compare_players(db, comparison)
        analysis = self.analysis_service.analyze(deterministic_comparison)

        return PlayerComparisonResponse(
            **deterministic_comparison.model_dump(),
            analysis=analysis,
        )

    def _get_player_or_raise(
        self,
        db: Session,
        *,
        player_label: str,
        player_id: int,
        season_code: str,
    ) -> PlayerLeaderboardRow:
        row = self.players.get_player_season_stats(
            db,
            player_id=player_id,
            season_code=season_code,
        )
        if row is None:
            raise PlayerSeasonStatsNotFoundError(
                player_label,
                player_id,
                season_code,
            )

        return row


def _to_compared_player(row: PlayerLeaderboardRow) -> ComparedPlayerResponse:
    player, stats, team, _season = row

    return ComparedPlayerResponse(
        player_id=player.id,
        external_id=player.external_id,
        first_name=player.first_name,
        last_name=player.last_name,
        image_url=player.image_url,
        team_id=team.id,
        team_name=team.name,
        team_logo_url=team.logo_url,
        games_played=stats.games_played,
        minutes_per_game=_rounded(stats.minutes_per_game),
        points_per_game=_rounded(stats.points_per_game),
        rebounds_per_game=_rounded(stats.rebounds_per_game),
        assists_per_game=_rounded(stats.assists_per_game),
        steals_per_game=_rounded(stats.steals_per_game),
        blocks_per_game=_rounded(stats.blocks_per_game),
        turnovers_per_game=_rounded(stats.turnovers_per_game),
        two_point_percentage=_rounded(stats.two_point_percentage),
        three_point_percentage=_rounded(stats.three_point_percentage),
        free_throw_percentage=_rounded(stats.free_throw_percentage),
        pir_per_game=_rounded(stats.pir_per_game),
    )


def _calculate_differences(
    player_a: ComparedPlayerResponse,
    player_b: ComparedPlayerResponse,
) -> PlayerComparisonDifferences:
    return PlayerComparisonDifferences(
        minutes_per_game=_difference(
            player_a.minutes_per_game,
            player_b.minutes_per_game,
        ),
        points_per_game=_difference(
            player_a.points_per_game,
            player_b.points_per_game,
        ),
        rebounds_per_game=_difference(
            player_a.rebounds_per_game,
            player_b.rebounds_per_game,
        ),
        assists_per_game=_difference(
            player_a.assists_per_game,
            player_b.assists_per_game,
        ),
        steals_per_game=_difference(
            player_a.steals_per_game,
            player_b.steals_per_game,
        ),
        blocks_per_game=_difference(
            player_a.blocks_per_game,
            player_b.blocks_per_game,
        ),
        turnovers_per_game=_difference(
            player_a.turnovers_per_game,
            player_b.turnovers_per_game,
        ),
        two_point_percentage=_difference(
            player_a.two_point_percentage,
            player_b.two_point_percentage,
        ),
        three_point_percentage=_difference(
            player_a.three_point_percentage,
            player_b.three_point_percentage,
        ),
        free_throw_percentage=_difference(
            player_a.free_throw_percentage,
            player_b.free_throw_percentage,
        ),
        pir_per_game=_difference(player_a.pir_per_game, player_b.pir_per_game),
    )


def _difference(player_a_value: float, player_b_value: float) -> float:
    return _rounded(player_a_value - player_b_value)


def _rounded(value: float) -> float:
    return round(value, 2)
