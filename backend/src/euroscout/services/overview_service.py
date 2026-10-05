from sqlalchemy.orm import Session

from euroscout.repositories.season_repository import SeasonRepository
from euroscout.schemas.overview import OverviewResponse
from euroscout.schemas.player import PlayerLeaderboardSort
from euroscout.services.player_service import PlayerService
from euroscout.services.standing_service import StandingService
from euroscout.services.team_service import TeamService


class OverviewService:
    def __init__(self) -> None:
        self.seasons = SeasonRepository()
        self.players = PlayerService()
        self.teams = TeamService()
        self.standings = StandingService()

    def get_overview(self, db: Session, *, season_code: str) -> OverviewResponse | None:
        season = self.seasons.get_by_code(db, season_code)
        if season is None:
            return None

        top_pir = self._leaderboard(db, season_code, "pir")
        top_scorers = self._leaderboard(db, season_code, "points")
        top_assists = self._leaderboard(db, season_code, "assists")
        teams = self.teams.get_team_list(db, season_code=season_code)
        standings = self.standings.get_standings(db, season_code=season_code)

        return OverviewResponse(
            season_code=season.code,
            season_name=season.name,
            player_count=top_pir.total_items,
            team_count=len(teams),
            leader=standings.items[0] if standings.items else None,
            top_pir=top_pir.items,
            top_scorers=top_scorers.items,
            top_assists=top_assists.items,
        )

    def _leaderboard(
        self,
        db: Session,
        season_code: str,
        sort_by: PlayerLeaderboardSort,
    ):
        return self.players.get_leaderboard(
            db,
            season_code=season_code,
            sort_by=sort_by,
            order="desc",
            page=1,
            page_size=5,
        )
