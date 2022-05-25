// SPDX-License-Identifier: GPL-3.0-only
import { Person } from "./person";
import { Profile } from "./profile";

export interface ErrorResponse {
  status: number;
  code: number;
  message: string;
}

export interface LoginResponse {
  name: string;
  user_id: number;
  password: string;
  admin: number;
}

export interface QueryAllCacheV2Response {
  all_person_list_str: string;
  snapshot_time: string;
}

export type ProfileListItem = [number, Person, Profile];
export type AllProfileList = Array<[number, Person, Profile]>;
