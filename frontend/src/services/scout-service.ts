import type {
  ComparedPlayer,
  PlayerComparisonDifferences,
  ScoutAnalysis,
  ScoutComparisonRequest,
  ScoutComparisonResponse,
} from "@/types/scout";

const DEFAULT_API_URL = "http://127.0.0.1:8000";

export class ScoutServiceError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ScoutServiceError";
    this.status = status;
  }
}

export async function comparePlayers(
  comparison: ScoutComparisonRequest,
): Promise<ScoutComparisonResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
  const url = new URL("/scout/compare", apiUrl);
  let response: Response;

  try {
    response = await fetch(url, {
      body: JSON.stringify(comparison),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
  } catch {
    throw new ScoutServiceError("The Scout service is unavailable.");
  }

  if (!response.ok) {
    if (response.status === 503) {
      throw new ScoutServiceError(
        "AI analysis is temporarily unavailable. Please try again shortly.",
        response.status,
      );
    }

    const detail = await readErrorDetail(response);
    throw new ScoutServiceError(
      detail ?? `The comparison request failed with status ${response.status}.`,
      response.status,
    );
  }

  const payload: unknown = await response.json();
  if (!isScoutComparisonResponse(payload)) {
    throw new ScoutServiceError("The Scout response is invalid.");
  }

  return payload;
}

async function readErrorDetail(response: Response): Promise<string | null> {
  try {
    const payload: unknown = await response.json();
    return isRecord(payload) && isString(payload.detail) ? payload.detail : null;
  } catch {
    return null;
  }
}

function isScoutComparisonResponse(
  value: unknown,
): value is ScoutComparisonResponse {
  return (
    isRecord(value) &&
    isString(value.season_code) &&
    isComparedPlayer(value.player_a) &&
    isComparedPlayer(value.player_b) &&
    isDifferences(value.differences) &&
    isAnalysis(value.analysis)
  );
}

const metricKeys = [
  "minutes_per_game",
  "points_per_game",
  "rebounds_per_game",
  "assists_per_game",
  "steals_per_game",
  "blocks_per_game",
  "turnovers_per_game",
  "two_point_percentage",
  "three_point_percentage",
  "free_throw_percentage",
  "pir_per_game",
] as const satisfies readonly (keyof PlayerComparisonDifferences)[];

function isComparedPlayer(value: unknown): value is ComparedPlayer {
  return (
    isRecord(value) &&
    isNumber(value.player_id) &&
    isString(value.external_id) &&
    isString(value.first_name) &&
    isString(value.last_name) &&
    isNullableString(value.image_url) &&
    isNumber(value.team_id) &&
    isString(value.team_name) &&
    isNullableString(value.team_logo_url) &&
    isNumber(value.games_played) &&
    metricKeys.every((key) => isNumber(value[key]))
  );
}

function isDifferences(value: unknown): value is PlayerComparisonDifferences {
  return isRecord(value) && metricKeys.every((key) => isNumber(value[key]));
}

function isAnalysis(value: unknown): value is ScoutAnalysis {
  return (
    isRecord(value) &&
    isString(value.summary) &&
    isStringArray(value.player_a_strengths) &&
    isStringArray(value.player_b_strengths) &&
    isStringArray(value.key_differences) &&
    isString(value.conclusion) &&
    isStringArray(value.data_limitations)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNullableString(value: unknown): value is string | null {
  return value === null || isString(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
