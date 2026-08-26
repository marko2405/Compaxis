import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import type {
  ComparedPlayer,
  PlayerComparisonDifferences,
} from "@/types/scout";

type MetricKey = keyof PlayerComparisonDifferences;

const metrics: { key: MetricKey; label: string; percentage?: boolean }[] = [
  { key: "minutes_per_game", label: "MPG" },
  { key: "points_per_game", label: "PPG" },
  { key: "rebounds_per_game", label: "RPG" },
  { key: "assists_per_game", label: "APG" },
  { key: "steals_per_game", label: "SPG" },
  { key: "blocks_per_game", label: "BPG" },
  { key: "turnovers_per_game", label: "TO/G" },
  { key: "two_point_percentage", label: "2P%", percentage: true },
  { key: "three_point_percentage", label: "3P%", percentage: true },
  { key: "free_throw_percentage", label: "FT%", percentage: true },
  { key: "pir_per_game", label: "PIR" },
];

type ComparisonMetricsProps = {
  differences: PlayerComparisonDifferences;
  playerA: ComparedPlayer;
  playerB: ComparedPlayer;
};

export function ComparisonMetrics({
  differences,
  playerA,
  playerB,
}: ComparisonMetricsProps) {
  return (
    <Box component="section">
      <Typography sx={{ mb: 1.5 }} variant="h3">
        Metric comparison
      </Typography>
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 620 }}>
          <TableHead>
            <TableRow>
              <TableCell>Metric</TableCell>
              <TableCell align="right">{playerA.last_name}</TableCell>
              <TableCell align="right">{playerB.last_name}</TableCell>
              <TableCell align="right">A − B</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Games played</TableCell>
              <TableCell align="right">{playerA.games_played}</TableCell>
              <TableCell align="right">{playerB.games_played}</TableCell>
              <TableCell align="right">—</TableCell>
            </TableRow>
            {metrics.map((metric) => (
              <TableRow key={metric.key}>
                <TableCell sx={{ fontWeight: metric.key === "pir_per_game" ? 750 : 500 }}>
                  {metric.label}
                </TableCell>
                <MetricCell emphasized={metric.key === "pir_per_game"} percentage={metric.percentage} value={playerA[metric.key]} />
                <MetricCell emphasized={metric.key === "pir_per_game"} percentage={metric.percentage} value={playerB[metric.key]} />
                <MetricCell difference percentage={metric.percentage} value={differences[metric.key]} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function MetricCell({
  difference = false,
  emphasized = false,
  percentage = false,
  value,
}: {
  difference?: boolean;
  emphasized?: boolean;
  percentage?: boolean;
  value: number;
}) {
  const formatted = `${difference && value > 0 ? "+" : ""}${value.toFixed(1)}${percentage ? (difference ? " pp" : "%") : ""}`;
  return (
    <TableCell
      align="right"
      sx={{ color: emphasized ? "primary.main" : "text.primary", fontWeight: emphasized ? 750 : 500 }}
    >
      {formatted}
    </TableCell>
  );
}
