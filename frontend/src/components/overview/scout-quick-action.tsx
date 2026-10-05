import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function ScoutQuickAction() {
  return (
    <Card sx={{ backgroundColor: "ai.light", borderColor: "ai.main", height: "100%" }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <AutoAwesomeRounded sx={{ color: "ai.dark", fontSize: 20 }} />
          <Typography component="h2" sx={{ color: "ai.contrastText" }} variant="h3">AI Scout</Typography>
        </Stack>
        <Typography sx={{ color: "ai.contrastText", mb: 2, mt: 1, opacity: 0.8 }} variant="body2">
          Compare two players with season statistics and a focused scouting analysis.
        </Typography>
        <Button endIcon={<ArrowForwardRounded />} href="/scout" sx={{ alignSelf: "flex-start", mt: "auto" }} variant="contained">
          Compare players
        </Button>
      </CardContent>
    </Card>
  );
}
