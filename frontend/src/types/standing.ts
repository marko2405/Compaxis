export type StandingItem = {
  rank: number;
  team_id: number;
  external_id: string;
  team_name: string;
  team_logo_url: string | null;
  games_played: number;
  wins: number;
  losses: number;
  win_percentage: number;
  points_for: number;
  points_against: number;
  point_differential: number;
};

export type Standings = {
  season_code: string;
  items: StandingItem[];
};
