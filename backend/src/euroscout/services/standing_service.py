from sqlalchemy.orm import Session

from euroscout.clients.standings_client import (
    EuroLeagueStandingsClient,
    UpstreamStanding,
)
from euroscout.repositories.season_repository import SeasonRepository
from euroscout.repositories.standing_repository import StandingRepository
from euroscout.repositories.team_repository import TeamRepository
from euroscout.schemas.standing import StandingItemResponse, StandingsResponse


class StandingTeamMappingError(ValueError):
    pass


class StandingService:
    def __init__(self, client: EuroLeagueStandingsClient | None = None) -> None:
        self.client = client or EuroLeagueStandingsClient()
        self.seasons = SeasonRepository()
        self.teams = TeamRepository()
        self.standings = StandingRepository()

    def get_standings(self, db: Session, *, season_code: str) -> StandingsResponse:
        season = self.seasons.get_by_code(db, season_code)
        if season is None:
            return StandingsResponse(season_code=season_code, items=[])

        rows = self.standings.get_by_season(db, season_id=season.id)
        return StandingsResponse(
            season_code=season_code,
            items=[
                StandingItemResponse(
                    rank=standing.rank,
                    team_id=team.id,
                    external_id=team.external_id,
                    team_name=team.name,
                    team_logo_url=team.logo_url,
                    games_played=standing.games_played,
                    wins=standing.wins,
                    losses=standing.losses,
                    win_percentage=standing.win_percentage,
                    points_for=standing.points_for,
                    points_against=standing.points_against,
                    point_differential=standing.point_differential,
                )
                for standing, team in rows
            ],
        )

    def sync(self, db: Session, *, season: int, round_number: int) -> int:
        season_code = f"E{season}"
        season_model = self.seasons.get_by_code(db, season_code)
        if season_model is None:
            raise ValueError(f"Season has not been imported: {season_code}")

        source_rows = self.client.get_standings(season, round_number)
        _validate_source_rows(source_rows)
        source_codes = {row.team_external_id for row in source_rows}
        teams = self.teams.get_by_external_ids(db, source_codes)
        teams_by_code = {team.external_id: team for team in teams}
        missing_codes = source_codes - teams_by_code.keys()
        if missing_codes:
            raise StandingTeamMappingError(
                f"Standings teams are missing locally: {', '.join(sorted(missing_codes))}"
            )

        for source in source_rows:
            team = teams_by_code[source.team_external_id]
            values = _standing_values(source)
            standing = self.standings.get_by_season_and_team(
                db, season_id=season_model.id, team_id=team.id
            )
            if standing is None:
                self.standings.create(
                    db,
                    season_id=season_model.id,
                    team_id=team.id,
                    values=values,
                )
            else:
                self.standings.update(standing, values=values)

        return len(source_rows)


def _validate_source_rows(rows: list[UpstreamStanding]) -> None:
    if not rows:
        raise ValueError("The standings source returned no teams")
    codes = [row.team_external_id for row in rows]
    ranks = [row.rank for row in rows]
    if len(codes) != len(set(codes)):
        raise ValueError("The standings source contains duplicate team codes")
    if len(ranks) != len(set(ranks)):
        raise ValueError("The standings source contains duplicate ranks")


def _standing_values(source: UpstreamStanding) -> dict[str, int | float]:
    return {
        "rank": source.rank,
        "games_played": source.games_played,
        "wins": source.wins,
        "losses": source.losses,
        "win_percentage": source.win_percentage,
        "points_for": source.points_for,
        "points_against": source.points_against,
        "point_differential": source.point_differential,
    }
