import Alert from "@mui/material/Alert";

import { ScoutComparison } from "@/components/scout/scout-comparison";
import { getSeasonPlayers } from "@/services/player-service";
import { getSeasons } from "@/services/season-service";
import { resolveSeasonCode } from "@/lib/season-selection";

type ScoutPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ScoutPage({ searchParams }: ScoutPageProps) {
  const query = await searchParams;
  const seasons = await getSeasons().catch(() => null);
  if (seasons === null) return <Alert severity="error" variant="outlined">Seasons are currently unavailable.</Alert>;
  const seasonCode = await resolveSeasonCode(seasons, readSingleValue(query.season_code));
  if (!seasonCode) return <Alert severity="info" variant="outlined">No seasons are available yet.</Alert>;
  const playerA = parsePlayerId(readSingleValue(query.playerA));
  const playerB = parsePlayerId(readSingleValue(query.playerB));
  const queryError =
    playerA.invalid || playerB.invalid
      ? "The preselected player ID is invalid. Choose a player from the list."
      : null;

  const players = await getAvailablePlayers(seasonCode);
  if (players === null) {
    return (
      <Alert severity="error" variant="outlined">
        Player data is currently unavailable. Check that the API is running and try
        again.
      </Alert>
    );
  }

  return (
    <ScoutComparison
      initialPlayerAId={playerA.value}
      initialPlayerBId={playerB.value}
      initialQueryError={queryError}
      players={players}
      seasonCode={seasonCode}
    />
  );
}

async function getAvailablePlayers(seasonCode: string) {
  try {
    return await getSeasonPlayers(seasonCode);
  } catch {
    return null;
  }
}

function readSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePlayerId(value: string | undefined): {
  invalid: boolean;
  value: number | null;
} {
  if (value === undefined) return { invalid: false, value: null };
  const playerId = Number(value);
  return Number.isInteger(playerId) && playerId >= 1
    ? { invalid: false, value: playerId }
    : { invalid: true, value: null };
}
