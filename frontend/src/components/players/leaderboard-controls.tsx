"use client";

import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { usePathname, useRouter } from "next/navigation";
import { type MouseEvent, useTransition } from "react";

import type {
  PlayerLeaderboardOrder,
  PlayerLeaderboardQuery,
  PlayerLeaderboardSort,
} from "@/types/player";
import { formatSeasonCode } from "@/lib/format-season-code";

const sortOptions: Array<{ label: string; value: PlayerLeaderboardSort }> = [
  { label: "PIR", value: "pir" },
  { label: "Points", value: "points" },
  { label: "Rebounds", value: "rebounds" },
  { label: "Assists", value: "assists" },
  { label: "Steals", value: "steals" },
  { label: "Blocks", value: "blocks" },
  { label: "Turnovers", value: "turnovers" },
  { label: "Minutes", value: "minutes" },
  { label: "2PT percentage", value: "two_point_percentage" },
  { label: "3PT percentage", value: "three_point_percentage" },
  { label: "FT percentage", value: "free_throw_percentage" },
];

type LeaderboardControlsProps = PlayerLeaderboardQuery;

export function LeaderboardControls({
  seasonCode,
  sortBy,
  order,
  page,
  pageSize,
}: LeaderboardControlsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function updateQuery(update: Partial<PlayerLeaderboardQuery>) {
    const nextQuery = { seasonCode, sortBy, order, page, pageSize, ...update };
    const params = new URLSearchParams({
      season_code: nextQuery.seasonCode,
      sort_by: nextQuery.sortBy,
      order: nextQuery.order,
      page: nextQuery.page.toString(),
      page_size: nextQuery.pageSize.toString(),
    });

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  function handleSeasonChange(event: SelectChangeEvent) {
    updateQuery({ seasonCode: event.target.value, page: 1 });
  }

  function handleSortChange(event: SelectChangeEvent) {
    updateQuery({
      sortBy: event.target.value as PlayerLeaderboardSort,
      page: 1,
    });
  }

  function handleOrderChange(
    _event: MouseEvent<HTMLElement>,
    value: PlayerLeaderboardOrder | null,
  ) {
    if (value) {
      updateQuery({ order: value, page: 1 });
    }
  }

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      sx={{ alignItems: { sm: "center" }, gap: 1.5 }}
    >
      <FormControl disabled={isPending} size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="season-label">Season</InputLabel>
        <Select
          label="Season"
          labelId="season-label"
          onChange={handleSeasonChange}
          value={seasonCode}
        >
          <MenuItem value="E2024">{formatSeasonCode("E2024")}</MenuItem>
        </Select>
      </FormControl>

      <FormControl disabled={isPending} size="small" sx={{ minWidth: 190 }}>
        <InputLabel id="sort-label">Sort by</InputLabel>
        <Select
          label="Sort by"
          labelId="sort-label"
          onChange={handleSortChange}
          value={sortBy}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ToggleButtonGroup
        aria-label="Sort order"
        color="primary"
        disabled={isPending}
        exclusive
        onChange={handleOrderChange}
        size="small"
        value={order}
      >
        <ToggleButton aria-label="Ascending" value="asc">
          <ArrowUpwardOutlinedIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton aria-label="Descending" value="desc">
          <ArrowDownwardOutlinedIcon fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
