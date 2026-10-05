import type { Overview } from "@/types/overview";
import { isPlayerLeaderboardEntry } from "@/services/player-service";
import { isStandingItem } from "@/services/standing-service";
import { getApiUrl } from "@/services/api-url";

export async function getOverview(seasonCode: string): Promise<Overview> {
  const url = new URL("/overview", getApiUrl());
  url.searchParams.set("season_code", seasonCode);

  const response = await fetch(url, { cache: "no-store" }).catch(() => null);
  if (!response?.ok) throw new Error("Overview is unavailable.");

  const payload: unknown = await response.json();
  if (!isOverview(payload)) throw new Error("Overview response is invalid.");
  return payload;
}

function isOverview(value: unknown): value is Overview {
  if (typeof value !== "object" || value === null) return false;
  const overview = value as Record<string, unknown>;
  return (
    typeof overview.season_code === "string" &&
    typeof overview.season_name === "string" &&
    Number.isInteger(overview.player_count) &&
    Number.isInteger(overview.team_count) &&
    (overview.leader === null || isStandingItem(overview.leader)) &&
    isPlayerList(overview.top_pir) &&
    isPlayerList(overview.top_scorers) &&
    isPlayerList(overview.top_assists)
  );
}

function isPlayerList(value: unknown): boolean {
  return Array.isArray(value) && value.every(isPlayerLeaderboardEntry);
}
