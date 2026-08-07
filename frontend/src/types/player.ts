export const playerLeaderboardSorts = [
  "pir",
  "points",
  "rebounds",
  "assists",
  "steals",
  "blocks",
  "turnovers",
  "minutes",
  "two_point_percentage",
  "three_point_percentage",
  "free_throw_percentage",
] as const;

export type PlayerLeaderboardSort = (typeof playerLeaderboardSorts)[number];
export type PlayerLeaderboardOrder = "asc" | "desc";

export type PlayerLeaderboardQuery = {
  seasonCode: string;
  sortBy: PlayerLeaderboardSort;
  order: PlayerLeaderboardOrder;
  page: number;
  pageSize: number;
};

export type PlayerLeaderboardEntry = {
  player_id: number;
  external_id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  team_id: number;
  team_name: string;
  team_logo_url: string | null;
  season_code: string;
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

export type PaginatedPlayerLeaderboard = {
  items: PlayerLeaderboardEntry[];
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
};
