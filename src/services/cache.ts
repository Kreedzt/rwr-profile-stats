import * as localForage from "localforage";
import { Person } from "../models/person";
import { Profile } from "../models/profile";
import { QUERY_CACHE_STORAGE_KEY, QUERY_TIME_STORAGE_KEY } from "../constants";
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
};
