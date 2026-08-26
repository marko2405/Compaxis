import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { TeamCard } from "@/components/teams/team-card";
import { formatSeasonCode } from "@/lib/format-season-code";
import { getTeams } from "@/services/team-service";

const SEASON_CODE = "E2024";

export default async function TeamsPage() {
  let teams;
  try {
    teams = await getTeams();
  } catch {
    teams = null;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Stack direction="row" sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Typography component="h1" variant="h1">Teams</Typography>
          <Chip label={formatSeasonCode(SEASON_CODE)} size="small" variant="outlined" />
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          Browse EuroLeague teams and inspect their season rosters.
        </Typography>
      </Box>

      {teams ? (
        teams.length > 0 ? (
          <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" } }}>
            {teams.map((team) => <TeamCard key={team.team_id} team={team} />)}
          </Box>
        ) : (
          <Alert severity="info" variant="outlined">No teams are available.</Alert>
        )
      ) : (
        <Alert severity="error" variant="outlined">
          Teams are currently unavailable. Check that the API is running and try again.
        </Alert>
      )}
    </Stack>
  );
}
