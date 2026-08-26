from typing import cast

from sqlalchemy import Select, case, func, select
from sqlalchemy.orm import InstrumentedAttribute, Session

from euroscout.models.player import Player
from euroscout.models.player_season_stats import PlayerSeasonStats
from euroscout.models.season import Season
from euroscout.models.team import Team
from euroscout.schemas.player import PlayerLeaderboardOrder, PlayerLeaderboardSort

PlayerLeaderboardRow = tuple[Player, PlayerSeasonStats, Team, Season]
PlayerSearchRow = tuple[Player, int | None, str | None, str | None]

LEADERBOARD_SORT_COLUMNS: dict[
    PlayerLeaderboardSort,
    InstrumentedAttribute[float],
] = {
    "pir": PlayerSeasonStats.pir_per_game,
    "points": PlayerSeasonStats.points_per_game,
    "rebounds": PlayerSeasonStats.rebounds_per_game,
    "assists": PlayerSeasonStats.assists_per_game,
    "steals": PlayerSeasonStats.steals_per_game,
    "blocks": PlayerSeasonStats.blocks_per_game,
    "turnovers": PlayerSeasonStats.turnovers_per_game,
    "minutes": PlayerSeasonStats.minutes_per_game,
    "two_point_percentage": PlayerSeasonStats.two_point_percentage,
    "three_point_percentage": PlayerSeasonStats.three_point_percentage,
    "free_throw_percentage": PlayerSeasonStats.free_throw_percentage,
}


class PlayerRepository:
    def search(
        self,
        db: Session,
        *,
        query: str,
        limit: int,
    ) -> list[PlayerSearchRow]:
        normalized_query = query.lower()
        contains_pattern = f"%{normalized_query}%"
        prefix_pattern = f"{normalized_query}%"
        full_name = func.lower(Player.first_name + " " + Player.last_name)

        latest_team_id = (
            select(Team.id)
            .join(PlayerSeasonStats, PlayerSeasonStats.team_id == Team.id)
            .join(Season, Season.id == PlayerSeasonStats.season_id)
            .where(PlayerSeasonStats.player_id == Player.id)
            .order_by(Season.code.desc(), PlayerSeasonStats.id.desc())
            .limit(1)
            .correlate(Player)
            .scalar_subquery()
        )
        latest_team_name = (
            select(Team.name)
            .join(PlayerSeasonStats, PlayerSeasonStats.team_id == Team.id)
            .join(Season, Season.id == PlayerSeasonStats.season_id)
            .where(PlayerSeasonStats.player_id == Player.id)
            .order_by(Season.code.desc(), PlayerSeasonStats.id.desc())
            .limit(1)
            .correlate(Player)
            .scalar_subquery()
        )
        latest_team_logo_url = (
            select(Team.logo_url)
            .join(PlayerSeasonStats, PlayerSeasonStats.team_id == Team.id)
            .join(Season, Season.id == PlayerSeasonStats.season_id)
            .where(PlayerSeasonStats.player_id == Player.id)
            .order_by(Season.code.desc(), PlayerSeasonStats.id.desc())
            .limit(1)
            .correlate(Player)
            .scalar_subquery()
        )
        match_rank = case(
            (full_name == normalized_query, 0),
            (func.lower(Player.first_name) == normalized_query, 1),
            (func.lower(Player.last_name) == normalized_query, 1),
            (full_name.like(prefix_pattern), 2),
            (func.lower(Player.first_name).like(prefix_pattern), 2),
            (func.lower(Player.last_name).like(prefix_pattern), 2),
            else_=3,
        )
        statement = (
            select(
                Player,
                latest_team_id,
                latest_team_name,
                latest_team_logo_url,
            )
            .where(
                func.lower(Player.first_name).like(contains_pattern)
                | func.lower(Player.last_name).like(contains_pattern)
                | full_name.like(contains_pattern)
            )
            .order_by(
                match_rank,
                func.lower(Player.last_name),
                func.lower(Player.first_name),
                Player.id,
            )
            .limit(limit)
        )

        rows = db.execute(statement).tuples().all()
        return cast(list[PlayerSearchRow], rows)

    def _player_season_statement(
        self,
    ) -> Select[tuple[Player, PlayerSeasonStats, Team, Season]]:
        return (
            select(Player, PlayerSeasonStats, Team, Season)
            .join(PlayerSeasonStats, PlayerSeasonStats.player_id == Player.id)
            .join(Team, Team.id == PlayerSeasonStats.team_id)
            .join(Season, Season.id == PlayerSeasonStats.season_id)
        )

    def get_leaderboard(
        self,
        db: Session,
        *,
        season_code: str,
        sort_by: PlayerLeaderboardSort,
        order: PlayerLeaderboardOrder,
        page: int,
        page_size: int,
    ) -> list[PlayerLeaderboardRow]:
        sort_column = LEADERBOARD_SORT_COLUMNS[sort_by]
        order_expression = sort_column.desc() if order == "desc" else sort_column.asc()
        statement = (
            self._player_season_statement()
            .where(Season.code == season_code)
            .order_by(order_expression, Player.id.asc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )

        rows = db.execute(statement).tuples().all()
        return cast(list[PlayerLeaderboardRow], rows)

    def count_leaderboard(
        self,
        db: Session,
        *,
        season_code: str,
    ) -> int:
        statement = (
            select(func.count())
            .select_from(PlayerSeasonStats)
            .join(Season, Season.id == PlayerSeasonStats.season_id)
            .where(Season.code == season_code)
        )

        return db.scalar(statement) or 0

    def get_player_season_stats(
        self,
        db: Session,
        *,
        player_id: int,
        season_code: str,
    ) -> PlayerLeaderboardRow | None:
        statement = self._player_season_statement().where(
            Player.id == player_id,
            Season.code == season_code,
        )
        row = db.execute(statement).tuples().one_or_none()

        return cast(PlayerLeaderboardRow | None, row)

    def get_team_roster(
        self,
        db: Session,
        *,
        team_id: int,
        season_code: str,
    ) -> list[PlayerLeaderboardRow]:
        statement = (
            self._player_season_statement()
            .where(
                Team.id == team_id,
                Season.code == season_code,
            )
            .order_by(PlayerSeasonStats.pir_per_game.desc(), Player.id.asc())
        )

        rows = db.execute(statement).tuples().all()
        return cast(list[PlayerLeaderboardRow], rows)

    def get_by_external_id(
        self,
        db: Session,
        external_id: str,
    ) -> Player | None:
        statement = select(Player).where(Player.external_id == external_id)

        return db.scalar(statement)

    def create(
        self,
        db: Session,
        *,
        external_id: str,
        first_name: str,
        last_name: str,
        image_url: str | None,
    ) -> Player:
        player = Player(
            external_id=external_id,
            first_name=first_name,
            last_name=last_name,
            image_url=image_url,
        )
        db.add(player)

        return player

    def update(
        self,
        player: Player,
        *,
        first_name: str,
        last_name: str,
        image_url: str | None,
    ) -> Player:
        player.first_name = first_name
        player.last_name = last_name
        player.image_url = image_url

        return player

    def get_by_id(
        self,
        db: Session,
        player_id: int,
    ) -> Player | None:
        return db.get(Player, player_id)

    def get_all(
        self,
        db: Session,
    ) -> list[Player]:
        statement = select(Player)

        return list(db.scalars(statement).all())
