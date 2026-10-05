"use client";

import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { LeaderboardAvatar } from "@/components/players/leaderboard-avatar";
import type { PlayerLeaderboardEntry } from "@/types/player";

type PerformerMetric = "pir_per_game" | "points_per_game" | "assists_per_game";

type PerformerPreviewProps = {
  metric: PerformerMetric;
  players: PlayerLeaderboardEntry[] | null;
  seasonCode: string;
  title: string;
};

export function PerformerPreview({ metric, players, seasonCode, title }: PerformerPreviewProps) {
  return (
    <Card sx={{ height: "100%", minWidth: 0 }}>
      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", p: 2 }}>
          <Typography component="h2" variant="h3">{title}</Typography>
          <Link href={`/players?season_code=${encodeURIComponent(seasonCode)}&sort_by=${metricToSort(metric)}&order=desc&page=1`} sx={{ alignItems: "center", display: "inline-flex", fontSize: "0.8rem", fontWeight: 700, gap: 0.25 }} underline="hover">
            View all <ArrowForwardRounded sx={{ fontSize: 16 }} />
          </Link>
        </Stack>
        <Divider />

        {players === null ? (
          <StateMessage>Leaderboard unavailable</StateMessage>
        ) : players.length === 0 ? (
          <StateMessage>No player data available</StateMessage>
        ) : (
          <Stack divider={<Divider flexItem />}>
            {players.map((player, index) => (
              <Link color="inherit" href={`/players/${player.player_id}?season_code=${encodeURIComponent(seasonCode)}`} key={player.player_id} sx={{ "&:hover": { backgroundColor: "action.hover" }, display: "block", px: 2, py: 1.25, textDecoration: "none" }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}>
                  <Typography color="text.secondary" sx={{ flexShrink: 0, fontSize: "0.75rem", fontWeight: 700, width: 16 }}>{index + 1}</Typography>
                  <LeaderboardAvatar alt="" fallback={player.first_name.charAt(0)} size={34} src={player.image_url} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography noWrap sx={{ fontSize: "0.875rem", fontWeight: 700 }}>{player.first_name} {player.last_name}</Typography>
                    <Typography color="text.secondary" noWrap variant="caption">{player.team_name}</Typography>
                  </Box>
                  <Typography sx={{ color: "primary.main", flexShrink: 0, fontSize: "0.95rem", fontWeight: 800 }}>{player[metric].toFixed(1)}</Typography>
                </Stack>
              </Link>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

function metricToSort(metric: PerformerMetric): "pir" | "points" | "assists" {
  if (metric === "points_per_game") return "points";
  if (metric === "assists_per_game") return "assists";
  return "pir";
}

function StateMessage({ children }: { children: React.ReactNode }) {
  return <Typography color="text.secondary" sx={{ px: 2, py: 4, textAlign: "center" }} variant="body2">{children}</Typography>;
}
