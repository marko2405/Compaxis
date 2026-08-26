import type { TeamListItem, TeamProfile, TeamRosterPlayer } from "@/types/team";

const DEFAULT_API_URL = "http://127.0.0.1:8000";

export class TeamServiceError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "TeamServiceError";
    this.status = status;
  }
}

export async function getTeams(): Promise<TeamListItem[]> {
  const payload = await requestTeams(new URL("/teams", getApiUrl()));
  if (!Array.isArray(payload) || !payload.every(isTeamListItem)) {
    throw new TeamServiceError("The teams response is invalid.");
  }

  return payload;
}

export async function getTeamProfile(
  teamId: number,
  seasonCode: string,
): Promise<TeamProfile> {
  const url = new URL(`/teams/${teamId}/profile`, getApiUrl());
  url.searchParams.set("season_code", seasonCode);
  const payload = await requestTeams(url);

  if (!isTeamProfile(payload)) {
    throw new TeamServiceError("The team profile response is invalid.");
  }

  return payload;
}

async function requestTeams(url: URL): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store" });
  } catch {
    throw new TeamServiceError("The teams service is unavailable.");
  }

  if (!response.ok) {
    throw new TeamServiceError(
      `The teams request failed with status ${response.status}.`,
      response.status,
    );
  }

  return response.json();
}

function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
}

function isTeamListItem(value: unknown): value is TeamListItem {
  return (
    isRecord(value) &&
    isNumber(value.team_id) &&
    isString(value.external_id) &&
    isString(value.name) &&
    isNullableString(value.country) &&
    isNullableString(value.logo_url)
  );
}

function isTeamProfile(value: unknown): value is TeamProfile {
  if (!isRecord(value) || !isTeamListItem(value)) return false;

  const record: Record<string, unknown> = value;
  return (
    isString(record.season_code) &&
    Array.isArray(record.roster) &&
    record.roster.every(isTeamRosterPlayer)
  );
}

function isTeamRosterPlayer(value: unknown): value is TeamRosterPlayer {
  return (
    isRecord(value) &&
    isNumber(value.player_id) &&
    isString(value.external_id) &&
    isString(value.first_name) &&
    isString(value.last_name) &&
    isNullableString(value.image_url) &&
    isNumber(value.games_played) &&
    isNumber(value.minutes_per_game) &&
    isNumber(value.points_per_game) &&
    isNumber(value.rebounds_per_game) &&
    isNumber(value.assists_per_game) &&
    isNumber(value.steals_per_game) &&
    isNumber(value.blocks_per_game) &&
    isNumber(value.turnovers_per_game) &&
    isNumber(value.two_point_percentage) &&
    isNumber(value.three_point_percentage) &&
    isNumber(value.free_throw_percentage) &&
    isNumber(value.pir_per_game)
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
