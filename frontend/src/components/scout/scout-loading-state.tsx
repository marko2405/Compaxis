import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function ScoutLoadingState() {
  return (
    <Paper sx={{ p: 4, textAlign: "center" }} variant="outlined">
      <Stack spacing={1.5} sx={{ alignItems: "center" }}>
        <CircularProgress size={32} />
        <AutoAwesomeOutlinedIcon color="primary" />
        <Typography variant="h3">Building scouting comparison…</Typography>
        <Typography color="text.secondary" variant="body2">
          Comparing season production and generating the analysis.
        </Typography>
      </Stack>
    </Paper>
  );
}
