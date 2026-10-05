from sqlalchemy.orm import Session

from euroscout.models.team import Team
from euroscout.repositories.player_repository import PlayerRepository
from euroscout.repositories.team_repository import TeamRepository
from euroscout.schemas.team import (
    TeamListResponse,
    TeamProfileResponse,
    TeamRosterPlayerResponse,
)


class TeamService:
    def __init__(self) -> None:
        self.repository = TeamRepository()
        self.players = PlayerRepository()

    def get_all_teams(self, db: Session) -> list[Team]:
        return self.repository.get_all(db)

    def get_team_by_id(self, db: Session, team_id: int) -> Team | None:
        return self.repository.get_by_id(db, team_id)

    def get_team_list(
        self,
        db: Session,
        *,
        season_code: str | None = None,
    ) -> list[TeamListResponse]:
        teams = (
            self.repository.get_all_for_season(db, season_code=season_code)
            if season_code
            else self.repository.get_all(db)
        )
        return [_to_team_list_response(team) for team in teams]

    def get_profile(
        self,
        db: Session,
        *,
        team_id: int,
        season_code: str,
    ) -> TeamProfileResponse | None:
        team = self.repository.get_by_id_for_season(
            db,
            team_id=team_id,
            season_code=season_code,
        )
        if team is None:
            return None

        rows = self.players.get_team_roster(
            db,
            team_id=team_id,
            season_code=season_code,
        )
        roster = [
            TeamRosterPlayerResponse(
                player_id=player.id,
                external_id=player.external_id,
                first_name=player.first_name,
                last_name=player.last_name,
                image_url=player.image_url,
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
            for player, stats, _, _ in rows
        ]

        return TeamProfileResponse(
            **_to_team_list_response(team).model_dump(),
            season_code=season_code,
            roster=roster,
        )


def _to_team_list_response(team: Team) -> TeamListResponse:
    return TeamListResponse(
        team_id=team.id,
        external_id=team.external_id,
        name=team.name,
        country=team.country,
        logo_url=team.logo_url,
    )
