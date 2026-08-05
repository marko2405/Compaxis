from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from euroscout.database.base import Base


class Team(Base):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(primary_key=True)
    external_id: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    country: Mapped[str | None] = mapped_column(String(100))
    logo_url: Mapped[str | None] = mapped_column(String(500))