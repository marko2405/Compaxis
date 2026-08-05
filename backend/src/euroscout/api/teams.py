from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from euroscout.database.session import get_db
from euroscout.schemas.team import TeamResponse
from euroscout.services.team_service import TeamService

router = APIRouter(
    prefix="/teams",
    tags=["Teams"],
)

team_service = TeamService()

DatabaseSession = Annotated[Session, Depends(get_db)]


@router.get(
    "",
    response_model=list[TeamResponse],
)
def get_teams(db: DatabaseSession) -> list[TeamResponse]:
    teams = team_service.get_all_teams(db)

    return [TeamResponse.model_validate(team) for team in teams]


@router.get(
    "/{team_id}",
    response_model=TeamResponse,
)
def get_team(team_id: int, db: DatabaseSession) -> TeamResponse:
    team = team_service.get_team_by_id(db, team_id)

    if team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found.",
        )

    return TeamResponse.model_validate(team)
