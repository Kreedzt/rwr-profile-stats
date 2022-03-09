import { API_PREFIX } from "../constants";
import { request } from "./request";
import { Profile } from "../models/profile";

export const PROFILE_API_PREFIX = "profile";

export const ProfileService = {
  query: async (id: string) => {
    return (await request(
      "GET",
      `${PROFILE_API_PREFIX}/query/${id}`
    )) as Promise<Profile>;
  },
};
