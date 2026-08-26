import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function NotFound() {
  return (
    <Stack spacing={1.5} sx={{ alignItems: "flex-start" }}>
      <Typography component="h1" variant="h1">Team not found</Typography>
      <Typography color="text.secondary">This team has no data for the selected season.</Typography>
      <Button href="/teams" variant="contained">Back to Teams</Button>
    </Stack>
  );
}
