import type { StandingItem, Standings } from "@/types/standing";

const DEFAULT_API_URL = "http://127.0.0.1:8000";

export class StandingServiceError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "StandingServiceError";
    this.status = status;
  }
}

export async function getStandings(seasonCode: string): Promise<Standings> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
  const url = new URL("/standings", apiUrl);
  url.searchParams.set("season_code", seasonCode);

  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store" });
  } catch {
    throw new StandingServiceError("The standings service is unavailable.");
  }

  if (!response.ok) {
    throw new StandingServiceError(
      `The standings request failed with status ${response.status}.`,
      response.status,
    );
  }

  const payload: unknown = await response.json();
  if (!isStandings(payload)) {
    throw new StandingServiceError("The standings response is invalid.");
  }
  return payload;
}

function isStandings(value: unknown): value is Standings {
  return (
    isRecord(value) &&
    isString(value.season_code) &&
    Array.isArray(value.items) &&
    value.items.every(isStandingItem)
  );
}

function isStandingItem(value: unknown): value is StandingItem {
  return (
    isRecord(value) &&
    isNumber(value.rank) &&
    isNumber(value.team_id) &&
    isString(value.external_id) &&
    isString(value.team_name) &&
    isNullableString(value.team_logo_url) &&
    isNumber(value.games_played) &&
    isNumber(value.wins) &&
    isNumber(value.losses) &&
    isNumber(value.win_percentage) &&
    isNumber(value.points_for) &&
    isNumber(value.points_against) &&
    isNumber(value.point_differential)
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

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
