import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function OverviewLoading() {
  return (
    <Stack spacing={3}>
      <Box><Skeleton height={42} width={220} /><Skeleton height={24} width="min(100%, 360px)" /></Box>
      <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" } }}>
        {Array.from({ length: 4 }, (_, index) => <Skeleton height={92} key={index} variant="rounded" />)}
      </Box>
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" } }}>
        {Array.from({ length: 3 }, (_, index) => <Skeleton height={390} key={index} variant="rounded" />)}
      </Box>
    </Stack>
  );
}
