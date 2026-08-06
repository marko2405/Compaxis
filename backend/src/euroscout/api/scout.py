from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from euroscout.database.session import get_db
from euroscout.schemas.scout import (
    PlayerComparisonRequest,
    PlayerComparisonResponse,
)
from euroscout.services.scout_service import (
    PlayerSeasonStatsNotFoundError,
    SamePlayerComparisonError,
    ScoutService,
)

router = APIRouter(prefix="/scout", tags=["Scout"])
scout_service = ScoutService()

DatabaseSession = Annotated[Session, Depends(get_db)]


@router.post(
    "/compare",
    response_model=PlayerComparisonResponse,
)
def compare_players(
    comparison: PlayerComparisonRequest,
    db: DatabaseSession,
) -> PlayerComparisonResponse:
    try:
        return scout_service.compare_players(db, comparison)
    except SamePlayerComparisonError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error
    except PlayerSeasonStatsNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error
