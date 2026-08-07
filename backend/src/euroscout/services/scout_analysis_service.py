from typing import Any, Protocol

from pydantic import ValidationError

from euroscout.clients.openai_client import OpenAIClient, OpenAIClientError
from euroscout.core.config import settings
from euroscout.schemas.scout import (
    ComparedPlayerResponse,
    DeterministicPlayerComparison,
    ScoutAnalysis,
)

SCOUT_ANALYSIS_INSTRUCTIONS = """You are a basketball scouting analyst.
Base every claim only on the supplied statistics.
Do not invent injuries, salaries, contracts, personality, tactical role, position,
nationality, or advanced metrics.
Do not claim that basic box-score statistics provide a complete professional
scouting evaluation.
Write natural, concise, human-sounding scouting analysis.
Use the title-cased names supplied in player_a_name and player_b_name. Never write
player names in all caps or call them "Player A" or "Player B".
Write the summary in 2-3 natural sentences. Avoid formulas, repetitive comparisons,
"higher overall performance index", and "the choice between them depends on".
Keep every strength brief and specific. Retain useful supporting numbers such as
points, assists, shooting percentages, and PIR.
Describe key differences in plain language, not subtraction formulas. Use last names
when that reads naturally, and express shooting gaps as percentage points.
Write a 2-3 sentence scouting-style conclusion that distinguishes the statistical
profiles. Do not add unsupported tactical claims.
Return no more than 3 concise data limitations, choosing only the most important.
The supplied differences equal player_a minus player_b; use them only to interpret
the direction and size of each gap, never state this formula in the analysis.
When playing time or sample size is limited, avoid strong conclusions.
"""


class ScoutAnalysisClient(Protocol):
    def generate_scout_analysis(
        self,
        comparison_data: dict[str, Any],
        instructions: str,
    ) -> ScoutAnalysis | dict[str, Any]: ...


class ScoutAnalysisUnavailableError(RuntimeError):
    pass


class ScoutAnalysisService:
    def __init__(self, client: ScoutAnalysisClient | None = None) -> None:
        self._client = client

    def analyze(self, comparison: DeterministicPlayerComparison) -> ScoutAnalysis:
        client = self._client or self._create_client()

        try:
            result = client.generate_scout_analysis(
                _build_analysis_input(comparison),
                SCOUT_ANALYSIS_INSTRUCTIONS,
            )
            return ScoutAnalysis.model_validate(result)
        except (OpenAIClientError, ValidationError) as error:
            raise ScoutAnalysisUnavailableError(
                "AI analysis is temporarily unavailable."
            ) from error

    def _create_client(self) -> OpenAIClient:
        if not settings.openai_api_key or not settings.openai_model:
            raise ScoutAnalysisUnavailableError(
                "AI analysis is temporarily unavailable."
            )

        return OpenAIClient(
            api_key=settings.openai_api_key,
            model=settings.openai_model,
        )


def _build_analysis_input(
    comparison: DeterministicPlayerComparison,
) -> dict[str, Any]:
    return {
        "season_code": comparison.season_code,
        "player_a_name": _player_full_name(comparison.player_a),
        "player_b_name": _player_full_name(comparison.player_b),
        "player_a": _player_analysis_data(comparison.player_a),
        "player_b": _player_analysis_data(comparison.player_b),
        "differences": comparison.differences.model_dump(),
    }


def _player_full_name(player: ComparedPlayerResponse) -> str:
    return f"{player.first_name} {player.last_name}".strip().title()


def _player_analysis_data(player: ComparedPlayerResponse) -> dict[str, Any]:
    return {
        "player_id": player.player_id,
        "external_id": player.external_id,
        "first_name": player.first_name,
        "last_name": player.last_name,
        "team_id": player.team_id,
        "team_name": player.team_name,
        "games_played": player.games_played,
        "minutes_per_game": player.minutes_per_game,
        "points_per_game": player.points_per_game,
        "rebounds_per_game": player.rebounds_per_game,
        "assists_per_game": player.assists_per_game,
        "steals_per_game": player.steals_per_game,
        "blocks_per_game": player.blocks_per_game,
        "turnovers_per_game": player.turnovers_per_game,
        "two_point_percentage": player.two_point_percentage,
        "three_point_percentage": player.three_point_percentage,
        "free_throw_percentage": player.free_throw_percentage,
        "pir_per_game": player.pir_per_game,
    }
