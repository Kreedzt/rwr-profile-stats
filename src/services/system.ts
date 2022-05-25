// SPDX-License-Identifier: GPL-3.0-only
import { request } from "./request";
import { CacheService } from "./cache";

export const SYSTEM_API_PREFIX = "system";

export const SystemService = {
  queryRanks: async (force?: boolean): Promise<RankItem[]> => {
    if (!force) {
      const rankCache = await CacheService.getRankCache();

      if (rankCache) {
        return rankCache;
      }
    }

    const res = (await request(
      "GET",
      `${SYSTEM_API_PREFIX}/query_ranks`
    )) as RankItem[];

    await CacheService.setRankCache(res);

    return res;
  },
};
