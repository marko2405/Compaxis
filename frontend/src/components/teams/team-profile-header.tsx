import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { LeaderboardAvatar } from "@/components/players/leaderboard-avatar";
import { formatSeasonCode } from "@/lib/format-season-code";
import type { TeamProfile } from "@/types/team";

export function TeamProfileHeader({ team }: { team: TeamProfile }) {
  return (
    <Box>
      <Button href="/teams" startIcon={<ArrowBackOutlinedIcon />} sx={{ mb: 1.5 }}>
        Back to Teams
      </Button>
      <Paper sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Stack direction={{ xs: "column", sm: "row" }} sx={{ alignItems: { sm: "center" }, gap: 2.5 }}>
          <LeaderboardAvatar
            alt={`${team.name} logo`}
            fallback={<GroupsOutlinedIcon sx={{ fontSize: 36 }} />}
            size={96}
            src={team.logo_url}
            variant="rounded"
          />
          <Box sx={{ minWidth: 0 }}>
            <Chip label={formatSeasonCode(team.season_code)} size="small" sx={{ mb: 1 }} variant="outlined" />
            <Typography component="h1" variant="h1">
              {team.name}
            </Typography>
            {team.country ? (
              <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                {team.country}
              </Typography>
            ) : null}
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
