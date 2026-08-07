"use client";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { usePathname, useRouter } from "next/navigation";
import { type ChangeEvent, useTransition } from "react";

import type { PlayerLeaderboardQuery } from "@/types/player";

type LeaderboardPaginationProps = PlayerLeaderboardQuery & {
  totalPages: number;
};

export function LeaderboardPagination({
  seasonCode,
  sortBy,
  order,
  page,
  pageSize,
  totalPages,
}: LeaderboardPaginationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const paginationPage = totalPages === 0 ? 1 : Math.min(page, totalPages);

  function handlePageChange(_event: ChangeEvent<unknown>, nextPage: number) {
    const params = new URLSearchParams({
      season_code: seasonCode,
      sort_by: sortBy,
      order,
      page: nextPage.toString(),
      page_size: pageSize.toString(),
    });

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      sx={{ alignItems: { sm: "center" }, gap: 1.5, justifyContent: "space-between" }}
    >
      <Typography color="text.secondary" variant="body2">
        Page {totalPages === 0 ? 0 : paginationPage} of {totalPages}
      </Typography>
      <Pagination
        color="primary"
        count={Math.max(totalPages, 1)}
        disabled={isPending || totalPages <= 1}
        onChange={handlePageChange}
        page={paginationPage}
        shape="rounded"
        size="small"
      />
    </Stack>
  );
}
