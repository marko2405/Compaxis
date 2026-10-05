import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { LeaderboardAvatar } from "@/components/players/leaderboard-avatar";
import type { StandingItem } from "@/types/standing";

type StandingsLeaderCardProps = { available: boolean; leader: StandingItem | null; seasonCode: string };

export function StandingsLeaderCard({ available, leader, seasonCode }: StandingsLeaderCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Typography color="text.secondary" sx={{ fontWeight: 700 }} variant="overline">Standings leader</Typography>
        {!available ? (
          <Typography color="text.secondary" sx={{ mt: 2 }} variant="body2">Standings are currently unavailable.</Typography>
        ) : !leader ? (
          <Typography color="text.secondary" sx={{ mt: 2 }} variant="body2">No standings are available for this season.</Typography>
        ) : (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { xs: "flex-start", sm: "center" }, mt: 1.5 }}>
            <LeaderboardAvatar alt={`${leader.team_name} logo`} fallback={leader.team_name.charAt(0)} size={64} src={leader.team_logo_url} variant="rounded" />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography component="h2" variant="h2">{leader.team_name}</Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 0.75 }}>
                <Typography color="text.secondary" variant="body2"><Box component="span" sx={{ color: "text.primary", fontWeight: 800 }}>{leader.wins}-{leader.losses}</Box> record</Typography>
                <Typography color="text.secondary" variant="body2"><Box component="span" sx={{ color: "text.primary", fontWeight: 800 }}>{leader.win_percentage.toFixed(1)}%</Box> win rate</Typography>
              </Stack>
            </Box>
            <Link href={`/teams/${leader.team_id}?season_code=${encodeURIComponent(seasonCode)}`} sx={{ alignItems: "center", display: "inline-flex", flexShrink: 0, fontWeight: 700, gap: 0.25 }} underline="hover">
              Team profile <ArrowForwardRounded fontSize="small" />
            </Link>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
