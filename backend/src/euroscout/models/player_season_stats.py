from sqlalchemy import Float, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from euroscout.database.base import Base


class PlayerSeasonStats(Base):
    __tablename__ = "player_season_stats"
    __table_args__ = (
        UniqueConstraint(
            "player_id",
            "team_id",
            "season_id",
            name="uq_player_team_season",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    player_id: Mapped[int] = mapped_column(
        ForeignKey("players.id"),
        nullable=False,
    )
    team_id: Mapped[int] = mapped_column(
        ForeignKey("teams.id"),
        nullable=False,
    )
    season_id: Mapped[int] = mapped_column(
        ForeignKey("seasons.id"),
        nullable=False,
    )

    games_played: Mapped[int] = mapped_column(Integer, default=0)
    minutes_per_game: Mapped[float] = mapped_column(Float, default=0)

    points_per_game: Mapped[float] = mapped_column(Float, default=0)
    rebounds_per_game: Mapped[float] = mapped_column(Float, default=0)
    assists_per_game: Mapped[float] = mapped_column(Float, default=0)
    steals_per_game: Mapped[float] = mapped_column(Float, default=0)
    blocks_per_game: Mapped[float] = mapped_column(Float, default=0)
    turnovers_per_game: Mapped[float] = mapped_column(Float, default=0)

    two_point_percentage: Mapped[float] = mapped_column(Float, default=0)
    three_point_percentage: Mapped[float] = mapped_column(Float, default=0)
    free_throw_percentage: Mapped[float] = mapped_column(Float, default=0)

    pir_per_game: Mapped[float] = mapped_column(Float, default=0)