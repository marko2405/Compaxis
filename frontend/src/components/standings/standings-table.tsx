import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { LeaderboardAvatar } from "@/components/players/leaderboard-avatar";
import type { StandingItem } from "@/types/standing";

export function StandingsTable({ items, seasonCode }: { items: StandingItem[]; seasonCode: string }) {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table aria-label="EuroLeague standings" size="small" sx={{ minWidth: 780 }}>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ width: 64 }}>Rank</TableCell>
            <TableCell>Team</TableCell>
            {['GP', 'W', 'L', 'WIN%', 'PF', 'PA', 'DIFF'].map((label) => (
              <TableCell align="right" key={label}>{label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow hover key={item.team_id}>
              <TableCell
                align="center"
                sx={{ color: item.rank <= 4 ? "primary.main" : "text.primary", fontWeight: item.rank <= 4 ? 800 : 650 }}
              >
                {item.rank}
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                  <LeaderboardAvatar
                    alt=""
                    fallback={item.external_id.slice(0, 2)}
                    size={34}
                    src={item.team_logo_url}
                    variant="rounded"
                  />
                  <Link href={`/teams/${item.team_id}?season_code=${encodeURIComponent(seasonCode)}`} sx={{ color: "text.primary", fontWeight: 650, whiteSpace: "nowrap" }} underline="hover">
                    {item.team_name}
                  </Link>
                </Stack>
              </TableCell>
              <NumberCell value={item.games_played} />
              <NumberCell value={item.wins} />
              <NumberCell value={item.losses} />
              <NumberCell suffix="%" value={item.win_percentage} />
              <NumberCell value={item.points_for} />
              <NumberCell value={item.points_against} />
              <DifferenceCell value={item.point_differential} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function NumberCell({ suffix = "", value }: { suffix?: string; value: number }) {
  const formatted = suffix ? value.toFixed(1) : value.toString();
  return <TableCell align="right" sx={{ fontWeight: 500 }}>{formatted}{suffix}</TableCell>;
}

function DifferenceCell({ value }: { value: number }) {
  return (
    <TableCell
      align="right"
      sx={{ color: value > 0 ? "positiveMetric" : value < 0 ? "negativeMetric" : "neutralMetric", fontWeight: 750 }}
    >
      {value > 0 ? "+" : ""}{value}
    </TableCell>
  );
}
