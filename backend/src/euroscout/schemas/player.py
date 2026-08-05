from datetime import date

from pydantic import BaseModel, ConfigDict


class PlayerResponse(BaseModel):
    id: int
    external_id: str
    first_name: str
    last_name: str
    birth_date: date | None
    height_cm: int | None
    position: str | None
    nationality: str | None
    image_url: str | None

    model_config = ConfigDict(from_attributes=True)
