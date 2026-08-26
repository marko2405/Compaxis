import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function Loading() {
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Skeleton height={40} width={220} />
        <Skeleton height={22} width="min(100%, 450px)" />
      </Stack>
      <Paper sx={{ p: 2 }}>
        <Stack spacing={1}>
          {Array.from({ length: 12 }, (_, index) => <Skeleton height={42} key={index} variant="rounded" />)}
        </Stack>
      </Paper>
    </Stack>
  );
}
