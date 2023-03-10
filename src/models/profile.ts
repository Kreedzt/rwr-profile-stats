import { Stats } from "./stats";

// SPDX-License-Identifier: GPL-3.0-only
export interface Profile {
  color: string;
  game_version: string;
  rid: string;
  sid: string;
  squad_tag: string;
  username: string;
  stats: Stats;
}
