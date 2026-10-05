from sqlalchemy import select
from sqlalchemy.orm import Session

from euroscout.models.season import Season


class SeasonRepository:
    def get_all(self, db: Session) -> list[Season]:
        statement = select(Season).order_by(Season.code.desc(), Season.id.desc())

        return list(db.scalars(statement).all())

    def get_by_code(self, db: Session, code: str) -> Season | None:
        statement = select(Season).where(Season.code == code)

        return db.scalar(statement)

    def create(self, db: Session, *, code: str, name: str) -> Season:
        season = Season(code=code, name=name)
        db.add(season)

        return season

    def update(self, season: Season, *, name: str) -> Season:
        season.name = name

        return season
