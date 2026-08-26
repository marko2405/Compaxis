import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { notFound } from "next/navigation";

import { TeamProfileHeader } from "@/components/teams/team-profile-header";
import { TeamRosterTable } from "@/components/teams/team-roster-table";
import { getTeamProfile, TeamServiceError } from "@/services/team-service";
import type { TeamProfile } from "@/types/team";

const SEASON_CODE = "E2024";

export default async function TeamProfilePage({ params }: { params: Promise<{ team_id: string }> }) {
  const { team_id: teamIdParam } = await params;
  const teamId = Number(teamIdParam);
  if (!Number.isInteger(teamId) || teamId < 1) notFound();

  let team: TeamProfile | null = null;
  try {
    team = await getTeamProfile(teamId, SEASON_CODE);
  } catch (error) {
    if (error instanceof TeamServiceError && error.status === 404) notFound();
  }

  if (!team) {
    return (
      <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
        <Alert severity="error" variant="outlined">
          This team profile is currently unavailable. Check that the API is running and try again.
        </Alert>
        <Button href="/teams">Back to Teams</Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <TeamProfileHeader team={team} />
      <TeamRosterTable roster={team.roster} />
    </Stack>
  );
}
