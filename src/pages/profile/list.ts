import { Profile } from "../../models/profile";
import CNTranslate from "./translate_cn.json";

export interface ProfileViewListItem {
  label: string;
  value: any;
}

export const getViewList = (p: Profile): ProfileViewListItem[] => {
  return [
    {
      label: CNTranslate["username"],
      value: p.username,
    },
    {
      label: CNTranslate["sid"],
      value: p.sid,
    },
    {
      label: CNTranslate["squad_tag"],
      value: p.squad_tag,
    },
    {
      label: CNTranslate["kills"],
      value: p.stats.kills,
    },
    {
      label: CNTranslate["deaths"],
      value: p.stats.deaths,
    },
    {
      label: CNTranslate["K/D"],
      value: `${(p.stats.kills / p.stats.deaths).toFixed(2)}`,
    },
    {
      label: CNTranslate["soldiers_healed"],
      value: p.stats.soldiers_healed,
    },
    {
      label: CNTranslate["rank_progression"],
      value: p.stats.rank_progression,
    },
    {
      label: CNTranslate["time_played"],
      value: p.stats.time_played,
    },
    {
      label: CNTranslate["vehicles_destroyed"],
      value: p.stats.vehicles_destroyed,
    },
    {
      label: CNTranslate["targets_destroyed"],
      value: p.stats.time_played,
    },
  ];
};
