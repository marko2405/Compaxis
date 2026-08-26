import unittest
from typing import Any

import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from euroscout.clients.euroleague_client import _resolve_multi_team_rows
from euroscout.database.base import Base
from euroscout.services.import_service import ImportService


class FakeBoxScoreClient:
    def get_gamecodes_season(self, season: int) -> pd.DataFrame:
        return pd.DataFrame(
            [
                {
                    "gameCode": 1,
                    "homecode": "AAA",
                    "awaycode": "BBB",
                    "played": True,
                },
                {
                    "gameCode": 2,
                    "homecode": "CCC",
                    "awaycode": "DDD",
                    "played": True,
                },
            ]
        )

    def get_players_boxscore_stats(self, season: int, gamecode: int) -> pd.DataFrame:
        appearances = {
            1: [{"Player_ID": "P001", "Team": "BBB"}],
            2: [{"Player_ID": "P002", "Team": "CCC"}],
        }
        return pd.DataFrame(appearances[gamecode])


class MalformedImportClient:
    def get_player_stats_for_season(self, season: int) -> list[dict[str, Any]]:
        return [
            {
                "player.code": "001",
                "player.name": "PLAYER, TEST",
                "player.team.code": "AAA;BBB",
                "player.team.name": "Team A;Team B",
                "player.team.imageUrl": "a.png;b.png",
            }
        ]


class ImportTeamMembershipTests(unittest.TestCase):
    def test_resolves_each_membership_from_latest_boxscore_not_list_position(
        self,
    ) -> None:
        rows = [
            _multi_team_row("001", "AAA;BBB", "Team A;Team B", "a.png;b.png"),
            _multi_team_row("002", "CCC;DDD", "Team C;Team D", "c.png;d.png"),
        ]

        resolved = _resolve_multi_team_rows(rows, 2024, FakeBoxScoreClient())  # type: ignore[arg-type]

        self.assertEqual(resolved[0]["player.team.code"], "BBB")
        self.assertEqual(resolved[0]["player.team.name"], "Team B")
        self.assertEqual(resolved[0]["player.team.imageUrl"], "b.png")
        self.assertEqual(resolved[1]["player.team.code"], "CCC")
        self.assertEqual(resolved[1]["player.team.name"], "Team C")
        self.assertEqual(resolved[1]["player.team.imageUrl"], "c.png")

    def test_import_rejects_unresolved_multi_team_identity(self) -> None:
        engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(engine)

        try:
            with (
                Session(engine) as session,
                self.assertRaisesRegex(
                    ValueError,
                    "Multiple teams are not valid",
                ),
            ):
                ImportService(
                    client=MalformedImportClient()
                ).import_player_stats_for_season(  # type: ignore[arg-type]
                    session,
                    2024,
                )
        finally:
            engine.dispose()


def _multi_team_row(
    player_code: str,
    team_codes: str,
    team_names: str,
    logo_urls: str,
) -> dict[str, Any]:
    return {
        "player.code": player_code,
        "player.team.code": team_codes,
        "player.team.tvCodes": team_codes,
        "player.team.name": team_names,
        "player.team.imageUrl": logo_urls,
    }


if __name__ == "__main__":
    unittest.main()
