import { Profile } from "../../models/profile";
import CNTranslate from "./translate_cn.json";

interface GeneralArrayItem {
  label: string;
  value: any;
}

export type ProfileViewListItem = GeneralArrayItem;

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

const rankTarget: GeneralArrayItem[] = [
  {
    label: "2 星人形",
    value: 0.0,
  },
  {
    label: "3 星人形",
    value: 1.0,
  },
  {
    label: "4 星人形",
    value: 5.0,
  },
  {
    label: "5 星人形",
    value: 10.0,
  },
  {
    label: "6 星人形",
    value: 100.0,
  },
  {
    label: "1 月人形",
    value: 200.0,
  },
  {
    label: "2 月人形",
    value: 300.0,
  },
  {
    label: "3 月人形",
    value: 400.0,
  },
  {
    label: "4 月人形",
    value: 500.0,
  },
  {
    label: "5 月人形",
    value: 750.0,
  },
  {
    label: "1 日人形",
    value: 1000.0,
  },
];

export const getRankProgressPercent = (p: Profile) => {
  let currentXp = p.stats.rank_progression;

  rankTarget.forEach(r => {
    
  })
};
