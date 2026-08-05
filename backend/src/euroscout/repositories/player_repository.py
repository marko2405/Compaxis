from sqlalchemy import select
from sqlalchemy.orm import Session

from euroscout.models.player import Player


class PlayerRepository:
    def get_by_id(
        self,
        db: Session,
        player_id: int,
    ) -> Player | None:
        return db.get(Player, player_id)

    def get_all(
        self,
        db: Session,
    ) -> list[Player]:
        statement = select(Player)

        return list(db.scalars(statement).all())
