import unittest
from typing import Any
from unittest.mock import patch

from fastapi import HTTPException

from euroscout.api.scout import compare_players
from euroscout.clients.openai_client import OpenAIClientError
from euroscout.schemas.scout import (
    ComparedPlayerResponse,
    DeterministicPlayerComparison,
    PlayerComparisonDifferences,
    PlayerComparisonRequest,
    ScoutAnalysis,
)
from euroscout.services.scout_analysis_service import (
    SCOUT_ANALYSIS_INSTRUCTIONS,
    ScoutAnalysisService,
    ScoutAnalysisUnavailableError,
)


class SuccessfulOpenAIClient:
    def __init__(self) -> None:
        self.comparison_data: dict[str, Any] | None = None
        self.instructions: str | None = None

    def generate_scout_analysis(
        self,
        comparison_data: dict[str, Any],
        instructions: str,
    ) -> dict[str, Any]:
        self.comparison_data = comparison_data
        self.instructions = instructions
        return {
            "summary": "Kevin Punter provides more scoring.",
            "player_a_strengths": ["Scores 18.4 points per game."],
            "player_b_strengths": ["Creates more with 5.0 assists per game."],
            "key_differences": ["Punter scores 3.2 more points per game."],
            "conclusion": "Punter offers more scoring, while Jones creates more.",
            "data_limitations": ["Only basic box-score statistics are available."],
        }


class FailingOpenAIClient:
    def generate_scout_analysis(
        self,
        comparison_data: dict[str, Any],
        instructions: str,
    ) -> ScoutAnalysis:
        raise OpenAIClientError("API unavailable")


class InvalidOpenAIClient:
    def generate_scout_analysis(
        self,
        comparison_data: dict[str, Any],
        instructions: str,
    ) -> dict[str, Any]:
        return {"summary": "Incomplete response"}


class UnavailableScoutService:
    def compare_players_with_analysis(self, db: Any, comparison: Any) -> None:
        raise ScoutAnalysisUnavailableError("AI analysis is temporarily unavailable.")


class ScoutAnalysisServiceTests(unittest.TestCase):
    def setUp(self) -> None:
        self.comparison = _comparison()

    def test_returns_valid_structured_analysis_from_mocked_client(self) -> None:
        client = SuccessfulOpenAIClient()
        service = ScoutAnalysisService(client)

        result = service.analyze(self.comparison)

        self.assertIsInstance(result, ScoutAnalysis)
        self.assertEqual(
            result.player_a_strengths,
            ["Scores 18.4 points per game."],
        )
        self.assertEqual(client.instructions, SCOUT_ANALYSIS_INSTRUCTIONS)
        self.assertIsNotNone(client.comparison_data)
        assert client.comparison_data is not None
        self.assertEqual(client.comparison_data["player_a_name"], "Kevin Punter")
        self.assertEqual(client.comparison_data["player_b_name"], "Carlik Jones")
        self.assertNotIn("image_url", client.comparison_data["player_a"])
        self.assertNotIn("team_logo_url", client.comparison_data["player_a"])
        self.assertEqual(
            client.comparison_data["differences"]["points_per_game"],
            3.2,
        )
        self.assertIn("2-3 natural sentences", client.instructions)
        self.assertIn("no more than 3 concise data limitations", client.instructions)
        self.assertIn("Never write\nplayer names in all caps", client.instructions)
        self.assertIn('or call them "Player A" or "Player B"', client.instructions)

    def test_maps_openai_failure_to_application_exception(self) -> None:
        service = ScoutAnalysisService(FailingOpenAIClient())

        with self.assertRaisesRegex(
            ScoutAnalysisUnavailableError,
            "AI analysis is temporarily unavailable",
        ):
            service.analyze(self.comparison)

    def test_rejects_invalid_structured_response(self) -> None:
        service = ScoutAnalysisService(InvalidOpenAIClient())

        with self.assertRaises(ScoutAnalysisUnavailableError):
            service.analyze(self.comparison)

    def test_maps_analysis_failure_to_http_503(self) -> None:
        request = PlayerComparisonRequest(
            season_code="E2024",
            player_a_id=1,
            player_b_id=2,
        )

        with (
            patch(
                "euroscout.api.scout.scout_service",
                UnavailableScoutService(),
            ),
            self.assertRaises(HTTPException) as raised,
        ):
            compare_players(request, object())  # type: ignore[arg-type]

        self.assertEqual(raised.exception.status_code, 503)
        self.assertEqual(
            raised.exception.detail,
            "AI analysis is temporarily unavailable.",
        )


def _comparison() -> DeterministicPlayerComparison:
    player_a = _player(
        player_id=1,
        first_name="KEVIN",
        last_name="PUNTER",
        points=18.4,
        assists=3.1,
    )
    player_b = _player(
        player_id=2,
        first_name="CARLIK",
        last_name="JONES",
        points=15.2,
        assists=5.0,
    )

    return DeterministicPlayerComparison(
        season_code="E2024",
        player_a=player_a,
        player_b=player_b,
        differences=PlayerComparisonDifferences(
            minutes_per_game=2.1,
            points_per_game=3.2,
            rebounds_per_game=1.0,
            assists_per_game=-1.9,
            steals_per_game=0.2,
            blocks_per_game=0.1,
            turnovers_per_game=0.4,
            two_point_percentage=2.5,
            three_point_percentage=-1.2,
            free_throw_percentage=3.0,
            pir_per_game=4.2,
        ),
    )


def _player(
    *,
    player_id: int,
    first_name: str,
    last_name: str,
    points: float,
    assists: float,
) -> ComparedPlayerResponse:
    return ComparedPlayerResponse(
        player_id=player_id,
        external_id=f"P{player_id}",
        first_name=first_name,
        last_name=last_name,
        image_url="https://example.com/player.png",
        team_id=player_id,
        team_name=f"Team {player_id}",
        team_logo_url="https://example.com/team.png",
        games_played=20,
        minutes_per_game=25.0,
        points_per_game=points,
        rebounds_per_game=6.0,
        assists_per_game=assists,
        steals_per_game=1.0,
        blocks_per_game=0.5,
        turnovers_per_game=2.0,
        two_point_percentage=55.0,
        three_point_percentage=38.0,
        free_throw_percentage=82.0,
        pir_per_game=19.0,
    )


if __name__ == "__main__":
    unittest.main()
