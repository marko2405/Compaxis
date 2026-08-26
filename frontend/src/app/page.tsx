import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { OverviewSummary } from "@/components/overview/overview-summary";
import { PerformerPreview } from "@/components/overview/performer-preview";
import { ScoutQuickAction } from "@/components/overview/scout-quick-action";
import { StandingsLeaderCard } from "@/components/overview/standings-leader-card";
import { formatSeasonCode } from "@/lib/format-season-code";
import { getPlayerLeaderboard } from "@/services/player-service";
import { getStandings } from "@/services/standing-service";
import { getTeams } from "@/services/team-service";
import type { PlayerLeaderboardSort } from "@/types/player";

const SEASON_CODE = "E2024";

function getTopPlayers(sortBy: PlayerLeaderboardSort) {
  return getPlayerLeaderboard({ seasonCode: SEASON_CODE, sortBy, order: "desc", page: 1, pageSize: 5 });
}

function fulfilledValue<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === "fulfilled" ? result.value : null;
}

export default async function OverviewPage() {
  const [pirResult, scorersResult, assistsResult, teamsResult, standingsResult] =
    await Promise.allSettled([
      getTopPlayers("pir"),
      getTopPlayers("points"),
      getTopPlayers("assists"),
      getTeams(),
      getStandings(SEASON_CODE),
    ]);

  const pir = fulfilledValue(pirResult);
  const scorers = fulfilledValue(scorersResult);
  const assists = fulfilledValue(assistsResult);
  const teams = fulfilledValue(teamsResult);
  const standings = fulfilledValue(standingsResult);
  const playerCount = pir?.total_items ?? scorers?.total_items ?? assists?.total_items ?? null;
  const leader = standings?.items[0] ?? null;

  return (
    <Stack spacing={3}>
      <Box>
        <Stack direction="row" sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Typography component="h1" variant="h1">Overview</Typography>
          <Chip label={formatSeasonCode(SEASON_CODE)} size="small" variant="outlined" />
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          EuroLeague scouting and performance snapshot.
        </Typography>
      </Box>

      <OverviewSummary
        leaderName={leader?.team_name ?? null}
        playerCount={playerCount}
        season={formatSeasonCode(SEASON_CODE)}
        teamCount={teams?.length ?? null}
      />

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" } }}>
        <PerformerPreview metric="pir_per_game" players={pir?.items ?? null} title="Top PIR" />
        <PerformerPreview metric="points_per_game" players={scorers?.items ?? null} title="Top Scorers" />
        <PerformerPreview metric="assists_per_game" players={assists?.items ?? null} title="Top Assists" />
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "minmax(0, 3fr) minmax(280px, 2fr)" } }}>
        <StandingsLeaderCard available={standings !== null} leader={leader} />
        <ScoutQuickAction />
      </Box>
    </Stack>
  );
}
