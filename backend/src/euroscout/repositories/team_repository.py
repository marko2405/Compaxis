from sqlalchemy import select
from sqlalchemy.orm import Session

from euroscout.models.team import Team


class TeamRepository:
    def get_all(self, db: Session) -> list[Team]:
        statement = select(Team)

        return list(db.scalars(statement).all())

    def get_by_id(self, db: Session, team_id: int) -> Team | None:
        return db.get(Team, team_id)
