// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { ProfileService } from "../../services/profile";
import { Alert, Button, Col, message, Progress, Row } from "antd";
import {
  getDynamicRankProgressPercent,
  getRankProgressPercent,
  getViewList,
  ProfileViewListItem,
  ProgressInfo,
} from "./utils";
import { Profile as ProfileModel } from "../../models/profile";
import RefreshButton from "../../components/refreshButton/RefreshButton";
import "./Profile.less";
import { CacheService } from "../../services/cache";
import { SystemService } from "../../services/system";
import WarnAlert from "../../components/alert/WarnAlert";
import SuccessAlert from "../../components/alert/SuccessAlert";
import PrimaryButton from "../../components/button/PrimaryButton";
import UpdateTime from "../../components/time/UpdateTime";
import ProgressBar from "../../components/progress/ProgressBar";
import PropertyItem from "../../components/propertyItem/PropertyItem";

const Profile: FC<
  RouteComponentProps & {
    id?: string;
  }
> = (props) => {
  const profileId = props.id;

  const [loading, setLoading] = useState<boolean>(false);
  const [viewList, setViewList] = useState<ProfileViewListItem[]>([]);
  const [currentProfile, setCurrentProfile] = useState<ProfileModel>();
  const [progressData, setProgressData] = useState<ProgressInfo>({
    currentLabel: "",
    nextLabel: "",
    nextXp: 0,
    progress: 0,
  });
  const [cacheTime, setCacheTime] = useState<string>();

  const refreshProfile = useCallback(async (force?: boolean) => {
    if (!profileId) {
      message.warn("未找到信息");
      return;
    }
    try {
      setLoading(true);
      const { allList, time } = await ProfileService.queryAllCacheV2(force);

      await SystemService.queryRanks(force);

      const info = allList.find(([pId, person, profile]) => {
        return pId === +profileId;
      });

      if (!info) {
        message.warn("未找到指定用户");
        return;
      }

      const [pId, person, profile] = info;

      setCurrentProfile(profile);
      setViewList(
        getViewList(
          profile,
          allList.map((info) => info[2])
        )
      );
      setCacheTime(time);

      const ranks = await CacheService.getRankCache();
      if (!ranks) {
        return;
      }
      const progressInfo = getDynamicRankProgressPercent(profile, ranks);
      setProgressData(progressInfo);

      console.log("res", pId, person, profile);
    } catch (e) {
      console.log("err", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, []);

  const progressPercent = useMemo(() => {
    return +(progressData.progress * 100).toFixed(2);
  }, [progressData.progress]);

  return (
    <div className="profile-page">
      <div>
        <WarnAlert content="数据每 1 小时更新一次, 请勿频繁查询导致服务器崩溃" />
        <SuccessAlert content="可将此页面地址保存, 下次直接进入" />
        <SuccessAlert content="符号 '#' 表示排行" />
      </div>
      <Link to="/">
        <PrimaryButton>&lt; 返回主页</PrimaryButton>
      </Link>
      <RefreshButton loading={loading} onRefresh={() => refreshProfile(true)} />
      <p>存档ID：{profileId}</p>
      <UpdateTime content={`更新时间：${cacheTime}`} />
      {loading ? (
        "请求中, 请稍候"
      ) : (
        <>
          <div className="p-2 border border-blue-200 m-2">
            <PropertyItem
              label="XP"
              value={
                currentProfile?.stats.rank_progression
                  ? currentProfile?.stats.rank_progression * 10000
                  : 0
              }
            />
            <PropertyItem label="当前等级" value={progressData.currentLabel} />
            <PropertyItem label="下一等级" value={progressData.nextLabel} />
            <PropertyItem
              label="下一等级目标XP"
              value={progressData.nextXp * 10000}
            />
            <PropertyItem label="进度" value={`${progressPercent}%`} />

            <ProgressBar value={progressPercent} />
          </div>
          {viewList.map((v) => (
            <PropertyItem
              key={v.label}
              label={v.label}
              value={
                <>
                  {v.displayText}
                  {v.rank && (
                    <>
                      <span>&nbsp; | &nbsp;</span>
                      <span>#{v.rank}</span>
                    </>
                  )}
                </>
              }
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Profile;
