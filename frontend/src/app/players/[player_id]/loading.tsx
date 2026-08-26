import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function Loading() {
  return (
    <Stack spacing={3}>
      <Skeleton height={40} width={150} />
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" sx={{ alignItems: "center", gap: 2.5 }}>
          <Skeleton height={96} variant="circular" width={96} />
          <Stack spacing={1} sx={{ flex: 1 }}>
            <Skeleton height={42} width="min(100%, 320px)" />
            <Skeleton height={24} width={180} />
          </Stack>
        </Stack>
      </Paper>
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.5 }}>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton height={110} key={index} variant="rounded" width={150} />
        ))}
      </Stack>
    </Stack>
  );
}
