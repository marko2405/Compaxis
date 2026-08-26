"use client";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { LeaderboardAvatar } from "@/components/players/leaderboard-avatar";
import type { PlayerLeaderboardEntry } from "@/types/player";

type PlayerSelectorProps = {
  excludedPlayerId: number | null;
  label: string;
  onChange: (player: PlayerLeaderboardEntry | null) => void;
  players: PlayerLeaderboardEntry[];
  value: PlayerLeaderboardEntry | null;
};

export function PlayerSelector({
  excludedPlayerId,
  label,
  onChange,
  players,
  value,
}: PlayerSelectorProps) {
  return (
    <Autocomplete
      autoHighlight
      getOptionDisabled={(option) => option.player_id === excludedPlayerId}
      getOptionKey={(option) => `${option.player_id}-${option.team_id}`}
      getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
      isOptionEqualToValue={(option, selected) =>
        option.player_id === selected.player_id && option.team_id === selected.team_id
      }
      onChange={(_, player) => onChange(player)}
      options={players}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder="Search players" />
      )}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;

        return (
          <Box component="li" key={key} {...optionProps}>
            <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
              <LeaderboardAvatar
                alt=""
                fallback={`${option.first_name.charAt(0)}${option.last_name.charAt(0)}`}
                size={36}
                src={option.image_url}
              />
              <Box>
                <Typography sx={{ fontWeight: 650 }} variant="body2">
                  {option.first_name} {option.last_name}
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  {option.team_name}
                </Typography>
              </Box>
            </Stack>
          </Box>
        );
      }}
      value={value}
    />
  );
}
