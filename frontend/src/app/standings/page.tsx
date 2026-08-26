import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { StandingsTable } from "@/components/standings/standings-table";
import { formatSeasonCode } from "@/lib/format-season-code";
import { getStandings } from "@/services/standing-service";

const SEASON_CODE = "E2024";

export default async function StandingsPage() {
  let standings;
  try {
    standings = await getStandings(SEASON_CODE);
  } catch {
    standings = null;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Stack direction="row" sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Typography component="h1" variant="h1">Standings</Typography>
          <Chip label={formatSeasonCode(SEASON_CODE)} size="small" variant="outlined" />
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          Official EuroLeague regular-season table and team records.
        </Typography>
      </Box>

      {standings ? (
        standings.items.length > 0 ? (
          <StandingsTable items={standings.items} />
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
