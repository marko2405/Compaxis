import unittest

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from euroscout.api.teams import get_team_profile
from euroscout.database.base import Base
from euroscout.models.player import Player
from euroscout.models.player_season_stats import PlayerSeasonStats
from euroscout.models.season import Season
from euroscout.models.team import Team
from euroscout.services.team_service import TeamService


class TeamProfileTests(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(self.engine)
        self._seed_data()

    def tearDown(self) -> None:
        self.engine.dispose()

    def test_returns_only_selected_team_and_season_roster_sorted_by_pir(self) -> None:
        service = TeamService()

        with Session(self.engine) as session:
            profile = service.get_profile(
                session,
                team_id=1,
                season_code="E2024",
            )

        self.assertIsNotNone(profile)
        assert profile is not None
        self.assertEqual(profile.team_id, 1)
        self.assertEqual(profile.season_code, "E2024")
        self.assertEqual(
            [player.last_name for player in profile.roster],
            ["High PIR", "Low PIR"],
        )
        self.assertEqual(
            [player.pir_per_game for player in profile.roster], [20.0, 8.0]
        )

    def test_returns_404_when_team_has_no_data_for_selected_season(self) -> None:
        with (
            Session(self.engine) as session,
            self.assertRaises(HTTPException) as raised,
        ):
            get_team_profile(team_id=2, db=session, season_code="E2024")

        self.assertEqual(raised.exception.status_code, 404)

    def _seed_data(self) -> None:
        with Session(self.engine) as session:
            current = Season(code="E2024", name="2024/2025")
            previous = Season(code="E2023", name="2023/2024")
            team_a = Team(external_id="A", name="Team A")
            team_b = Team(external_id="B", name="Team B")
            session.add_all([current, previous, team_a, team_b])
            session.flush()

            high_pir = Player(
                external_id="P1", first_name="Player", last_name="High PIR"
            )
            low_pir = Player(external_id="P2", first_name="Player", last_name="Low PIR")
            other_team = Player(external_id="P3", first_name="Other", last_name="Team")
            old_season = Player(external_id="P4", first_name="Old", last_name="Season")
            session.add_all([high_pir, low_pir, other_team, old_season])
            session.flush()

            session.add_all(
                [
                    _stats(high_pir.id, team_a.id, current.id, pir=20.0),
                    _stats(low_pir.id, team_a.id, current.id, pir=8.0),
                    _stats(other_team.id, team_b.id, previous.id, pir=30.0),
                    _stats(old_season.id, team_a.id, previous.id, pir=40.0),
                ]
            )
            session.commit()


def _stats(
    player_id: int,
    team_id: int,
    season_id: int,
    *,
    pir: float,
) -> PlayerSeasonStats:
    return PlayerSeasonStats(
        player_id=player_id,
        team_id=team_id,
        season_id=season_id,
        games_played=20,
        minutes_per_game=18.0,
        points_per_game=10.0,
        rebounds_per_game=4.0,
        assists_per_game=3.0,
        steals_per_game=1.0,
        blocks_per_game=0.5,
        turnovers_per_game=2.0,
        two_point_percentage=50.0,
        three_point_percentage=35.0,
        free_throw_percentage=80.0,
        pir_per_game=pir,
    )


if __name__ == "__main__":
    unittest.main()
