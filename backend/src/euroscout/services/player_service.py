from sqlalchemy.orm import Session

from euroscout.models.player import Player
from euroscout.repositories.player_repository import (
    PlayerLeaderboardRow,
    PlayerRepository,
    PlayerSearchRow,
)
from euroscout.schemas.player import (
    PaginatedPlayerLeaderboardResponse,
    PlayerLeaderboardOrder,
    PlayerLeaderboardResponse,
    PlayerLeaderboardSort,
    PlayerSearchResult,
)


class PlayerService:
    def __init__(self) -> None:
        self.repository = PlayerRepository()

    def get_all_players(
        self,
        db: Session,
    ) -> list[Player]:
        return self.repository.get_all(db)

    def search_players(
        self,
        db: Session,
        *,
        query: str,
        limit: int,
    ) -> list[PlayerSearchResult]:
        normalized_query = " ".join(query.split())
        if len(normalized_query) < 2:
            return []

        return [
            _to_player_search_result(row)
            for row in self.repository.search(
                db,
                query=normalized_query,
                limit=limit,
            )
        ]

    def get_leaderboard(
        self,
        db: Session,
        *,
        season_code: str,
        sort_by: PlayerLeaderboardSort,
        order: PlayerLeaderboardOrder,
        page: int,
        page_size: int,
    ) -> PaginatedPlayerLeaderboardResponse:
        rows = self.repository.get_leaderboard(
            db,
            season_code=season_code,
            sort_by=sort_by,
            order=order,
            page=page,
            page_size=page_size,
        )
        total_items = self.repository.count_leaderboard(
            db,
            season_code=season_code,
        )

        items = [_to_player_stats_response(row) for row in rows]

        return PaginatedPlayerLeaderboardResponse(
            items=items,
            page=page,
            page_size=page_size,
            total_items=total_items,
            total_pages=(total_items + page_size - 1) // page_size,
        )

    def get_profile(
        self,
        db: Session,
        *,
        player_id: int,
        season_code: str,
    ) -> PlayerLeaderboardResponse | None:
        row = self.repository.get_player_season_stats(
            db,
            player_id=player_id,
            season_code=season_code,
        )

        return _to_player_stats_response(row) if row else None

    def get_player_by_id(
        self,
        db: Session,
        player_id: int,
    ) -> Player | None:
        return self.repository.get_by_id(db, player_id)


def _to_player_stats_response(
    row: PlayerLeaderboardRow,
) -> PlayerLeaderboardResponse:
    player, stats, team, season = row

    return PlayerLeaderboardResponse(
        player_id=player.id,
        external_id=player.external_id,
        first_name=player.first_name,
        last_name=player.last_name,
        image_url=player.image_url,
        team_id=team.id,
        team_name=team.name,
        team_logo_url=team.logo_url,
        season_code=season.code,
        games_played=stats.games_played,
        minutes_per_game=stats.minutes_per_game,
        points_per_game=stats.points_per_game,
        rebounds_per_game=stats.rebounds_per_game,
        assists_per_game=stats.assists_per_game,
        steals_per_game=stats.steals_per_game,
        blocks_per_game=stats.blocks_per_game,
        turnovers_per_game=stats.turnovers_per_game,
        two_point_percentage=stats.two_point_percentage,
        three_point_percentage=stats.three_point_percentage,
        free_throw_percentage=stats.free_throw_percentage,
        pir_per_game=stats.pir_per_game,
    )


def _to_player_search_result(row: PlayerSearchRow) -> PlayerSearchResult:
    player, team_id, team_name, team_logo_url = row

    return PlayerSearchResult(
        player_id=player.id,
        first_name=player.first_name,
        last_name=player.last_name,
        image_url=player.image_url,
        team_id=team_id,
        team_name=team_name,
        team_logo_url=team_logo_url,
    )
