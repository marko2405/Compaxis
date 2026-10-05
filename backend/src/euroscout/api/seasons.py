from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from euroscout.database.session import get_db
from euroscout.models.season import Season
from euroscout.schemas.season import SeasonResponse
from euroscout.services.season_service import SeasonService

router = APIRouter(prefix="/seasons", tags=["Seasons"])
season_service = SeasonService()
DatabaseSession = Annotated[Session, Depends(get_db)]


@router.get("", response_model=list[SeasonResponse])
def get_seasons(db: DatabaseSession) -> list[Season]:
    return season_service.get_all_seasons(db)
