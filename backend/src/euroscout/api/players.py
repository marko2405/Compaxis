from typing import Annotated

from euroscout.database.session import get_db
from euroscout.schemas.player import PlayerResponse
from euroscout.services.player_service import PlayerService
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/players",
    tags=["Players"],
)

player_service = PlayerService()

DatabaseSession = Annotated[Session, Depends(get_db)]


@router.get(
    "",
    response_model=list[PlayerResponse],
)
def get_players(
    db: DatabaseSession,
) -> list[PlayerResponse]:
    players = player_service.get_all_players(db)

    return [PlayerResponse.model_validate(player) for player in players]


@router.get(
    "/{player_id}",
    response_model=PlayerResponse,
)
def get_player(
    player_id: int,
    db: DatabaseSession,
) -> PlayerResponse:
    player = player_service.get_player_by_id(
        db,
        player_id,
    )

    if player is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found.",
        )

    return PlayerResponse.model_validate(player)
