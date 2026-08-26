from sqlalchemy import select
from sqlalchemy.orm import Session

from euroscout.models.player_season_stats import PlayerSeasonStats
from euroscout.models.season import Season
from euroscout.models.team import Team


class TeamRepository:
    def get_by_external_id(
        self,
        db: Session,
        external_id: str,
    ) -> Team | None:
        statement = select(Team).where(Team.external_id == external_id)

        return db.scalar(statement)

    def create(
        self,
        db: Session,
        *,
        external_id: str,
        name: str,
        logo_url: str | None,
    ) -> Team:
        team = Team(external_id=external_id, name=name, logo_url=logo_url)
        db.add(team)

        return team

    def update(
        self,
        team: Team,
        *,
        name: str,
        logo_url: str | None,
    ) -> Team:
        team.name = name
        team.logo_url = logo_url

        return team

    def get_all(self, db: Session) -> list[Team]:
        statement = select(Team).order_by(Team.name.asc(), Team.id.asc())

        return list(db.scalars(statement).all())

    def get_by_id(self, db: Session, team_id: int) -> Team | None:
        return db.get(Team, team_id)

    def get_by_id_for_season(
        self,
        db: Session,
        *,
        team_id: int,
        season_code: str,
    ) -> Team | None:
        statement = (
            select(Team)
            .join(PlayerSeasonStats, PlayerSeasonStats.team_id == Team.id)
            .join(Season, Season.id == PlayerSeasonStats.season_id)
            .where(Team.id == team_id, Season.code == season_code)
            .distinct()
        )

        return db.scalar(statement)
