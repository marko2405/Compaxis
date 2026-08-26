import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

type OverviewSummaryProps = {
  leaderName: string | null;
  playerCount: number | null;
  season: string;
  teamCount: number | null;
};

export function OverviewSummary({ leaderName, playerCount, season, teamCount }: OverviewSummaryProps) {
  const metrics = [
    { label: "Players", value: playerCount?.toString() ?? "Unavailable" },
    { label: "Teams", value: teamCount?.toString() ?? "Unavailable" },
    { label: "Season", value: season },
    { label: "Current leader", value: leaderName ?? "Unavailable" },
  ];

  return (
    <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" } }}>
      {metrics.map((metric) => (
        <Card key={metric.label} sx={{ minWidth: 0 }}>
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Typography color="text.secondary" sx={{ fontWeight: 700 }} variant="caption">{metric.label}</Typography>
            <Typography noWrap sx={{ fontSize: { xs: "1.05rem", sm: "1.25rem" }, fontWeight: 750, mt: 0.5 }} title={metric.value}>
              {metric.value}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
