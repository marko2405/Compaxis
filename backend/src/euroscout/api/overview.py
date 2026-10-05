from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from euroscout.database.session import get_db
from euroscout.schemas.overview import OverviewResponse
from euroscout.services.overview_service import OverviewService
from euroscout.services.season_service import SeasonService

router = APIRouter(prefix="/overview", tags=["Overview"])
overview_service = OverviewService()
season_service = SeasonService()
DatabaseSession = Annotated[Session, Depends(get_db)]


@router.get("", response_model=OverviewResponse)
def get_overview(
    db: DatabaseSession,
    season_code: str | None = None,
) -> OverviewResponse:
    resolved_code = season_service.resolve_season_code(db, season_code)
    if resolved_code is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No seasons are available.")

    overview = overview_service.get_overview(db, season_code=resolved_code)
    if overview is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Season not found.")
    return overview
