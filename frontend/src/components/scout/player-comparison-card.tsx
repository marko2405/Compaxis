import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { LeaderboardAvatar } from "@/components/players/leaderboard-avatar";
import type { ComparedPlayer } from "@/types/scout";

type PlayerComparisonCardProps = {
  label: "Player A" | "Player B";
  player: ComparedPlayer;
};

export function PlayerComparisonCard({
  label,
  player,
}: PlayerComparisonCardProps) {
  const borderColor = label === "Player A" ? "chart.playerA" : "chart.playerB";

  return (
    <Paper
      sx={{
        borderTop: "4px solid",
        borderTopColor: borderColor,
        height: "100%",
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <LeaderboardAvatar
          alt={`${player.first_name} ${player.last_name}`}
          fallback={`${player.first_name.charAt(0)}${player.last_name.charAt(0)}`}
          size={72}
          src={player.image_url}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography component="h2" variant="h2">
            {player.first_name} {player.last_name}
          </Typography>
          <Stack
            direction="row"
            spacing={0.75}
            sx={{ alignItems: "center", mt: 1 }}
          >
            <LeaderboardAvatar
              alt=""
              fallback={<GroupsOutlinedIcon sx={{ fontSize: 16 }} />}
              size={26}
              src={player.team_logo_url}
              variant="rounded"
            />
            <Typography color="text.secondary" variant="body2">
              {player.team_name}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
