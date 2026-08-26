import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function Loading() {
  return (
    <Stack spacing={3}>
      <Skeleton height={36} width={150} />
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={2.5} sx={{ alignItems: "center" }}>
          <Skeleton height={96} variant="rounded" width={96} />
          <Stack spacing={1} sx={{ flex: 1 }}>
            <Skeleton height={40} width="min(100%, 330px)" />
            <Skeleton height={22} width={160} />
          </Stack>
        </Stack>
      </Paper>
      <Skeleton height={420} variant="rounded" />
    </Stack>
  );
}
