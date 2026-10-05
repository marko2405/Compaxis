import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { notFound } from "next/navigation";

import { PlayerProfile } from "@/components/players/player-profile";
import {
  getPlayerProfile,
  PlayerServiceError,
} from "@/services/player-service";
import { getSeasons } from "@/services/season-service";
import { resolveSeasonCode } from "@/lib/season-selection";
import {
  playerLeaderboardSorts,
  type PlayerLeaderboardOrder,
  type PlayerLeaderboardSort,
  type PlayerProfile as PlayerProfileData,
} from "@/types/player";

type PlayerProfilePageProps = {
  params: Promise<{ player_id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PlayerProfilePage({
  params,
  searchParams,
}: PlayerProfilePageProps) {
  const { player_id: playerIdParam } = await params;
  const query = await searchParams;
  const playerId = parsePlayerId(playerIdParam);

  if (playerId === null) {
    notFound();
  }

  let seasons;
  try {
    seasons = await getSeasons();
  } catch {
    seasons = null;
  }

  if (seasons === null) {
    return <Alert severity="error" variant="outlined">Seasons are currently unavailable. Check that the API is running and try again.</Alert>;
  }
  if (seasons.length === 0) {
    return <Alert severity="info" variant="outlined">No seasons are available yet.</Alert>;
  }

  const seasonCode = await resolveSeasonCode(seasons, readSingleValue(query.season_code));
  if (!seasonCode) return <Alert severity="info" variant="outlined">No seasons are available yet.</Alert>;

  let player: PlayerProfileData | null = null;

  try {
    player = await getPlayerProfile(playerId, seasonCode);
  } catch (error) {
    if (error instanceof PlayerServiceError && error.status === 404) {
      notFound();
    }
  }

  if (player === null) {
    return (
      <Stack spacing={2}>
        <Alert severity="error" variant="outlined">
          This player profile is currently unavailable. Check that the API is
          running and try again.
        </Alert>
        <Button href={buildBackHref(query, seasonCode)} sx={{ alignSelf: "flex-start" }}>
          Back to Players
        </Button>
      </Stack>
    );
  }

  return (
    <PlayerProfile
      backHref={buildBackHref(query, seasonCode)}
      player={player}
    />
  );
}

function buildBackHref(
  query: Record<string, string | string[] | undefined>,
  seasonCode: string,
): string {
  const sortBy = parseSort(readSingleValue(query.return_sort_by));
  const order = parseOrder(readSingleValue(query.return_order));
  const page = parsePositiveInteger(readSingleValue(query.return_page), 1);
  const pageSize = Math.min(
    parsePositiveInteger(readSingleValue(query.return_page_size), 15),
    20,
  );
  const params = new URLSearchParams({
    season_code: seasonCode,
    sort_by: sortBy,
    order,
    page: page.toString(),
    page_size: pageSize.toString(),
  });

  return `/players?${params.toString()}`;
}

function parsePlayerId(value: string): number | null {
  const playerId = Number(value);
  return Number.isInteger(playerId) && playerId >= 1 ? playerId : null;
}

function readSingleValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseSort(value: string | undefined): PlayerLeaderboardSort {
  return playerLeaderboardSorts.includes(value as PlayerLeaderboardSort)
    ? (value as PlayerLeaderboardSort)
    : "pir";
}

function parseOrder(value: string | undefined): PlayerLeaderboardOrder {
  return value === "asc" ? "asc" : "desc";
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : fallback;
}
