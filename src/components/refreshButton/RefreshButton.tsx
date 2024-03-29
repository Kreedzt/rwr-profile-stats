// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback } from "react";
import { Button, message } from "antd";
import { CacheService } from "../../services/cache";
import DangerButton from "../button/DangerButton";

interface RefreshButtonProps {
  className?: string;
  loading?: boolean;
  onRefresh: () => void;
}

const RefreshButton: FC<RefreshButtonProps> = ({
  loading,
  onRefresh,
  className,
}) => {
  const refresh = useCallback(async () => {
    const amountTime = await CacheService.getButtonExpiredTime();

    if (amountTime > 0) {
      message.warn(`请求频繁, ${amountTime} 秒后才可再次请求`);
      return;
    }

    onRefresh();
    await CacheService.refreshButtonExpireTime();
  }, []);

  return (
    <DangerButton className={className} disabled={loading} onClick={refresh}>
      {loading
        ? "请求数据中..."
        : "强制重新获取(请求时间稍长, 限制1分钟请求一次)"}
    </DangerButton>
  );
};

export default RefreshButton;
