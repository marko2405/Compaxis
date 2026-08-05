from sqlalchemy.orm import Session

from euroscout.models.team import Team
from euroscout.repositories.team_repository import TeamRepository


class TeamService:
    def __init__(self) -> None:
        self.repository = TeamRepository()

    def get_all_teams(self, db: Session) -> list[Team]:
        return self.repository.get_all(db)

    def get_team_by_id(self, db: Session, team_id: int) -> Team | None:
        return self.repository.get_by_id(db, team_id)
