import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function Loading() {
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Skeleton height={40} width={180} />
        <Skeleton height={22} width="min(100%, 420px)" />
      </Stack>
      <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" } }}>
        {Array.from({ length: 9 }, (_, index) => <Skeleton height={88} key={index} variant="rounded" />)}
      </Box>
    </Stack>
  );
}
