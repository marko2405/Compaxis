"use client";

import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

import { useSeason } from "./season-context";

export function HeaderSeasonSelector() {
  const { isPending, seasons, selectedSeasonCode, selectSeason } = useSeason();
  if (!selectedSeasonCode || seasons.length === 0) return null;

  return (
    <FormControl size="small" sx={{ minWidth: { xs: 104, sm: 120 } }}>
      <Select
        aria-label="Season"
        disabled={isPending}
        onChange={(event: SelectChangeEvent<string>) => selectSeason(event.target.value)}
        value={selectedSeasonCode}
        sx={{ fontSize: "0.8rem", fontWeight: 700, "& .MuiSelect-select": { py: 0.75 } }}
      >
        {seasons.map((season) => <MenuItem key={season.id} value={season.code}>{season.name}</MenuItem>)}
      </Select>
    </FormControl>
  );
}
