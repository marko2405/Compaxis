from fastapi import APIRouter

from euroscout.schemas.standing import StandingResponse
from euroscout.services.standing_service import StandingService

router = APIRouter(
    prefix="/standings",
    tags=["Standings"],
)

standing_service = StandingService()


@router.get(
    "",
    response_model=list[StandingResponse],
)
def get_standings() -> list[StandingResponse]:
    return standing_service.get_standings()
