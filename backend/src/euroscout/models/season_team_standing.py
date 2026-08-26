from sqlalchemy import Float, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from euroscout.database.base import Base


class SeasonTeamStanding(Base):
    __tablename__ = "season_team_standings"
    __table_args__ = (
        UniqueConstraint("season_id", "team_id", name="uq_standing_season_team"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    season_id: Mapped[int] = mapped_column(ForeignKey("seasons.id"), nullable=False)
    team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"), nullable=False)
    rank: Mapped[int] = mapped_column(Integer, nullable=False)
    games_played: Mapped[int] = mapped_column(Integer, nullable=False)
    wins: Mapped[int] = mapped_column(Integer, nullable=False)
    losses: Mapped[int] = mapped_column(Integer, nullable=False)
    win_percentage: Mapped[float] = mapped_column(Float, nullable=False)
    points_for: Mapped[int] = mapped_column(Integer, nullable=False)
    points_against: Mapped[int] = mapped_column(Integer, nullable=False)
    point_differential: Mapped[int] = mapped_column(Integer, nullable=False)
