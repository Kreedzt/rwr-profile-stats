import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { ProfileService } from "../../services/profile";
import {Alert, Button, message, Progress, Spin} from "antd";
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

  const refreshProfile = useCallback(async (force?: boolean) => {
    if (!profileId) {
      message.warn("未找到信息");
      return;
    }
    try {
      setLoading(true);
      const allList = await ProfileService.queryAllCache(force);

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
    <div className="profile-page">
      <div>
        <Alert
          message="数据每 1 小时更新一次, 请勿频繁查询导致服务器崩溃"
          type="warning"
        />
        <Alert
            message="可将此页面地址保存, 下次直接进入"
            type="success"
        />
      </div>
      <Button>
        <Link to="/">&lt; 返回主页</Link>
      </Button>
      <Button danger loading={loading} onClick={() => refreshProfile(true)}>
        强制重新获取(请求时间稍长)
      </Button>
      <p>存档ID: {profileId}</p>
      {loading ? (
        "请求中, 请稍候"
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default Profile;
