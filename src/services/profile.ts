import { request } from "./request";
import { Profile } from "../models/profile";
import { Person } from "../models/person";

export const PROFILE_API_PREFIX = "profile";

export const ProfileService = {
  query: async (id: string) => {
    return (await request(
      "GET",
      `${PROFILE_API_PREFIX}/query/${id}`
    )) as Promise<Profile>;
  },
  queryAllCache: async () => {
    return (await request(
      "GET",
      `${PROFILE_API_PREFIX}/query_all_cache`
    )) as Promise<Array<[number, Person, Profile]>>;
  },
};
