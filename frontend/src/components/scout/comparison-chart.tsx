"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { ComparedPlayer } from "@/types/scout";

import { ComparisonMetricRow } from "./comparison-metric-row";

type MetricKey = keyof Pick<
  ComparedPlayer,
  | "points_per_game"
  | "rebounds_per_game"
  | "assists_per_game"
  | "steals_per_game"
  | "blocks_per_game"
  | "turnovers_per_game"
  | "pir_per_game"
  | "two_point_percentage"
  | "three_point_percentage"
  | "free_throw_percentage"
>;

const metrics: { key: MetricKey; label: string; percentage?: boolean; lowerIsBetter?: boolean }[] = [
  { key: "points_per_game", label: "PPG" },
  { key: "rebounds_per_game", label: "RPG" },
  { key: "assists_per_game", label: "APG" },
  { key: "steals_per_game", label: "SPG" },
  { key: "blocks_per_game", label: "BPG" },
  { key: "turnovers_per_game", label: "TO/G", lowerIsBetter: true },
  { key: "pir_per_game", label: "PIR" },
  { key: "two_point_percentage", label: "2P%", percentage: true },
  { key: "three_point_percentage", label: "3P%", percentage: true },
  { key: "free_throw_percentage", label: "FT%", percentage: true },
];

type ComparisonChartProps = {
  playerA: ComparedPlayer;
  playerB: ComparedPlayer;
};

export function ComparisonChart({ playerA, playerB }: ComparisonChartProps) {
  const playerAName = `${playerA.first_name} ${playerA.last_name}`;
  const playerBName = `${playerB.first_name} ${playerB.last_name}`;

  return (
    <Box component="section">
      <Typography sx={{ mb: 1.5 }} variant="h2">
        Stat Comparison
      </Typography>
      <Paper sx={{ maxWidth: 1080, p: { xs: 1.5, sm: 2.5 } }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 0.75, sm: 2.5 }} sx={{ mb: 1.25 }}>
          <LegendItem color="chart.playerA" name={playerAName} />
          <LegendItem color="chart.playerB" name={playerBName} />
        </Stack>
        <Box
          sx={{
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              lg: "repeat(5, minmax(0, 1fr))",
            },
          }}
        >
          {metrics.map((metric) => (
            <ComparisonMetricRow
              key={metric.key}
              label={metric.label}
              lowerIsBetter={metric.lowerIsBetter}
              percentage={metric.percentage}
              playerAName={playerAName}
              playerAValue={playerA[metric.key]}
              playerBName={playerBName}
              playerBValue={playerB[metric.key]}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

function LegendItem({ color, name }: { color: "chart.playerA" | "chart.playerB"; name: string }) {
  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", minWidth: 0 }}>
      <Box sx={{ bgcolor: color, borderRadius: "50%", flex: "0 0 auto", height: 9, width: 9 }} />
      <Typography noWrap color="text.secondary" variant="body2">
        {name}
      </Typography>
    </Stack>
  );
}
