from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from euroscout.models.player_season_stats import PlayerSeasonStats


class PlayerSeasonStatsRepository:
    def get_by_player_team_season(
        self,
        db: Session,
        *,
        player_id: int,
        team_id: int,
        season_id: int,
    ) -> PlayerSeasonStats | None:
        statement = select(PlayerSeasonStats).where(
            PlayerSeasonStats.player_id == player_id,
            PlayerSeasonStats.team_id == team_id,
            PlayerSeasonStats.season_id == season_id,
        )

        return db.scalar(statement)

    def create(
        self,
        db: Session,
        *,
        player_id: int,
        team_id: int,
        season_id: int,
        values: dict[str, Any],
    ) -> PlayerSeasonStats:
        stats = PlayerSeasonStats(
            player_id=player_id,
            team_id=team_id,
            season_id=season_id,
            **values,
        )
        db.add(stats)

        return stats

    def update(
        self,
        stats: PlayerSeasonStats,
        *,
        values: dict[str, Any],
    ) -> PlayerSeasonStats:
        for field, value in values.items():
            setattr(stats, field, value)

        return stats
