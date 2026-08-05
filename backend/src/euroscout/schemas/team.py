from pydantic import BaseModel, ConfigDict


class TeamResponse(BaseModel):
    id: int
    external_id: str
    name: str
    country: str | None
    logo_url: str | None

    model_config = ConfigDict(from_attributes=True)
