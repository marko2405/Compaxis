import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { StandingsTable } from "@/components/standings/standings-table";
import { getSeasons } from "@/services/season-service";
import { getStandings } from "@/services/standing-service";
import { resolveSeasonCode } from "@/lib/season-selection";

type StandingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function StandingsPage({ searchParams }: StandingsPageProps) {
  const params = await searchParams;
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

  const seasonCode = await resolveSeasonCode(seasons, readSingleValue(params.season_code));
  if (!seasonCode) return <Alert severity="info" variant="outlined">No seasons are available yet.</Alert>;
  let standings;
  try {
    standings = await getStandings(seasonCode);
  } catch {
    standings = null;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Stack direction="row" sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Typography component="h1" variant="h1">Standings</Typography>
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          Official EuroLeague regular-season table and team records.
        </Typography>
      </Box>

      {standings ? (
        standings.items.length > 0 ? (
          <StandingsTable items={standings.items} seasonCode={seasonCode} />
        ) : (
          <Alert severity="info" variant="outlined">Standings have not been imported for this season.</Alert>
        )
      ) : (
        <Alert severity="error" variant="outlined">
          Standings are currently unavailable. Check that the API is running and try again.
        </Alert>
      )}
    </Stack>
  );
}

function readSingleValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
