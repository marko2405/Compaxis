export type ScoutComparisonRequest = {
  season_code: string;
  player_a_id: number;
  player_b_id: number;
};

export type ComparedPlayer = {
  player_id: number;
  external_id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  team_id: number;
  team_name: string;
  team_logo_url: string | null;
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

export type PlayerComparisonDifferences = Omit<
  ComparedPlayer,
  | "player_id"
  | "external_id"
  | "first_name"
  | "last_name"
  | "image_url"
  | "team_id"
  | "team_name"
  | "team_logo_url"
  | "games_played"
>;

export type ScoutAnalysis = {
  summary: string;
  player_a_strengths: string[];
  player_b_strengths: string[];
  key_differences: string[];
  conclusion: string;
  data_limitations: string[];
};

export type ScoutComparisonResponse = {
  season_code: string;
  player_a: ComparedPlayer;
  player_b: ComparedPlayer;
  differences: PlayerComparisonDifferences;
  analysis: ScoutAnalysis;
};
