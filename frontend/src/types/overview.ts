import type { PlayerLeaderboardEntry } from "@/types/player";
import type { StandingItem } from "@/types/standing";

export type Overview = {
  season_code: string;
  season_name: string;
  player_count: number;
  team_count: number;
  leader: StandingItem | null;
  top_pir: PlayerLeaderboardEntry[];
  top_scorers: PlayerLeaderboardEntry[];
  top_assists: PlayerLeaderboardEntry[];
};
