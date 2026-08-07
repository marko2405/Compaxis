import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from euroscout.database.base import Base
from euroscout.models.player import Player
from euroscout.models.player_season_stats import PlayerSeasonStats
from euroscout.models.season import Season
from euroscout.models.team import Team
from euroscout.services.player_service import PlayerService


class PlayerLeaderboardPaginationTests(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(self.engine)
        self._seed_leaderboard()

    def tearDown(self) -> None:
        self.engine.dispose()

    def test_paginates_and_preserves_global_sort_order(self) -> None:
        service = PlayerService()

        with Session(self.engine) as session:
            page_one = service.get_leaderboard(
                session,
                season_code="E2024",
                sort_by="pir",
                order="desc",
                page=1,
                page_size=15,
            )
            page_two = service.get_leaderboard(
                session,
                season_code="E2024",
                sort_by="pir",
                order="desc",
                page=2,
                page_size=15,
            )

        self.assertEqual(page_one.total_items, 45)
        self.assertEqual(page_one.total_pages, 3)
        self.assertEqual(page_one.page_size, 15)
        self.assertEqual(len(page_one.items), 15)
        self.assertEqual(len(page_two.items), 15)
        self.assertNotEqual(
            [player.player_id for player in page_one.items],
            [player.player_id for player in page_two.items],
        )
        self.assertGreater(
            page_one.items[-1].pir_per_game,
            page_two.items[0].pir_per_game,
        )
        self.assertEqual(page_one.items[0].pir_per_game, 45.0)
        self.assertEqual(page_two.items[0].pir_per_game, 30.0)

    def test_last_page_contains_only_remaining_players(self) -> None:
        service = PlayerService()

        with Session(self.engine) as session:
            last_page = service.get_leaderboard(
                session,
                season_code="E2024",
                sort_by="points",
                order="asc",
                page=3,
                page_size=15,
            )

        self.assertEqual(last_page.total_items, 45)
        self.assertEqual(last_page.total_pages, 3)
        self.assertEqual(len(last_page.items), 15)
        self.assertEqual(last_page.items[0].points_per_game, 31.0)

    def _seed_leaderboard(self) -> None:
        with Session(self.engine) as session:
            season = Season(code="E2024", name="2024/2025")
            team = Team(external_id="TEAM", name="Test Team")
            session.add_all([season, team])
            session.flush()

            for index in range(1, 46):
                player = Player(
                    external_id=f"P{index}",
                    first_name="Player",
                    last_name=str(index),
                )
                session.add(player)
                session.flush()
                session.add(
                    PlayerSeasonStats(
                        player_id=player.id,
                        team_id=team.id,
                        season_id=season.id,
                        games_played=20,
                        minutes_per_game=float(index),
                        points_per_game=float(index),
                        rebounds_per_game=float(index),
                        assists_per_game=float(index),
                        steals_per_game=float(index),
                        blocks_per_game=float(index),
                        turnovers_per_game=float(index),
                        two_point_percentage=float(index),
                        three_point_percentage=float(index),
                        free_throw_percentage=float(index),
                        pir_per_game=float(index),
                    )
                )

            session.commit()


if __name__ == "__main__":
    unittest.main()
