import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from euroscout.database.base import Base
from euroscout.models.player import Player
from euroscout.models.player_season_stats import PlayerSeasonStats
from euroscout.models.season import Season
from euroscout.models.team import Team
from euroscout.services.season_service import SeasonService
from euroscout.services.team_service import TeamService


class SeasonsAndTeamFilterTests(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(self.engine)

    def tearDown(self) -> None:
        self.engine.dispose()

    def test_seasons_are_returned_newest_first(self) -> None:
        with Session(self.engine) as session:
            session.add_all(
                [
                    Season(code="E2023", name="2023/2024"),
                    Season(code="E2025", name="2025/2026"),
                    Season(code="E2024", name="2024/2025"),
                ]
            )
            session.commit()

            seasons = SeasonService().get_all_seasons(session)

        self.assertEqual([season.code for season in seasons], ["E2025", "E2024", "E2023"])

    def test_team_list_can_be_filtered_by_season(self) -> None:
        with Session(self.engine) as session:
            old_season = Season(code="E2024", name="2024/2025")
            new_season = Season(code="E2025", name="2025/2026")
            old_team = Team(external_id="OLD", name="Old Team")
            new_team = Team(external_id="NEW", name="New Team")
            old_player = Player(external_id="P1", first_name="Old", last_name="Player")
            new_player = Player(external_id="P2", first_name="New", last_name="Player")
            session.add_all([old_season, new_season, old_team, new_team, old_player, new_player])
            session.flush()
            session.add_all(
                [
                    PlayerSeasonStats(player_id=old_player.id, team_id=old_team.id, season_id=old_season.id),
                    PlayerSeasonStats(player_id=new_player.id, team_id=new_team.id, season_id=new_season.id),
                ]
            )
            session.commit()

            teams = TeamService().get_team_list(session, season_code="E2025")

        self.assertEqual([team.name for team in teams], ["New Team"])


if __name__ == "__main__":
    unittest.main()
