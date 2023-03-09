// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback, useEffect, useState } from "react";
import { Alert, Button, Input, Layout, List, Typography } from "antd";
import { RouteComponentProps, Link, useNavigate } from "@reach/router";
import { VERSION } from "../../constants";
import { Person } from "../../models/person";
import { Profile } from "../../models/profile";
import { ProfileService } from "../../services/profile";
import RefreshButton from "../../components/refreshButton/RefreshButton";
import "./Home.less";
import { SystemService } from "../../services/system";
import DangerButton from "../../components/button/DangerButton";
import PrimaryButton from "../../components/button/PrimaryButton";
import ProfileListItem from "../../components/list/ProfileListItem";
import MainFooter from "../../components/footer/MainFooter";

const { Footer, Content } = Layout;
// const { Item: ListItem } = List;

type AllListItem = [number, Person, Profile];

const Home: FC<RouteComponentProps> = () => {
  const [allList, setAllList] = useState<AllListItem[]>([]);
  const [cacheTime, setCacheTime] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>();
  const [nameUserList, setNameUserList] = useState<AllListItem[]>([]);
  const [top10List, setTop10List] = useState<AllListItem[]>([]);
  const navigate = useNavigate();

  const refreshTop10List = useCallback((al: AllListItem[]) => {
    const sortedList = al.sort((a, b) => {
      return b[2].stats.rank_progression - a[2].stats.rank_progression;
    });

    const top10 = sortedList.slice(0, 10);

    setTop10List(top10);
  }, []);

  const refreshList = useCallback(async (force?: boolean) => {
    try {
      setLoading(true);
      const [{ allList, time }, ranks] = await Promise.all([
        ProfileService.queryAllCacheV2(force),
        SystemService.queryRanks(force),
      ]);
      setAllList(allList);
      setCacheTime(time);
      refreshTop10List(allList);

      console.log("ranks", ranks);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const onQuery = useCallback(() => {
    if (!searchText) {
      setNameUserList([...allList]);
    } else {
      setNameUserList(
        allList.filter((info) => {
          return info[2].username.includes(searchText);
        })
      );
    }
  }, [searchText, allList]);

  const onGotoDetail = useCallback((profileId: number) => {
    navigate(`/profile/${profileId}`);
  }, []);

  useEffect(() => {
    refreshList();
  }, []);

  return (
    <Layout className="home-layout">
      <div>
        <Alert
          message="数据每 1 小时更新一次, 请勿频繁查询导致服务器崩溃"
          type="warning"
        />
      </div>
      <Content className="home-content">
        <div className="query-area">
          <div>
            <Input
              value={searchText}
              placeholder="输入用户名查询"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div>
              <DangerButton
                disabled={loading}
                onClick={() => {
                  setSearchText("");
                  setNameUserList([]);
                }}
              >
                重置查询内容
              </DangerButton>

              <PrimaryButton disabled={loading} onClick={onQuery}>
                查询
              </PrimaryButton>
            </div>
            <RefreshButton
              className="m-2"
              loading={loading}
              onRefresh={() => {
                setSearchText("");
                setNameUserList([]);
                refreshList(true);
              }}
            />

            <p>更新时间：{cacheTime}</p>

            <div>
              <h5 className="font-sans text-xl font-semibold">查询结果列表</h5>
              <ul className="query-name-res-list">
                {nameUserList.map((item, index) => {
                  return (
                    <li key={item[0]}>
                      <ProfileListItem
                        onClick={() => onGotoDetail(item[0])}
                        profile_id={item[0]}
                        username={item[2].username}
                        prefix={`#${index + 1}`}
                        content={`XP: ${(
                          item[2].stats.rank_progression * 10000
                        ).toFixed(2)}`}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
            {/*<List*/}
            {/*  className="query-name-res-list"*/}
            {/*  header={<div>查询结果列表</div>}*/}
            {/*  dataSource={nameUserList}*/}
            {/*  bordered*/}
            {/*  size="small"*/}
            {/*  renderItem={(item) => (*/}
            {/*    <ListItem*/}
            {/*      key={item[0]}*/}
            {/*      className="query-list-item"*/}
            {/*      onClick={() => onGotoDetail(item[0])}*/}
            {/*    >*/}
            {/*      <Typography.Text>*/}
            {/*        <span>用户名: {item[2].username}</span>*/}
            {/*        &nbsp; |&nbsp;*/}
            {/*        <span>*/}
            {/*          游玩时间: {(item[2].stats.time_played / 60).toFixed()}{" "}*/}
            {/*          分钟*/}
            {/*        </span>*/}
            {/*      </Typography.Text>*/}
            {/*      <Link to={`/profile/${item[0]}`}>点击跳转到详情</Link>*/}
            {/*    </ListItem>*/}
            {/*  )}*/}
            {/*/>*/}
          </div>
        </div>
        <div className="top-10-area">
          <h5 className="font-sans text-xl font-semibold">XP Top 10</h5>
          <ul className="query-name-res-list">
            {top10List.map((item, index) => {
              return (
                <li key={item[0]}>
                  <ProfileListItem
                    profile_id={item[0]}
                    username={item[2].username}
                    prefix={`#${index + 1}`}
                    content={`XP: ${(
                      item[2].stats.rank_progression * 10000
                    ).toFixed(2)}`}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </Content>
      {/*<Footer className="home-footer">RWR 信息查询系统, v: {VERSION}</Footer>*/}
      <MainFooter />
    </Layout>
  );
};

export default Home;
