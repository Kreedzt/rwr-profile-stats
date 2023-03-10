export interface Stats {
  kills: number;
  deaths: number;
  time_played: number;
  player_kills: number;
  team_kills: number;
  longest_kill_streak: number;
  targets_destroyed: number;
  vehicles_destroyed: number;
  soldiers_healed: number;
  times_got_healed: number;
  distance_moved: number;
  shots_fired: number;
  throwables_thrown: number;
  rank_progression: number;
}

export interface ComplexStats extends Stats {
  rank: number;
  "K/D": number;
  profile_id: number;
  username: string;
  time_played_display: string;
}
