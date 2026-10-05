import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { TeamCard } from "@/components/teams/team-card";
import { getSeasons } from "@/services/season-service";
import { getTeams } from "@/services/team-service";
import { resolveSeasonCode } from "@/lib/season-selection";

type TeamsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TeamsPage({ searchParams }: TeamsPageProps) {
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
  let teams;
  try {
    teams = await getTeams(seasonCode);
  } catch {
    teams = null;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Stack direction="row" sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Typography component="h1" variant="h1">Teams</Typography>
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          Browse EuroLeague teams and inspect their season rosters.
        </Typography>
      </Box>

      {teams ? (
        teams.length > 0 ? (
          <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" } }}>
            {teams.map((team) => <TeamCard key={team.team_id} seasonCode={seasonCode} team={team} />)}
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

function readSingleValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
