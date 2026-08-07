import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export function PlayerLeaderboardLoading() {
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Skeleton height={38} width={180} />
        <Skeleton height={22} width="min(100%, 430px)" />
      </Stack>
      <Skeleton height={40} width={430} />
      <Paper sx={{ p: 2 }}>
        <Stack spacing={1}>
          {Array.from({ length: 9 }, (_, index) => (
            <Skeleton height={44} key={index} variant="rounded" />
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
