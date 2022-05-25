// SPDX-License-Identifier: GPL-3.0-only
import * as localForage from "localforage";
import { Person } from "../models/person";
import { Profile } from "../models/profile";
import { RankItem } from "../models/system";
import {
  BUTTON_EXPIRED_STORAGE_KEY,
  QUERY_CACHE_STORAGE_KEY,
  QUERY_TIME_STORAGE_KEY,
  RANK_CACHE_STORAGE_KEY,
  RES_TIME_STORAGE_KEY,
} from "../constants";
import dayjs from "dayjs";

type AllListItem = [number, Person, Profile];

export const CacheService = {
  getQueryCache: async (): Promise<AllListItem[] | undefined> => {
    const currentTime = dayjs().unix();
    const expiredTime: number | null = await localForage.getItem(
      QUERY_TIME_STORAGE_KEY
    );
    if (!expiredTime) return undefined;

    if (currentTime > +expiredTime) return undefined;

    const data: null | AllListItem[] = await localForage.getItem(
      QUERY_CACHE_STORAGE_KEY
    );

    if (!data) return undefined;

    return data;
  },
  setQueryCache: async (resData: AllListItem[]) => {
    const nextExpiredTime = dayjs().add(1, "hour").unix();
    await localForage.setItem(QUERY_TIME_STORAGE_KEY, nextExpiredTime);
    await localForage.setItem(QUERY_CACHE_STORAGE_KEY, resData);
  },
  getResTimeCache: async (): Promise<string | undefined> => {
    return (await localForage.getItem(RES_TIME_STORAGE_KEY)) as
      | string
      | undefined;
  },
  setResTimeCache: async (time: string) => {
    await localForage.setItem(RES_TIME_STORAGE_KEY, time);
  },
  getRankCache: async (): Promise<RankItem[] | undefined> => {
    return (await localForage.getItem(RANK_CACHE_STORAGE_KEY)) as
      | RankItem[]
      | undefined;
  },
  setRankCache: async (ranks: RankItem[]) => {
    await localForage.setItem(RANK_CACHE_STORAGE_KEY, ranks);
  },
  getButtonExpiredTime: async (): Promise<number> => {
    const now = dayjs().unix();
    const expiredTime: number | null = await localForage.getItem(
      BUTTON_EXPIRED_STORAGE_KEY
    );
    let amountTime = 0;
    if (!expiredTime) {
      return amountTime;
    }

    if (now < +expiredTime) {
      // diff time
      const lessTime = dayjs(now);
      const moreTime = dayjs(+expiredTime);

      const duration = dayjs.duration(moreTime.diff(lessTime)).milliseconds();

      if (duration > 0) {
        amountTime = duration;
      }
    }

    return amountTime;
  },
  refreshButtonExpireTime: async () => {
    const nextTime = dayjs().add(1, "m").unix();

    await localForage.setItem(BUTTON_EXPIRED_STORAGE_KEY, nextTime);
  },
};
