from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from euroscout.database.session import get_db
from euroscout.schemas.team import TeamListResponse, TeamProfileResponse, TeamResponse
from euroscout.services.team_service import TeamService

router = APIRouter(
    prefix="/teams",
    tags=["Teams"],
)

team_service = TeamService()

DatabaseSession = Annotated[Session, Depends(get_db)]


@router.get(
    "",
    response_model=list[TeamListResponse],
)
def get_teams(db: DatabaseSession) -> list[TeamListResponse]:
    return team_service.get_team_list(db)


@router.get(
    "/{team_id}/profile",
    response_model=TeamProfileResponse,
)
def get_team_profile(
    team_id: int,
    db: DatabaseSession,
    season_code: str = "E2024",
) -> TeamProfileResponse:
    profile = team_service.get_profile(
        db,
        team_id=team_id,
        season_code=season_code,
    )
    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team profile not found for the selected season.",
        )

    return profile


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
