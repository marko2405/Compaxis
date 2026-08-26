from typing import cast

from sqlalchemy import select
from sqlalchemy.orm import Session

from euroscout.models.season_team_standing import SeasonTeamStanding
from euroscout.models.team import Team

StandingRow = tuple[SeasonTeamStanding, Team]


class StandingRepository:
    def get_by_season(self, db: Session, *, season_id: int) -> list[StandingRow]:
        statement = (
            select(SeasonTeamStanding, Team)
            .join(Team, Team.id == SeasonTeamStanding.team_id)
            .where(SeasonTeamStanding.season_id == season_id)
            .order_by(SeasonTeamStanding.rank.asc())
        )
        return cast(list[StandingRow], db.execute(statement).tuples().all())

    def get_by_season_and_team(
        self, db: Session, *, season_id: int, team_id: int
    ) -> SeasonTeamStanding | None:
        statement = select(SeasonTeamStanding).where(
            SeasonTeamStanding.season_id == season_id,
            SeasonTeamStanding.team_id == team_id,
        )
        return db.scalar(statement)

    def create(
        self,
        db: Session,
        *,
        season_id: int,
        team_id: int,
        values: dict[str, int | float],
    ) -> SeasonTeamStanding:
        standing = SeasonTeamStanding(season_id=season_id, team_id=team_id, **values)
        db.add(standing)
        return standing

    def update(
        self, standing: SeasonTeamStanding, *, values: dict[str, int | float]
    ) -> SeasonTeamStanding:
        for key, value in values.items():
            setattr(standing, key, value)
        return standing
