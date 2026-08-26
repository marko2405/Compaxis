import unittest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from euroscout.database.base import Base
from euroscout.main import app
from euroscout.models.player import Player
from euroscout.models.player_season_stats import PlayerSeasonStats
from euroscout.models.season import Season
from euroscout.models.team import Team
from euroscout.services.player_service import PlayerService


class PlayerSearchTests(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(self.engine)
        self._seed_players()

    def tearDown(self) -> None:
        self.engine.dispose()

    def test_matches_partial_first_and_last_names_case_insensitively(self) -> None:
        service = PlayerService()

        with Session(self.engine) as session:
            first_name_matches = service.search_players(session, query="NIK", limit=8)
            last_name_matches = service.search_players(session, query="miro", limit=8)

        self.assertEqual([item.last_name for item in first_name_matches], ["Mirotic"])
        self.assertEqual([item.first_name for item in last_name_matches], ["Nikola"])
        self.assertEqual(last_name_matches[0].team_name, "Test Team")

    def test_matches_partial_full_name(self) -> None:
        service = PlayerService()

        with Session(self.engine) as session:
            results = service.search_players(session, query="kola miro", limit=8)

        self.assertEqual([item.player_id for item in results], [1])

    def test_returns_empty_for_queries_shorter_than_two_characters(self) -> None:
        service = PlayerService()

        with Session(self.engine) as session:
            results = service.search_players(session, query="n", limit=8)

        self.assertEqual(results, [])

    def test_respects_result_limit(self) -> None:
        service = PlayerService()

        with Session(self.engine) as session:
            results = service.search_players(session, query="player", limit=3)

        self.assertEqual(len(results), 3)

    def test_endpoint_rejects_limit_above_ten(self) -> None:
        response = TestClient(app).get(
            "/players/search", params={"q": "mi", "limit": 11}
        )

        self.assertEqual(response.status_code, 422)

    def _seed_players(self) -> None:
        with Session(self.engine) as session:
            season = Season(code="E2024", name="2024/2025")
            team = Team(external_id="TEAM", name="Test Team")
            session.add_all([season, team])
            session.flush()

            players = [
                Player(external_id="P1", first_name="Nikola", last_name="Mirotic"),
                *[
                    Player(
                        external_id=f"P{index}",
                        first_name="Test",
                        last_name=f"Player {index}",
                    )
                    for index in range(2, 8)
                ],
            ]
            session.add_all(players)
            session.flush()

            for player in players:
                session.add(
                    PlayerSeasonStats(
                        player_id=player.id,
                        team_id=team.id,
                        season_id=season.id,
                    )
                )

            session.commit()


if __name__ == "__main__":
    unittest.main()
