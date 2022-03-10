import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { ProfileService } from "../../services/profile";
import { message, Progress, Spin } from "antd";
import {
  getRankProgressPercent,
  getViewList,
  ProfileViewListItem,
  ProgressInfo,
} from "./utils";
import { Profile as ProfileModel } from "../../models/profile";

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

  const refreshProfile = useCallback(async () => {
    if (!profileId) {
      message.warn("未找到信息");
      return;
    }
    try {
      setLoading(true);
      const allList = await ProfileService.queryAllCache();

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
      const progressInfo = getRankProgressPercent(profile);
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
    <div>
      <p>Profile: {profileId}</p>
      {loading && "请求中, 请稍候"}
      <div>
        <p>XP: {currentProfile?.stats.rank_progression}</p>
        <p>当前等级: {progressData.currentLabel}</p>
        <p>下一等级: {progressData.nextLabel}</p>
        <p>下一阶段所需XP: {progressData.nextXp}</p>
        <Progress percent={progressPercent} />
      </div>
      {viewList.map((v) => (
        <div key={v.label}>
          <p>
            {v.label}: {v.displayText}
            {v.rank && <span>#{v.rank}</span>}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Profile;
