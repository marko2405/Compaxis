import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { PlayerProfile as PlayerProfileData } from "@/types/player";

import { LeaderboardAvatar } from "./leaderboard-avatar";

type PlayerProfileProps = {
  backHref: string;
  player: PlayerProfileData;
};

export function PlayerProfile({ backHref, player }: PlayerProfileProps) {
  const primaryMetrics = [
    { label: "GP", value: player.games_played.toString() },
    { label: "MPG", value: formatPerGame(player.minutes_per_game) },
    { label: "PPG", value: formatPerGame(player.points_per_game) },
    { label: "RPG", value: formatPerGame(player.rebounds_per_game) },
    { label: "APG", value: formatPerGame(player.assists_per_game) },
    { label: "PIR", value: formatPerGame(player.pir_per_game), emphasized: true },
  ];
  const shootingMetrics = [
    { label: "2P%", value: formatPercentage(player.two_point_percentage) },
    { label: "3P%", value: formatPercentage(player.three_point_percentage) },
    { label: "FT%", value: formatPercentage(player.free_throw_percentage) },
  ];
  const contributionMetrics = [
    { label: "SPG", value: formatPerGame(player.steals_per_game) },
    { label: "BPG", value: formatPerGame(player.blocks_per_game) },
    { label: "TO/G", value: formatPerGame(player.turnovers_per_game) },
  ];

  return (
    <Stack spacing={3}>
      <Box>
        <Button
          href={backHref}
          startIcon={<ArrowBackOutlinedIcon />}
          sx={{ mb: 1.5 }}
          variant="text"
        >
          Back to Players
        </Button>
        <Paper sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{ alignItems: { sm: "center" }, gap: 2.5 }}
          >
            <LeaderboardAvatar
              alt={`${player.first_name} ${player.last_name}`}
              fallback={`${player.first_name.charAt(0)}${player.last_name.charAt(0)}`}
              size={96}
              src={player.image_url}
            />
            <Box sx={{ flex: 1 }}>
              <Typography component="h1" variant="h1">
                {player.first_name} {player.last_name}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", mt: 1.25 }}
              >
                <LeaderboardAvatar
                  alt=""
                  fallback={<GroupsOutlinedIcon sx={{ fontSize: 18 }} />}
                  size={32}
                  src={player.team_logo_url}
                  variant="rounded"
                />
                <Typography color="text.secondary" variant="body2">
                  {player.team_name}
                </Typography>
              </Stack>
            </Box>
            <Button
              color="secondary"
              href={`/scout?playerA=${player.player_id}&season_code=${encodeURIComponent(player.season_code)}`}
              startIcon={<AutoAwesomeOutlinedIcon />}
              variant="contained"
            >
              Compare Player
            </Button>
          </Stack>
        </Paper>
      </Box>

      <MetricSection metrics={primaryMetrics} title="Season production" />
      <MetricSection metrics={shootingMetrics} title="Shooting" />
      <MetricSection metrics={contributionMetrics} title="Additional contribution" />
    </Stack>
  );
}

type Metric = {
  emphasized?: boolean;
  label: string;
  value: string;
};

function MetricSection({ metrics, title }: { metrics: Metric[]; title: string }) {
  return (
    <Box component="section">
      <Typography sx={{ mb: 1.5 }} variant="h3">
        {title}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: `repeat(${Math.min(metrics.length, 3)}, minmax(0, 1fr))`,
            lg: `repeat(${metrics.length}, minmax(0, 1fr))`,
          },
        }}
      >
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Typography color="text.secondary" variant="caption">
                {metric.label}
              </Typography>
              <Typography
                color={metric.emphasized ? "primary.main" : "text.primary"}
                sx={{ fontWeight: 750, mt: 0.5 }}
                variant="h2"
              >
                {metric.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

function formatPerGame(value: number): string {
  return value.toFixed(1);
}

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
