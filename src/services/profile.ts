import { request } from "./request";
import { Profile } from "../models/profile";
import { Person } from "../models/person";
import { CacheService } from "./cache";

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
    )) as Array<[number, Person, Profile]>;

    await CacheService.setQueryCache(res);

    return res;
  },
};
