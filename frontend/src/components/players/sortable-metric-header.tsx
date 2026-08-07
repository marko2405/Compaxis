"use client";

import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import Link from "next/link";

import type {
  PlayerLeaderboardOrder,
  PlayerLeaderboardSort,
} from "@/types/player";

type SortableMetricHeaderProps = {
  activeSort: PlayerLeaderboardSort;
  href: string;
  label: string;
  order: PlayerLeaderboardOrder;
  sortField: PlayerLeaderboardSort;
};

export function SortableMetricHeader({
  activeSort,
  href,
  label,
  order,
  sortField,
}: SortableMetricHeaderProps) {
  const active = activeSort === sortField;

  return (
    <TableCell align="right" sortDirection={active ? order : false}>
      <TableSortLabel
        active={active}
        component={Link}
        direction={active ? order : "desc"}
        href={href}
        sx={{ whiteSpace: "nowrap" }}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
}
