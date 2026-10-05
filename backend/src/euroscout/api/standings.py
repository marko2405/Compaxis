from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from euroscout.database.session import get_db
from euroscout.schemas.standing import StandingsResponse
from euroscout.services.season_service import SeasonService
from euroscout.services.standing_service import StandingService

router = APIRouter(
    prefix="/standings",
    tags=["Standings"],
)

standing_service = StandingService()
season_service = SeasonService()
DatabaseSession = Annotated[Session, Depends(get_db)]


@router.get(
    "",
    response_model=StandingsResponse,
)
def get_standings(
    db: DatabaseSession,
    season_code: str | None = None,
) -> StandingsResponse:
    resolved_season_code = season_service.resolve_season_code(db, season_code)
    if resolved_season_code is None:
        return StandingsResponse(season_code="", items=[])
    return standing_service.get_standings(db, season_code=resolved_season_code)
