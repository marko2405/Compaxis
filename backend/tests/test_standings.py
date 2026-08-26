import unittest
from typing import Any

from sqlalchemy import create_engine, func, select
from sqlalchemy.orm import Session

from euroscout.clients.standings_client import UpstreamStanding, _to_upstream_standing
from euroscout.database.base import Base
from euroscout.models.season import Season
from euroscout.models.season_team_standing import SeasonTeamStanding
from euroscout.models.team import Team
from euroscout.services.standing_service import StandingService

OFFICIAL_E2024 = [
    ("OLY", 24, 10, 70.6, 2941, 2770, 171),
    ("ULK", 23, 11, 67.6, 2829, 2760, 69),
    ("PAN", 22, 12, 64.7, 2990, 2843, 147),
    ("MCO", 21, 13, 61.8, 2913, 2801, 112),
    ("BAR", 20, 14, 58.8, 2966, 2837, 129),
    ("IST", 20, 14, 58.8, 2941, 2788, 153),
    ("MAD", 20, 14, 58.8, 2870, 2797, 73),
    ("PRS", 19, 15, 55.9, 2940, 2910, 30),
    ("MUN", 19, 15, 55.9, 2965, 2984, -19),
    ("RED", 18, 16, 52.9, 2776, 2714, 62),
    ("MIL", 17, 17, 50.0, 2896, 2934, -38),
    ("PAR", 16, 18, 47.1, 2780, 2724, 56),
    ("ZAL", 15, 19, 44.1, 2626, 2669, -43),
    ("BAS", 14, 20, 41.2, 2795, 2830, -35),
    ("ASV", 13, 21, 38.2, 2740, 2897, -157),
    ("TEL", 11, 23, 32.4, 2921, 3052, -131),
    ("VIR", 9, 25, 26.5, 2683, 2834, -151),
    ("BER", 5, 29, 14.7, 2646, 3074, -428),
]


class FakeStandingsClient:
    def get_standings(self, season: int, round_number: int) -> list[UpstreamStanding]:
        return [
            UpstreamStanding(
                rank=rank,
                team_external_id=code,
                games_played=34,
                wins=wins,
                losses=losses,
                win_percentage=win_percentage,
                points_for=points_for,
                points_against=points_against,
                point_differential=differential,
            )
            for rank, (
                code,
                wins,
                losses,
                win_percentage,
                points_for,
                points_against,
                differential,
            ) in enumerate(OFFICIAL_E2024, start=1)
        ]


class StandingsTests(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(self.engine)
        with Session(self.engine) as session:
            session.add(Season(code="E2024", name="2024/25"))
            session.add_all(
                Team(external_id=code, name=f"Team {code}")
                for code, *_ in OFFICIAL_E2024
            )
            session.commit()

    def tearDown(self) -> None:
        self.engine.dispose()

    def test_sync_maps_all_18_teams_and_preserves_official_rank_order(self) -> None:
        service = StandingService(client=FakeStandingsClient())  # type: ignore[arg-type]
        with Session(self.engine) as session:
            synced = service.sync(session, season=2024, round_number=34)
            session.commit()
            response = service.get_standings(session, season_code="E2024")

        self.assertEqual(synced, 18)
        self.assertEqual(len(response.items), 18)
        self.assertEqual([item.rank for item in response.items], list(range(1, 19)))
        self.assertEqual(
            [item.external_id for item in response.items],
            [row[0] for row in OFFICIAL_E2024],
        )
        self.assertEqual(response.items[0].wins, 24)
        self.assertEqual(response.items[0].point_differential, 171)
        self.assertEqual(response.items[-1].losses, 29)
        self.assertEqual(response.items[-1].point_differential, -428)

    def test_sync_is_idempotent(self) -> None:
        service = StandingService(client=FakeStandingsClient())  # type: ignore[arg-type]
        with Session(self.engine) as session:
            service.sync(session, season=2024, round_number=34)
            session.commit()
            service.sync(session, season=2024, round_number=34)
            session.commit()
            count = session.scalar(select(func.count()).select_from(SeasonTeamStanding))

        self.assertEqual(count, 18)

    def test_returns_empty_response_before_standings_are_imported(self) -> None:
        with Session(self.engine) as session:
            response = StandingService(client=FakeStandingsClient()).get_standings(  # type: ignore[arg-type]
                session, season_code="E2024"
            )
        self.assertEqual(response.items, [])

    def test_parses_official_percentage_and_signed_difference(self) -> None:
        row: dict[str, Any] = {
            "position": 1,
            "club.code": "OLY",
            "gamesPlayed": 34,
            "gamesWon": 24,
            "gamesLost": 10,
            "winPercentage": "70.6%",
            "pointsFor": 2941,
            "pointsAgainst": 2770,
            "pointsDifference": "+171",
        }
        parsed = _to_upstream_standing(row)
        self.assertEqual(parsed.win_percentage, 70.6)
        self.assertEqual(parsed.point_differential, 171)


if __name__ == "__main__":
    unittest.main()
