// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { ProfileService } from "../../services/profile";
import { Alert, Button, Col, message, Progress, Row } from "antd";
import {
  getRankProgressPercent,
  getViewList,
  ProfileViewListItem,
  ProgressInfo,
} from "./utils";
import { Profile as ProfileModel } from "../../models/profile";
import RefreshButton from "../../components/refreshButton/RefreshButton";
import "./Profile.less";

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
        <Alert message="可将此页面地址保存, 下次直接进入" type="success" />
        <Alert message={`符号 '#' 表示排行`} type="success" />
      </div>
      <Button>
        <Link to="/">&lt; 返回主页</Link>
      </Button>
      <RefreshButton loading={loading} onRefresh={() => refreshProfile(true)} />
      <p>存档ID：{profileId}</p>
      <p>更新时间：{cacheTime}</p>
      {loading ? (
        "请求中, 请稍候"
      ) : (
        <>
          <div className="xp-info">
            <Row gutter={10}>
              <Col className="tar" span={12}>
                XP:
              </Col>
              <Col span={12} className="tal">
                {currentProfile?.stats.rank_progression
                  ? currentProfile?.stats.rank_progression * 10000
                  : 0}
              </Col>
            </Row>
            <Row gutter={10}>
              <Col className="tar" span={12}>
                当前等级:
              </Col>
              <Col span={12} className="tal">
                {progressData.currentLabel}
              </Col>
            </Row>
            <Row gutter={10}>
              <Col className="tar" span={12}>
                下一等级:
              </Col>
              <Col span={12} className="tal">
                {progressData.nextLabel}
              </Col>
            </Row>

            <Row gutter={10}>
              <Col className="tar" span={12}>
                下一等级目标XP:
              </Col>
              <Col span={12} className="tal">
                {progressData.nextXp * 10000}
              </Col>
            </Row>

            <Row gutter={10}>
              <Col className="tar" span={12}>
                进度:
              </Col>
              <Col span={12} className="tal">
                {progressPercent}%
              </Col>
            </Row>
            <Progress percent={progressPercent} showInfo={false} />
          </div>
          {viewList.map((v) => (
            <Row key={v.label} gutter={10}>
              <Col className="tar" span={12}>
                {v.label}:
              </Col>
              <Col className="tal" span={12}>
                {v.displayText}
                {v.rank && (
                  <>
                    <span>&nbsp; | &nbsp;</span>
                    <span>#{v.rank}</span>
                  </>
                )}
              </Col>
            </Row>
          ))}
        </>
      )}
    </div>
  );
};

export default Profile;
