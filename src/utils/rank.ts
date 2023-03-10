import {Profile} from "../models/profile";
import CNTranslate from "../models/translate_cn.json";
import {RankItem} from "../models/system";
import {ComplexStats, Stats} from "../models/stats";
import {AllProfileList} from "../models/response";

interface GeneralArrayItem {
  label: string;
  value: any;
}

export type ProfileViewListItem = GeneralArrayItem & {
  rank?: number;
  displayText: string;
};
const getRankInList = (
  value: number,
  rankList: number[],
  reverse?: boolean
): number => {
  let isFinished = false;
  let rank = 1;
  if (rankList.length === 0) {
    return 1;
  }

  rankList.forEach((score, index) => {
    if (isFinished) return;

    if (reverse) {
      if (value <= score) {
        isFinished = true;
        rank = index + 1;
      }
    } else if (value >= score) {
      isFinished = true;
      rank = index + 1;
    }
  });

  if (!isFinished) {
    rank = rankList.length + 1;
  }

  return rank;
};
type RankValueRecordKey = keyof Stats | "K/D";

export const transformProfile2CStats = (
  profile_id: number,
  p: Profile
): ComplexStats => {
  const enhanceItem: ComplexStats = {
    rank: 0,
    profile_id,
    username: p.username,
    kills: p.stats.kills,
    deaths: p.stats.deaths,
    time_played: p.stats.time_played,
    player_kills: p.stats.player_kills,
    team_kills: p.stats.team_kills,
    longest_kill_streak: p.stats.longest_kill_streak,
    targets_destroyed: p.stats.targets_destroyed,
    vehicles_destroyed: p.stats.vehicles_destroyed,
    soldiers_healed: p.stats.soldiers_healed,
    times_got_healed: p.stats.times_got_healed,
    distance_moved: p.stats.distance_moved,
    shots_fired: p.stats.shots_fired,
    throwables_thrown: p.stats.throwables_thrown,
    rank_progression: p.stats.rank_progression,
    time_played_display: (p.stats.time_played / 60).toFixed(0) + " 分钟",
    "K/D": 0,
  };

  if (p.stats.deaths === 0) {
    enhanceItem["K/D"] = p.stats.kills;
  } else {
    enhanceItem["K/D"] = p.stats.kills / p.stats.deaths;
  }

  return enhanceItem;
};

/**
 * 获取所有排行值, 附带排序方法
 * @param list
  */
export const transformAll2StatsWithSort = (
  list: AllProfileList
): ComplexStats[] => {
  return list.map((p) => transformProfile2CStats(p[0], p[2]));
};

/**
 * 获取自身所有 rank 值
 * @param p
 * @param list
 */
