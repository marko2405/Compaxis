import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { LeaderboardAvatar } from "@/components/players/leaderboard-avatar";
import type { TeamListItem } from "@/types/team";

export function TeamCard({ team }: { team: TeamListItem }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea
        href={`/teams/${team.team_id}`}
        sx={{ height: "100%", p: 2 }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <LeaderboardAvatar
            alt={`${team.name} logo`}
            fallback={<GroupsOutlinedIcon />}
            size={54}
            src={team.logo_url}
            variant="rounded"
          />
          <Stack spacing={0.25} sx={{ minWidth: 0 }}>
            <Typography noWrap sx={{ fontWeight: 700 }} variant="body1">
              {team.name}
            </Typography>
            {team.country ? (
              <Typography color="text.secondary" noWrap variant="caption">
                {team.country}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
