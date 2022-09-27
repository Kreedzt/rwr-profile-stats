// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback } from "react";
import { Button, message } from "antd";
import { CacheService } from "../../services/cache";

interface RefreshButtonProps {
  loading?: boolean;
  onRefresh: () => void;
}

const RefreshButton: FC<RefreshButtonProps> = ({ loading, onRefresh }) => {
  const refresh = useCallback(async () => {
    const amountTime = await CacheService.getButtonExpiredTime();

    if (amountTime > 0) {
      message.warn(`请求频繁, ${amountTime} 秒后才可再次请求`);
      return;
    }

    onRefresh();
    await CacheService.refreshButtonExpireTime();
  }, []);

  // return (
  //   <Button danger loading={loading} onClick={refresh}>
  //     强制重新获取(请求时间稍长, 限制1分钟请求一次)
  //   </Button>
  // );

  return (
    <button
      type="button"
      className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-red-200"
      disabled={loading}
      onClick={refresh}
    >
      强制重新获取(请求时间稍长, 限制1分钟请求一次)
    </button>
  );
};

export default RefreshButton;
