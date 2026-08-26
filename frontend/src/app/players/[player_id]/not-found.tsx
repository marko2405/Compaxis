import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function NotFound() {
  return (
    <Stack spacing={1.5} sx={{ alignItems: "flex-start" }}>
      <Typography component="h1" variant="h1">
        Player not found
      </Typography>
      <Typography color="text.secondary">
        This player has no data for the selected season.
      </Typography>
      <Button href="/players" variant="contained">
        Back to Players
      </Button>
    </Stack>
  );
}
