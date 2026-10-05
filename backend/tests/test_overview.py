import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from euroscout.database.base import Base
from euroscout.models.player import Player
from euroscout.models.player_season_stats import PlayerSeasonStats
from euroscout.models.season import Season
from euroscout.models.season_team_standing import SeasonTeamStanding
from euroscout.models.team import Team
from euroscout.services.overview_service import OverviewService
from euroscout.services.season_service import SeasonService


class OverviewTests(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(self.engine)

    def tearDown(self) -> None:
        self.engine.dispose()

    def test_latest_season_is_resolved_when_code_is_omitted(self) -> None:
        with Session(self.engine) as session:
            session.add_all(
                [
                    Season(code="E2024", name="2024/25"),
                    Season(code="E2025", name="2025/26"),
                ]
            )
            session.commit()
            code = SeasonService().resolve_season_code(session, None)

        self.assertEqual(code, "E2025")

    def test_overview_uses_only_selected_season(self) -> None:
        with Session(self.engine) as session:
            season = Season(code="E2025", name="2025/26")
            team = Team(external_id="TEAM", name="Test Team")
            player = Player(external_id="P1", first_name="Test", last_name="Player")
            session.add_all([season, team, player])
            session.flush()
            session.add(
                PlayerSeasonStats(
                    player_id=player.id,
                    team_id=team.id,
                    season_id=season.id,
                    games_played=10,
                    points_per_game=20,
                    assists_per_game=5,
                    pir_per_game=25,
                )
            )
            session.add(
                SeasonTeamStanding(
                    season_id=season.id,
                    team_id=team.id,
                    rank=1,
                    games_played=10,
                    wins=8,
                    losses=2,
                    win_percentage=80,
                    points_for=800,
                    points_against=700,
                    point_differential=100,
                )
            )
            session.commit()
            overview = OverviewService().get_overview(session, season_code="E2025")

        self.assertIsNotNone(overview)
        assert overview is not None
        self.assertEqual(overview.player_count, 1)
        self.assertEqual(overview.team_count, 1)
        self.assertEqual(overview.leader.team_name if overview.leader else None, "Test Team")
        self.assertEqual(overview.top_pir[0].player_id, player.id)


if __name__ == "__main__":
    unittest.main()
