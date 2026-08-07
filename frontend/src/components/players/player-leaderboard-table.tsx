import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import type {
  PlayerLeaderboardEntry,
  PlayerLeaderboardOrder,
  PlayerLeaderboardSort,
} from "@/types/player";

import { LeaderboardAvatar } from "./leaderboard-avatar";
import { SortableMetricHeader } from "./sortable-metric-header";

type PlayerLeaderboardTableProps = {
  order: PlayerLeaderboardOrder;
  page: number;
  pageSize: number;
  players: PlayerLeaderboardEntry[];
  seasonCode: string;
  sortBy: PlayerLeaderboardSort;
};

export function PlayerLeaderboardTable({
  order,
  page,
  pageSize,
  players,
  seasonCode,
  sortBy,
}: PlayerLeaderboardTableProps) {
  function sortHref(sortField: PlayerLeaderboardSort): string {
    const nextOrder =
      sortBy === sortField && order === "desc" ? "asc" : "desc";
    const params = new URLSearchParams({
      season_code: seasonCode,
      sort_by: sortField,
      order: nextOrder,
      page: "1",
      page_size: pageSize.toString(),
    });

    return `/players?${params.toString()}`;
  }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: "100%", overflowX: "auto" }}>
      <Table aria-label="Player leaderboard" sx={{ minWidth: 1500 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 64 }}>Rank</TableCell>
            <TableCell>Player</TableCell>
            <TableCell>Team</TableCell>
            <MetricHeader label="GP" />
            <SortableMetricHeader
              activeSort={sortBy}
              href={sortHref("minutes")}
              label="MIN"
              order={order}
              sortField="minutes"
            />
            <SortableMetricHeader
              activeSort={sortBy}
              href={sortHref("points")}
              label="PTS"
              order={order}
              sortField="points"
            />
            <SortableMetricHeader
              activeSort={sortBy}
              href={sortHref("rebounds")}
              label="REB"
              order={order}
              sortField="rebounds"
            />
            <SortableMetricHeader
              activeSort={sortBy}
              href={sortHref("assists")}
              label="AST"
              order={order}
              sortField="assists"
            />
            <SortableMetricHeader
              activeSort={sortBy}
              href={sortHref("steals")}
              label="STL"
              order={order}
              sortField="steals"
            />
            <SortableMetricHeader
              activeSort={sortBy}
              href={sortHref("blocks")}
              label="BLK"
              order={order}
              sortField="blocks"
            />
            <SortableMetricHeader
              activeSort={sortBy}
              href={sortHref("turnovers")}
              label="TO"
              order={order}
              sortField="turnovers"
            />
            <SortableMetricHeader
              activeSort={sortBy}
              href={sortHref("two_point_percentage")}
              label="2P%"
              order={order}
              sortField="two_point_percentage"
            />
            <SortableMetricHeader
              activeSort={sortBy}
              href={sortHref("three_point_percentage")}
              label="3P%"
              order={order}
              sortField="three_point_percentage"
            />
            <SortableMetricHeader
              activeSort={sortBy}
              href={sortHref("free_throw_percentage")}
              label="FT%"
              order={order}
              sortField="free_throw_percentage"
            />
            <SortableMetricHeader
              activeSort={sortBy}
              href={sortHref("pir")}
              label="PIR"
              order={order}
              sortField="pir"
            />
          </TableRow>
        </TableHead>
        <TableBody>
          {players.length === 0 ? (
            <TableRow>
              <TableCell colSpan={15} sx={{ py: 6, textAlign: "center" }}>
                <Typography color="text.secondary" variant="body2">
                  No leaderboard data is available for this season.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            players.map((player, index) => (
              <TableRow key={`${player.player_id}-${player.team_id}`} hover>
                <TableCell>
                  <Typography color="text.secondary" variant="body2">
                    {(page - 1) * pageSize + index + 1}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                    <LeaderboardAvatar
                      alt={`${player.first_name} ${player.last_name}`}
                      fallback={`${player.first_name.charAt(0)}${player.last_name.charAt(0)}`}
                      size={36}
                      src={player.image_url}
                    />
                    <Box>
                      <Typography sx={{ fontWeight: 650 }} variant="body2">
                        {player.first_name} {player.last_name}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <LeaderboardAvatar
                      alt=""
                      fallback={<GroupsOutlinedIcon sx={{ fontSize: 17 }} />}
                      size={28}
                      src={player.team_logo_url}
                      variant="rounded"
                    />
                    <Typography variant="body2">{player.team_name}</Typography>
                  </Stack>
                </TableCell>
                <MetricCell value={player.games_played.toString()} />
                <MetricCell value={formatPerGame(player.minutes_per_game)} />
                <MetricCell value={formatPerGame(player.points_per_game)} />
                <MetricCell value={formatPerGame(player.rebounds_per_game)} />
                <MetricCell value={formatPerGame(player.assists_per_game)} />
                <MetricCell value={formatPerGame(player.steals_per_game)} />
                <MetricCell value={formatPerGame(player.blocks_per_game)} />
                <MetricCell value={formatPerGame(player.turnovers_per_game)} />
                <MetricCell value={formatPercentage(player.two_point_percentage)} />
                <MetricCell value={formatPercentage(player.three_point_percentage)} />
                <MetricCell value={formatPercentage(player.free_throw_percentage)} />
                <TableCell align="right">
                  <Typography color="primary.main" sx={{ fontWeight: 750 }} variant="body2">
                    {formatPerGame(player.pir_per_game)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function MetricHeader({ label }: { label: string }) {
  return <TableCell align="right">{label}</TableCell>;
}

function MetricCell({ value }: { value: string }) {
  return <TableCell align="right">{value}</TableCell>;
}

function formatPerGame(value: number): string {
  return value.toFixed(1);
}

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
