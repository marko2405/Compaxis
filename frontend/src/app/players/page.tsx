import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { LeaderboardControls } from "@/components/players/leaderboard-controls";
import { LeaderboardPagination } from "@/components/players/leaderboard-pagination";
import { PlayerLeaderboardTable } from "@/components/players/player-leaderboard-table";
import { getPlayerLeaderboard } from "@/services/player-service";
import { getSeasons } from "@/services/season-service";
import { resolveSeasonCode } from "@/lib/season-selection";
import {
  playerLeaderboardSorts,
  type PlayerLeaderboardOrder,
  type PlayerLeaderboardSort,
} from "@/types/player";

type PlayersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const PAGE_SIZE = 15;

export default async function PlayersPage({ searchParams }: PlayersPageProps) {
  const params = await searchParams;
  let seasons;

  try {
    seasons = await getSeasons();
  } catch {
    seasons = null;
  }

  if (seasons === null) {
    return <PageState severity="error">Seasons are currently unavailable. Check that the API is running and try again.</PageState>;
  }

  if (seasons.length === 0) {
    return <PageState severity="info">No seasons are available yet.</PageState>;
  }

  const seasonCode = await resolveSeasonCode(seasons, readSingleValue(params.season_code));
  if (!seasonCode) return <PageState severity="info">No seasons are available yet.</PageState>;
  const sortBy = parseSort(readSingleValue(params.sort_by));
  const order = parseOrder(readSingleValue(params.order));
  const page = parsePage(readSingleValue(params.page));

  let leaderboard;

  try {
    leaderboard = await getPlayerLeaderboard({
      seasonCode,
      sortBy,
      order,
      page,
      pageSize: PAGE_SIZE,
    });
  } catch {
    leaderboard = null;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography component="h1" variant="h1">
          Players
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body1">
          Compare EuroLeague player production across the selected season.
        </Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <LeaderboardControls
          order={order}
          page={page}
          pageSize={PAGE_SIZE}
          sortBy={sortBy}
        />
      </Paper>

      {leaderboard ? (
        <Stack spacing={2}>
          <PlayerLeaderboardTable
            order={order}
            page={leaderboard.page}
            pageSize={leaderboard.page_size}
            players={leaderboard.items}
            seasonCode={seasonCode}
            sortBy={sortBy}
          />
          <LeaderboardPagination
            order={order}
            page={leaderboard.page}
            pageSize={leaderboard.page_size}
            seasonCode={seasonCode}
            sortBy={sortBy}
            totalPages={leaderboard.total_pages}
          />
        </Stack>
      ) : (
        <Alert severity="error" variant="outlined">
          The player leaderboard is currently unavailable. Check that the API is
          running and try again.
        </Alert>
      )}
    </Stack>
  );
}

function PageState({ children, severity }: { children: React.ReactNode; severity: "error" | "info" }) {
  return <Alert severity={severity} variant="outlined">{children}</Alert>;
}

function readSingleValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseSort(value: string | undefined): PlayerLeaderboardSort {
  return playerLeaderboardSorts.includes(value as PlayerLeaderboardSort)
    ? (value as PlayerLeaderboardSort)
    : "pir";
}

function parseOrder(value: string | undefined): PlayerLeaderboardOrder {
  return value === "asc" ? "asc" : "desc";
}

function parsePage(value: string | undefined): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}
