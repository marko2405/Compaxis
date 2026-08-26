from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from euroscout.database.session import get_db
from euroscout.schemas.standing import StandingsResponse
from euroscout.services.standing_service import StandingService

router = APIRouter(
    prefix="/standings",
    tags=["Standings"],
)

standing_service = StandingService()
DatabaseSession = Annotated[Session, Depends(get_db)]


@router.get(
    "",
    response_model=StandingsResponse,
)
def get_standings(
    db: DatabaseSession,
    season_code: str = "E2024",
) -> StandingsResponse:
    return standing_service.get_standings(db, season_code=season_code)
