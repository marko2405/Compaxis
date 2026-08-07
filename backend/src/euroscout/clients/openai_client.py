import json
from typing import Any

from openai import OpenAI, OpenAIError

from euroscout.schemas.scout import ScoutAnalysis


class OpenAIClientError(RuntimeError):
    pass


class OpenAIClient:
    def __init__(self, *, api_key: str, model: str) -> None:
        self._client = OpenAI(api_key=api_key, timeout=30)
        self._model = model

    def generate_scout_analysis(
        self,
        comparison_data: dict[str, Any],
        instructions: str,
    ) -> ScoutAnalysis:
        try:
            response = self._client.responses.parse(
                model=self._model,
                instructions=instructions,
                input=json.dumps(comparison_data),
                text_format=ScoutAnalysis,
            )
        except OpenAIError as error:
            raise OpenAIClientError("OpenAI request failed") from error

        if response.output_parsed is None:
            raise OpenAIClientError("OpenAI returned no structured analysis")

        return response.output_parsed
