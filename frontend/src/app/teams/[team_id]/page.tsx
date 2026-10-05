import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { notFound } from "next/navigation";

import { TeamProfileHeader } from "@/components/teams/team-profile-header";
import { TeamRosterTable } from "@/components/teams/team-roster-table";
import { getTeamProfile, TeamServiceError } from "@/services/team-service";
import { getSeasons } from "@/services/season-service";
import { resolveSeasonCode } from "@/lib/season-selection";
import type { TeamProfile } from "@/types/team";

type TeamProfilePageProps = {
  params: Promise<{ team_id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TeamProfilePage({ params, searchParams }: TeamProfilePageProps) {
  const { team_id: teamIdParam } = await params;
  const query = await searchParams;
  const teamId = Number(teamIdParam);
  if (!Number.isInteger(teamId) || teamId < 1) notFound();

  const seasons = await getSeasons().catch(() => null);
  if (seasons === null) return <Alert severity="error" variant="outlined">Seasons are currently unavailable.</Alert>;
  const seasonCode = await resolveSeasonCode(seasons, readSingleValue(query.season_code));
  if (!seasonCode) return <Alert severity="info" variant="outlined">No seasons are available yet.</Alert>;

  let team: TeamProfile | null = null;
  try {
    team = await getTeamProfile(teamId, seasonCode);
  } catch (error) {
    if (error instanceof TeamServiceError && error.status === 404) notFound();
  }

  if (!team) {
    return (
      <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
        <Alert severity="error" variant="outlined">
          This team profile is currently unavailable. Check that the API is running and try again.
        </Alert>
        <Button href={`/teams?season_code=${encodeURIComponent(seasonCode)}`}>Back to Teams</Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <TeamProfileHeader team={team} />
      <TeamRosterTable roster={team.roster} seasonCode={seasonCode} />
    </Stack>
  );
}

function readSingleValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