const getProfileAllRankValue = (
  p: Profile,
  list: Profile[]
): Record<RankValueRecordKey, number> => {
  const res: Record<RankValueRecordKey, number> = {
    kills: 0,
    deaths: 0,
    time_played: 0,
    player_kills: 0,
    team_kills: 0,
    longest_kill_streak: 0,
    targets_destroyed: 0,
    vehicles_destroyed: 0,
    soldiers_healed: 0,
    times_got_healed: 0,
    distance_moved: 0,
    shots_fired: 0,
    throwables_thrown: 0,
    rank_progression: 0,
    "K/D": 0,
  };

  let deathsRank: number[] = [];
  let killsRank: number[] = [];
  let kdRank: number[] = [];
  let playerKillsRank: number[] = [];
  let rankProgressRank: number[] = [];
  let shotsFiredRank: number[] = [];
  let soldiersHealedRank: number[] = [];
  let targetsDestroyedRank: number[] = [];
  let teamKillsRank: number[] = [];
  let throwablesThrownRank: number[] = [];
  let timePlayedRank: number[] = [];
  let timesGotHealedRank: number[] = [];
  let vehiclesDestroyedRank: number[] = [];

  list.forEach((listItem) => {
    deathsRank.push(listItem.stats.deaths);
    killsRank.push(listItem.stats.kills);

    let kdRes: number;

    if (listItem.stats.deaths === 0) {
      kdRes = listItem.stats.kills;
    } else {
      kdRes = listItem.stats.kills / listItem.stats.deaths;
    }

    kdRank.push(kdRes);
    playerKillsRank.push(listItem.stats.player_kills);
    rankProgressRank.push(listItem.stats.rank_progression);
    shotsFiredRank.push(listItem.stats.shots_fired);
    soldiersHealedRank.push(listItem.stats.soldiers_healed);
    targetsDestroyedRank.push(listItem.stats.targets_destroyed);
    teamKillsRank.push(listItem.stats.team_kills);
    throwablesThrownRank.push(listItem.stats.throwables_thrown);
    timePlayedRank.push(listItem.stats.time_played);
    timesGotHealedRank.push(listItem.stats.times_got_healed);
    vehiclesDestroyedRank.push(listItem.stats.vehicles_destroyed);
  });

  // 优先最低
  res["deaths"] = getRankInList(
    p.stats.deaths,
    deathsRank.sort((a, b) => a - b),
    true
  );

  // 优先最高
  res["kills"] = getRankInList(
    p.stats.kills,
    killsRank.sort((a, b) => b - a)
  );

  // 优先最高
  res["K/D"] = getRankInList(
    p.stats.kills / p.stats.deaths,
    kdRank.sort((a, b) => b - a)
  );

  // 优先最低
  res["player_kills"] = getRankInList(
    p.stats.player_kills,
    playerKillsRank.sort((a, b) => a - b),
    true
  );

  // 优先最高
  res["rank_progression"] = getRankInList(
    p.stats.rank_progression,
    rankProgressRank.sort((a, b) => b - a)
  );

  // 优先最高
  res["shots_fired"] = getRankInList(
    p.stats.shots_fired,
    shotsFiredRank.sort((a, b) => b - a)
  );

  // 优先最高
  res["soldiers_healed"] = getRankInList(
    p.stats.soldiers_healed,
    soldiersHealedRank.sort((a, b) => b - a)
  );

  // 优先最高
  res["targets_destroyed"] = getRankInList(
    p.stats.targets_destroyed,
    targetsDestroyedRank.sort((a, b) => b - a)
  );

  // 优先最低
  res["team_kills"] = getRankInList(
    p.stats.team_kills,
    teamKillsRank.sort((a, b) => a - b),
    true
  );

  // 优先最高
  res["throwables_thrown"] = getRankInList(
    p.stats.throwables_thrown,
    throwablesThrownRank.sort((a, b) => b - a)
  );

  // 优先最高
  res["time_played"] = getRankInList(
    p.stats.time_played,
    timePlayedRank.sort((a, b) => b - a)
  );

  // 优先最低
  res["times_got_healed"] = getRankInList(
    p.stats.times_got_healed,
    timesGotHealedRank.sort((a, b) => a - b),
    true
  );

  // 优先最高
  res["vehicles_destroyed"] = getRankInList(
    p.stats.vehicles_destroyed,
    vehiclesDestroyedRank.sort((a, b) => b - a)
  );

  return res;
};
export const getProfileViewList = (
  p: Profile,
  allList: Profile[]
): ProfileViewListItem[] => {
  const rankValue = getProfileAllRankValue(p, allList);
  return [
    {
      label: CNTranslate["username"],
      value: p.username,
      displayText: p.username,
    },
    {
      label: CNTranslate["sid"],
      value: p.sid,
      displayText: p.sid,
    },
    {
      label: CNTranslate["squad_tag"],
      value: p.squad_tag,
      displayText: p.squad_tag,
    },
    {
      label: CNTranslate["kills"],
      value: p.stats.kills,
      rank: rankValue["kills"],
      displayText: p.stats.kills.toString(),
    },
    {
      label: CNTranslate["deaths"],
      value: p.stats.deaths,
      rank: rankValue["deaths"],
      displayText: p.stats.deaths.toString(),
    },
    {
      label: CNTranslate["K/D"],
      value: `${(p.stats.kills / p.stats.deaths).toFixed(2)}`,
      rank: rankValue["K/D"],
      displayText: (p.stats.kills / p.stats.deaths).toFixed(2),
    },
    {
      label: CNTranslate["soldiers_healed"],
      value: p.stats.soldiers_healed,
      rank: rankValue["soldiers_healed"],
      displayText: p.stats.soldiers_healed.toString(),
    },
    // {
    //   label: CNTranslate["player_kills"],
    //   value: p.stats.player_kills,
    //   rank: rankValue["player_kills"],
    //   displayText: p.stats.player_kills.toString(),
    // },
    {
      label: CNTranslate["team_kills"],
      value: p.stats.team_kills,
      rank: rankValue["team_kills"],
      displayText: p.stats.team_kills.toString(),
    },
    {
      label: CNTranslate["time_played"],
      value: p.stats.time_played,
      rank: rankValue["time_played"],
      displayText: `${(p.stats.time_played / 60).toFixed(0)} 分钟`,
    },
    {
      label: CNTranslate["vehicles_destroyed"],
      value: p.stats.vehicles_destroyed,
      rank: rankValue["vehicles_destroyed"],
      displayText: p.stats.vehicles_destroyed.toString(),
    },
    {
      label: CNTranslate["targets_destroyed"],
      value: p.stats.targets_destroyed,
      rank: rankValue["targets_destroyed"],
      displayText: p.stats.targets_destroyed.toString(),
    },
  ];
};

export interface ProgressInfo {
  currentLabel: string;
  nextLabel: string;
  nextXp: number;
  progress: number;
}

export const getDynamicRankProgressPercent = (
  p: Profile,
  ranks: RankItem[]
): ProgressInfo => {
  const currentXp = p.stats.rank_progression;

  let nextXp = 0;
  let currentLabel = "";
  let nextLabel = "";
  let isFinished = false;
  let progress: number;

  ranks.forEach((r) => {
    if (isFinished) return;

    nextXp = r.xp;
    nextLabel = r.name;

    // 当前 XP < 目标 XP, 终止
    if (currentXp < nextXp) {
      isFinished = true;
      return;
    }

    currentLabel = r.name;
  });

  progress = currentXp / nextXp;

  return {
    currentLabel,
    nextLabel,
    nextXp,
    progress,
  };
};
