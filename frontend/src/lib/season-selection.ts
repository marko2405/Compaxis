import "server-only";

import { cookies } from "next/headers";

import type { Season } from "@/types/season";

export const SEASON_COOKIE = "euroscout_season";

export async function resolveSeasonCode(
  seasons: Season[],
  requestedCode?: string,
): Promise<string | null> {
  if (seasons.length === 0) return null;

  const cookieCode = (await cookies()).get(SEASON_COOKIE)?.value;
  return (
    seasons.find((season) => season.code === requestedCode)?.code ??
    seasons.find((season) => season.code === cookieCode)?.code ??
    seasons[0].code
  );
}
