"use client";

import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ModeToggle } from "@/components/ui/mode-toggle";

const comparisonRows = [
  {
    label: "Points",
    playerA: "16.6",
    playerB: "14.1",
    aWidth: "83%",
    bWidth: "71%",
  },
  {
    label: "Assists",
    playerA: "3.0",
    playerB: "5.4",
    aWidth: "56%",
    bWidth: "100%",
  },
  {
    label: "3PT",
    playerA: "38.6%",
    playerB: "31.9%",
    aWidth: "100%",
    bWidth: "83%",
  },
] as const;

export function ThemePreview() {
  return (
    <Box component="main" sx={{ minHeight: "100vh", py: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography color="primary" variant="overline">
                EuroScoutAI design system
              </Typography>
              <Typography component="h1" variant="h1">
                Scouting intelligence, clearly presented.
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                A compact visual foundation for player data, comparisons, and AI
                analysis.
              </Typography>
            </Box>
            <ModeToggle />
          </Stack>

          <Card>
            <CardContent
              sx={{
                p: { xs: 2.5, md: 3 },
                "&:last-child": { pb: { xs: 2.5, md: 3 } },
              }}
            >
              <Stack spacing={3}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  sx={{ gap: 2, justifyContent: "space-between" }}
                >
                  <Box>
                    <Typography variant="h2">Interface foundations</Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                      variant="body2"
                    >
                      Purposeful hierarchy, restrained accents, and data-first
                      components.
                    </Typography>
                  </Box>
                  <Stack
                    direction="row"
                    sx={{ flexWrap: "wrap", gap: 1 }}
                  >
                    <Button variant="contained">Primary action</Button>
                    <Button variant="outlined">Secondary action</Button>
                    <Button
                      color="ai"
                      startIcon={<AutoAwesomeOutlinedIcon />}
                      variant="contained"
                    >
                      AI analysis
                    </Button>
                  </Stack>
                </Stack>

                <Divider />

                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                  <Chip color="ai" label="Selected" />
                  <Chip color="success" label="Positive" variant="outlined" />
                  <Chip
                    color="warning"
                    icon={<EmojiEventsOutlinedIcon />}
                    label="Top performer"
                  />
                  <Chip label="Neutral metric" variant="outlined" />
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gap: 1.5,
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(3, 1fr)",
                    },
                  }}
                >
                  <Alert severity="success">Positive trend</Alert>
                  <Alert severity="warning">Review sample size</Alert>
                  <Alert severity="error">Data unavailable</Alert>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                md: "minmax(0, 0.8fr) minmax(0, 1.2fr)",
              },
            }}
          >
            <Card>
              <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                <Typography color="text.secondary" variant="caption">
                  PLAYER IMPACT RATING
                </Typography>
                <Stack
                  direction="row"
                  sx={{ alignItems: "baseline", gap: 1, mt: 1 }}
                >
                  <Typography variant="h1">19.4</Typography>
                  <Typography color="success.main" variant="subtitle1">
                    +2.8
                  </Typography>
                </Stack>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 1 }}
                  variant="body2"
                >
                  Above the comparison-group average across 24 games.
                </Typography>
                <Box
                  sx={{
                    bgcolor: "ai.light",
                    borderRadius: 2,
                    color: "ai.contrastText",
                    mt: 3,
                    p: 1.5,
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{ alignItems: "center", gap: 1 }}
                  >
                    <AutoAwesomeOutlinedIcon fontSize="small" />
                    <Typography variant="body2">
                      Strong scoring efficiency with a reliable perimeter profile.
                    </Typography>
                  </Stack>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                <Typography variant="h3">Player comparison colors</Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mb: 3, mt: 0.5 }}
                  variant="body2"
                >
                  A chart-ready pairing that remains distinct in both modes.
                </Typography>
                <Stack spacing={2.25}>
                  {comparisonRows.map((row) => (
                    <Box key={row.label}>
                      <Stack
                        direction="row"
                        sx={{ justifyContent: "space-between", mb: 0.75 }}
                      >
                        <Typography variant="caption">{row.label}</Typography>
                        <Typography color="text.secondary" variant="caption">
                          {row.playerA} / {row.playerB}
                        </Typography>
                      </Stack>
                      <Stack spacing={0.75}>
                        <Box
                          sx={{
                            bgcolor: "chart.playerA",
                            borderRadius: 1,
                            height: 8,
                            width: row.aWidth,
                          }}
                        />
                        <Box
                          sx={{
                            bgcolor: "chart.playerB",
                            borderRadius: 1,
                            height: 8,
                            width: row.bWidth,
                          }}
                        />
                      </Stack>
                    </Box>
                  ))}
                  <Stack direction="row" sx={{ gap: 2 }}>
                    <Legend color="chart.playerA" label="Player A" />
                    <Legend color="chart.playerB" label="Player B" />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <Stack direction="row" sx={{ alignItems: "center", gap: 0.75 }}>
      <Box
        sx={{ bgcolor: color, borderRadius: "50%", height: 8, width: 8 }}
      />
      <Typography color="text.secondary" variant="caption">
        {label}
      </Typography>
    </Stack>
  );
}
