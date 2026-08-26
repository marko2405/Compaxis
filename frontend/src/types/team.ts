export type TeamListItem = {
  team_id: number;
  external_id: string;
  name: string;
  country: string | null;
  logo_url: string | null;
};

export type TeamRosterPlayer = {
  player_id: number;
  external_id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  games_played: number;
  minutes_per_game: number;
  points_per_game: number;
  rebounds_per_game: number;
  assists_per_game: number;
  steals_per_game: number;
  blocks_per_game: number;
  turnovers_per_game: number;
  two_point_percentage: number;
  three_point_percentage: number;
  free_throw_percentage: number;
  pir_per_game: number;
};

export type TeamProfile = TeamListItem & {
  season_code: string;
  roster: TeamRosterPlayer[];
};
