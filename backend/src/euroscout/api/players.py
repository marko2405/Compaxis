from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from euroscout.database.session import get_db
from euroscout.schemas.player import (
    PaginatedPlayerLeaderboardResponse,
    PlayerLeaderboardOrder,
    PlayerLeaderboardResponse,
    PlayerLeaderboardSort,
    PlayerResponse,
    PlayerSearchResult,
)
from euroscout.services.player_service import PlayerService
from euroscout.services.season_service import SeasonService

router = APIRouter(
    prefix="/players",
    tags=["Players"],
)

player_service = PlayerService()
season_service = SeasonService()

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
    "/search",
    response_model=list[PlayerSearchResult],
)
def search_players(
    db: DatabaseSession,
    q: str = "",
    limit: Annotated[int, Query(ge=1, le=10)] = 8,
) -> list[PlayerSearchResult]:
    return player_service.search_players(db, query=q, limit=limit)


@router.get(
    "/leaderboard",
    response_model=PaginatedPlayerLeaderboardResponse,
)
def get_player_leaderboard(
    db: DatabaseSession,
    season_code: str | None = None,
    sort_by: PlayerLeaderboardSort = "pir",
    order: PlayerLeaderboardOrder = "desc",
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=20)] = 15,
) -> PaginatedPlayerLeaderboardResponse:
    resolved_season_code = season_service.resolve_season_code(db, season_code)
    if resolved_season_code is None:
        return PaginatedPlayerLeaderboardResponse(
            items=[], page=page, page_size=page_size, total_items=0, total_pages=0
        )

    return player_service.get_leaderboard(
        db,
        season_code=resolved_season_code,
        sort_by=sort_by,
        order=order,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/{player_id}/profile",
    response_model=PlayerLeaderboardResponse,
)
def get_player_profile(
    player_id: int,
    db: DatabaseSession,
    season_code: str | None = None,
) -> PlayerLeaderboardResponse:
    resolved_season_code = season_service.resolve_season_code(db, season_code)
    if resolved_season_code is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No seasons are available.",
        )
    profile = player_service.get_profile(
        db,
        player_id=player_id,
        season_code=resolved_season_code,
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player profile not found for the selected season.",
        )

    return profile


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
