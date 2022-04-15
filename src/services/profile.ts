import { request } from "./request";
import { Profile } from "../models/profile";
import { Person } from "../models/person";
import { CacheService } from "./cache";
import { AllProfileList, QueryAllCacheV2Response } from "../models/response";

export const PROFILE_API_PREFIX = "profile";

export const ProfileService = {
  query: async (id: string) => {
    return (await request(
      "GET",
      `${PROFILE_API_PREFIX}/query/${id}`
    )) as Promise<Profile>;
  },
  queryAllCache: async (force?: boolean) => {
    if (!force) {
      const cache = await CacheService.getQueryCache();
      if (cache) {
        return cache;
      }
    }

    const res = (await request(
      "GET",
      `${PROFILE_API_PREFIX}/query_all_cache`
    )) as AllProfileList;

    await CacheService.setQueryCache(res);

    return res;
  },
  queryAllCacheV2: async (
    force?: boolean
  ): Promise<{
    allList: AllProfileList;
    time: string;
  }> => {
    if (!force) {
      const cache = await CacheService.getQueryCache();
      const time = (await CacheService.getResTimeCache()) as string;
      if (cache) {
        return {
          allList: cache,
          time,
        };
      }
    }

    const { all_person_list_str, snapshot_time } = (await request(
      "GET",
      `${PROFILE_API_PREFIX}/query_all_cache_v2`
    )) as QueryAllCacheV2Response;

    const cacheValue = JSON.parse(all_person_list_str) as Array<
      [number, Person, Profile]
    >;

    await CacheService.setQueryCache(cacheValue);
    await CacheService.setResTimeCache(snapshot_time);

    return {
      allList: cacheValue,
      time: snapshot_time,
    };
  },
};
