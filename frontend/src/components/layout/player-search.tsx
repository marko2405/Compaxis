"use client";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LeaderboardAvatar } from "@/components/players/leaderboard-avatar";
import { searchPlayers } from "@/services/player-service";
import type { PlayerSearchResult } from "@/types/player";
import { useSeason } from "./season-context";

const SEARCH_DEBOUNCE_MS = 300;

export function PlayerSearch() {
  const router = useRouter();
  const { withSeason } = useSeason();
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<PlayerSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const query = inputValue.trim();
    if (query.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setUnavailable(false);

      try {
        setOptions(await searchPlayers(query, { signal: controller.signal }));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setOptions([]);
        setUnavailable(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [inputValue]);

  return (
    <Autocomplete<PlayerSearchResult, false, false, false>
      clearOnBlur
      filterOptions={(results) => results}
      forcePopupIcon={false}
      getOptionKey={(option) => option.player_id}
      getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
      inputValue={inputValue}
      loading={loading}
      loadingText="Searching…"
      noOptionsText={unavailable ? "Search unavailable" : "No players found"}
      onChange={(_, player) => {
        if (!player) return;
        setInputValue("");
        setOptions([]);
        router.push(withSeason(`/players/${player.player_id}`));
      }}
      onInputChange={(_, value) => {
        setInputValue(value);
        setOptions([]);
        setLoading(false);
        setUnavailable(false);
      }}
      open={inputValue.trim().length >= 2}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          aria-label="Search players"
          placeholder="Search players"
          size="small"
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={16} /> : null}
                  {params.slotProps.input?.endAdornment}
                </>
              ),
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;

        return (
          <Box component="li" key={key} {...optionProps}>
            <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", minWidth: 0, width: "100%" }}>
              <LeaderboardAvatar
                alt=""
                fallback={`${option.first_name.charAt(0)}${option.last_name.charAt(0)}`}
                size={36}
                src={option.image_url}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography noWrap sx={{ fontWeight: 650 }} variant="body2">
                  {option.first_name} {option.last_name}
                </Typography>
                <Typography color="text.secondary" noWrap variant="caption">
                  {option.team_name ?? "Team unavailable"}
                </Typography>
              </Box>
            </Stack>
          </Box>
        );
      }}
      sx={{ width: { xs: "min(58vw, 260px)", sm: 320, lg: 360 } }}
      value={null}
    />
  );
}
