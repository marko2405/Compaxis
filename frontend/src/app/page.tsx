import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { OverviewSummary } from "@/components/overview/overview-summary";
import { PerformerPreview } from "@/components/overview/performer-preview";
import { ScoutQuickAction } from "@/components/overview/scout-quick-action";
import { StandingsLeaderCard } from "@/components/overview/standings-leader-card";
import { formatSeasonCode } from "@/lib/format-season-code";
import { getOverview } from "@/services/overview-service";
import { getSeasons } from "@/services/season-service";
import { resolveSeasonCode } from "@/lib/season-selection";

type OverviewPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OverviewPage({ searchParams }: OverviewPageProps) {
  const params = await searchParams;
  let seasons;

  try {
    seasons = await getSeasons();
  } catch {
    seasons = null;
  }

  if (seasons === null) {
    return <OverviewState severity="error">Seasons are currently unavailable. Check that the API is running and try again.</OverviewState>;
  }

  if (seasons.length === 0) {
    return <OverviewState severity="info">No seasons are available yet.</OverviewState>;
  }

  const seasonCode = await resolveSeasonCode(seasons, readSingleValue(params.season_code));
  if (!seasonCode) return <OverviewState severity="info">No seasons are available yet.</OverviewState>;
  const selectedSeason = seasons.find((season) => season.code === seasonCode) ?? seasons[0];

  const overview = await getOverview(seasonCode).catch(() => null);
  const leader = overview?.leader ?? null;

  return (
    <Stack spacing={3}>
      <Box>
        <Stack direction="row" sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Typography component="h1" variant="h1">Overview</Typography>
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          EuroLeague scouting and performance snapshot.
        </Typography>
      </Box>

      <OverviewSummary
        leaderName={leader?.team_name ?? null}
        playerCount={overview?.player_count ?? null}
        season={overview?.season_name || selectedSeason.name || formatSeasonCode(seasonCode)}
        teamCount={overview?.team_count ?? null}
      />

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" } }}>
        <PerformerPreview metric="pir_per_game" players={overview?.top_pir ?? null} seasonCode={seasonCode} title="Top PIR" />
        <PerformerPreview metric="points_per_game" players={overview?.top_scorers ?? null} seasonCode={seasonCode} title="Top Scorers" />
        <PerformerPreview metric="assists_per_game" players={overview?.top_assists ?? null} seasonCode={seasonCode} title="Top Assists" />
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "minmax(0, 3fr) minmax(280px, 2fr)" } }}>
        <StandingsLeaderCard available={overview !== null} leader={leader} seasonCode={seasonCode} />
        <ScoutQuickAction />
      </Box>


    </Stack>
  );
}

function readSingleValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function OverviewState({ children, severity }: { children: React.ReactNode; severity: "error" | "info" }) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography component="h1" variant="h1">Overview</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          EuroLeague scouting and performance snapshot.
        </Typography>
      </Box>
      <Alert severity={severity} variant="outlined">{children}</Alert>
    </Stack>
  );
}
