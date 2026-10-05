from sqlalchemy.orm import Session

from euroscout.models.season import Season
from euroscout.repositories.season_repository import SeasonRepository


class SeasonService:
    def __init__(self) -> None:
        self.repository = SeasonRepository()

    def get_all_seasons(self, db: Session) -> list[Season]:
        return self.repository.get_all(db)

    def resolve_season_code(
        self,
        db: Session,
        requested_code: str | None,
    ) -> str | None:
        if requested_code:
            season = self.repository.get_by_code(db, requested_code)
            return season.code if season else None

        seasons = self.repository.get_all(db)
        return seasons[0].code if seasons else None
