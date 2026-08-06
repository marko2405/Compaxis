from sqlalchemy import select
from sqlalchemy.orm import Session

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
        statement = select(Team)

        return list(db.scalars(statement).all())

    def get_by_id(self, db: Session, team_id: int) -> Team | None:
        return db.get(Team, team_id)
