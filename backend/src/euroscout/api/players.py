from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from euroscout.database.session import get_db
from euroscout.schemas.player import (
    PaginatedPlayerLeaderboardResponse,
    PlayerLeaderboardOrder,
    PlayerLeaderboardSort,
    PlayerResponse,
)
from euroscout.services.player_service import PlayerService

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
    "/leaderboard",
    response_model=PaginatedPlayerLeaderboardResponse,
)
def get_player_leaderboard(
    db: DatabaseSession,
    season_code: str = "E2024",
    sort_by: PlayerLeaderboardSort = "pir",
    order: PlayerLeaderboardOrder = "desc",
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=20)] = 15,
) -> PaginatedPlayerLeaderboardResponse:
    return player_service.get_leaderboard(
        db,
        season_code=season_code,
        sort_by=sort_by,
        order=order,
        page=page,
        page_size=page_size,
    )


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
