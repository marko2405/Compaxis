"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ComparisonMetricRowProps = {
  label: string;
  playerAName: string;
  playerAValue: number;
  playerBName: string;
  playerBValue: number;
  percentage?: boolean;
  lowerIsBetter?: boolean;
};

type TooltipPayload = {
  payload?: {
    actual: number;
    name: string;
  };
};

export function ComparisonMetricRow({
  label,
  playerAName,
  playerAValue,
  playerBName,
  playerBValue,
  percentage = false,
  lowerIsBetter = false,
}: ComparisonMetricRowProps) {
  const theme = useTheme();
  const maximum = Math.max(playerAValue, playerBValue);
  const normalize = (value: number) => (maximum > 0 ? (value / maximum) * 100 : 0);
  const data = [
    { actual: playerAValue, fill: theme.palette.chart.playerA, name: playerAName, normalized: normalize(playerAValue) },
    { actual: playerBValue, fill: theme.palette.chart.playerB, name: playerBName, normalized: normalize(playerBValue) },
  ];

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        p: 1.5,
      }}
    >
      <Box sx={{ minHeight: 37 }}>
        <Typography sx={{ fontWeight: 750, lineHeight: 1.2 }} variant="body1">
          {label}
        </Typography>
        {lowerIsBetter ? (
          <Typography color="text.secondary" sx={{ fontSize: "0.68rem", lineHeight: 1.2, mt: 0.25 }}>
            Lower is better
          </Typography>
        ) : null}
      </Box>

      <Box
        aria-label={`${label}: ${playerAName} ${formatValue(playerAValue, percentage)}, ${playerBName} ${formatValue(playerBValue, percentage)}`}
        role="img"
        sx={{ height: 112, mt: 1, width: "100%" }}
      >
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={data} margin={{ bottom: 0, left: 4, right: 4, top: 4 }}>
              <XAxis dataKey="name" hide type="category" />
              <YAxis domain={[0, 100]} hide type="number" />
              <Tooltip
                content={({ active, payload }) => {
                  const item = payload?.[0] as TooltipPayload | undefined;
                  if (!active || !item?.payload) return null;
                  return (
                    <Box sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 1, px: 1, py: 0.5 }}>
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 650 }}>
                        {item.payload.name}: {formatValue(item.payload.actual, percentage)}
                      </Typography>
                    </Box>
                  );
                }}
                cursor={false}
              />
              <Bar animationDuration={0} dataKey="normalized" maxBarSize={42} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
      </Box>
      <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: "repeat(2, minmax(0, 1fr))", mt: 0.75 }}>
        <Box sx={{ minWidth: 0, textAlign: "center" }}>
          <Typography sx={{ color: "chart.playerA", fontWeight: 800, lineHeight: 1.2 }} variant="body2">
            {formatValue(playerAValue, percentage)}
          </Typography>
          <Typography color="text.secondary" noWrap sx={{ fontSize: "0.68rem" }} title={playerAName}>
            {playerAName}
          </Typography>
        </Box>
        <Box sx={{ minWidth: 0, textAlign: "center" }}>
          <Typography sx={{ color: "chart.playerB", fontWeight: 800, lineHeight: 1.2 }} variant="body2">
            {formatValue(playerBValue, percentage)}
          </Typography>
          <Typography color="text.secondary" noWrap sx={{ fontSize: "0.68rem" }} title={playerBName}>
            {playerBName}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

function formatValue(value: number, percentage: boolean) {
  return `${value.toFixed(1)}${percentage ? "%" : ""}`;
}
