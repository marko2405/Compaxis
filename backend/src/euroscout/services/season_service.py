from sqlalchemy.orm import Session

from euroscout.models.season import Season
from euroscout.repositories.season_repository import SeasonRepository


class SeasonService:
    def __init__(self) -> None:
        self.repository = SeasonRepository()

    def get_all_seasons(self, db: Session) -> list[Season]:
        return self.repository.get_all(db)
