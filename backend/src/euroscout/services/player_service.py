from euroscout.models.player import Player
from euroscout.repositories.player_repository import PlayerRepository
from sqlalchemy.orm import Session


class PlayerService:
    def __init__(self) -> None:
        self.repository = PlayerRepository()

    def get_all_players(
        self,
        db: Session,
    ) -> list[Player]:
        return self.repository.get_all(db)

    def get_player_by_id(
        self,
        db: Session,
        player_id: int,
    ) -> Player | None:
        return self.repository.get_by_id(db, player_id)
