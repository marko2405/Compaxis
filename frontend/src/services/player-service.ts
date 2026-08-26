import type {
  PaginatedPlayerLeaderboard,
  PlayerLeaderboardEntry,
  PlayerLeaderboardQuery,
  PlayerProfile,
  PlayerSearchResult,
} from "@/types/player";

const DEFAULT_API_URL = "http://127.0.0.1:8000";

export class PlayerServiceError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "PlayerServiceError";
    this.status = status;
  }
}

export async function getPlayerLeaderboard(
  query: PlayerLeaderboardQuery,
): Promise<PaginatedPlayerLeaderboard> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
  const url = new URL("/players/leaderboard", apiUrl);

  url.searchParams.set("season_code", query.seasonCode);
  url.searchParams.set("sort_by", query.sortBy);
  url.searchParams.set("order", query.order);
  url.searchParams.set("page", query.page.toString());
  url.searchParams.set("page_size", query.pageSize.toString());

  let response: Response;

  try {
    response = await fetch(url, { cache: "no-store" });
  } catch {
    throw new PlayerServiceError("The leaderboard service is unavailable.");
  }

  if (!response.ok) {
    throw new PlayerServiceError(
      `The leaderboard request failed with status ${response.status}.`,
      response.status,
    );
  }

  const payload: unknown = await response.json();

  if (!isPaginatedPlayerLeaderboard(payload)) {
    throw new PlayerServiceError("The leaderboard response is invalid.");
  }

  return payload;
}

export async function searchPlayers(
  query: string,
  options: { limit?: number; signal?: AbortSignal } = {},
): Promise<PlayerSearchResult[]> {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 2) return [];

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
  const url = new URL("/players/search", apiUrl);
  url.searchParams.set("q", normalizedQuery);
  url.searchParams.set("limit", (options.limit ?? 8).toString());

  let response: Response;

  try {
    response = await fetch(url, { cache: "no-store", signal: options.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new PlayerServiceError("Player search is unavailable.");
  }

  if (!response.ok) {
    throw new PlayerServiceError(
      `The player search request failed with status ${response.status}.`,
      response.status,
    );
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload) || !payload.every(isPlayerSearchResult)) {
    throw new PlayerServiceError("The player search response is invalid.");
  }

  return payload;
}

export async function getSeasonPlayers(
  seasonCode: string,
): Promise<PlayerLeaderboardEntry[]> {
  const firstPage = await getPlayerLeaderboard({
    seasonCode,
    sortBy: "pir",
    order: "desc",
    page: 1,
    pageSize: 20,
  });

  if (firstPage.total_pages <= 1) {
    return firstPage.items;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.total_pages - 1 }, (_, index) =>
      getPlayerLeaderboard({
        seasonCode,
        sortBy: "pir",
        order: "desc",
        page: index + 2,
        pageSize: 20,
      }),
    ),
  );

  return [firstPage, ...remainingPages].flatMap((page) => page.items);
}

export async function getPlayerProfile(
  playerId: number,
  seasonCode: string,
): Promise<PlayerProfile> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
  const url = new URL(`/players/${playerId}/profile`, apiUrl);
  url.searchParams.set("season_code", seasonCode);

  let response: Response;

  try {
    response = await fetch(url, { cache: "no-store" });
  } catch {
    throw new PlayerServiceError("The player profile service is unavailable.");
  }

  if (!response.ok) {
    throw new PlayerServiceError(
      `The player profile request failed with status ${response.status}.`,
      response.status,
    );
  }

  const payload: unknown = await response.json();

  if (!isPlayerLeaderboardEntry(payload)) {
    throw new PlayerServiceError("The player profile response is invalid.");
  }

  return payload;
}

function isPaginatedPlayerLeaderboard(
  value: unknown,
): value is PaginatedPlayerLeaderboard {
  return (
    isRecord(value) &&
    Array.isArray(value.items) &&
    value.items.every(isPlayerLeaderboardEntry) &&
    isInteger(value.page) &&
    isInteger(value.page_size) &&
    isInteger(value.total_items) &&
    isInteger(value.total_pages)
  );
}

function isPlayerLeaderboardEntry(
  value: unknown,
): value is PlayerLeaderboardEntry {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNumber(value.player_id) &&
    isString(value.external_id) &&
    isString(value.first_name) &&
    isString(value.last_name) &&
    isNullableString(value.image_url) &&
    isNumber(value.team_id) &&
    isString(value.team_name) &&
    isNullableString(value.team_logo_url) &&
    isString(value.season_code) &&
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

function isPlayerSearchResult(value: unknown): value is PlayerSearchResult {
  return (
    isRecord(value) &&
    isNumber(value.player_id) &&
    isString(value.first_name) &&
    isString(value.last_name) &&
    isNullableString(value.image_url) &&
    isNullableNumber(value.team_id) &&
    isNullableString(value.team_name) &&
    isNullableString(value.team_logo_url)
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

function isNullableNumber(value: unknown): value is number | null {
  return value === null || isNumber(value);
}

function isInteger(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value);
}
