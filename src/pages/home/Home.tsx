// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback, useEffect, useState } from "react";
import { Link, RouteComponentProps, useNavigate } from "@reach/router";
import { Person } from "../../models/person";
import { Profile } from "../../models/profile";
import { ProfileService } from "../../services/profile";
import RefreshButton from "../../components/refreshButton/RefreshButton";
import { SystemService } from "../../services/system";
import DangerButton from "../../components/button/DangerButton";
import PrimaryButton from "../../components/button/PrimaryButton";
import ProfileListItem from "../../components/list/ProfileListItem";
import MainFooter from "../../components/footer/MainFooter";
import UpdateTime from "../../components/time/UpdateTime";
import WarnAlert from "../../components/alert/WarnAlert";
import Input from "../../components/input/Input";
import "./Home.less";

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

  const onSearchInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    (e.target as any).value = (e.target as any).value.toUpperCase();
  }, []);

  const onSearchValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    []
  );

  const onGotoDetail = useCallback((profileId: number) => {
    navigate(`/profile/${profileId}`);
  }, []);

  useEffect(() => {
    refreshList();
  }, []);

  return (
    <div className="home-layout bg-gray-100">
      <div>
        <WarnAlert content="数据每 1 小时更新一次, 请勿频繁查询导致服务器崩溃" />
      </div>
      <div className="home-content">
        <div className="query-area">
          <div className="p-2">
            <Input
              value={searchText}
              onInput={onSearchInput}
              placeholder="输入用户名查询"
              onChange={onSearchValueChange}
            />

            <div className="m-2">
              <DangerButton
                className="md:mb-0 sm:mb-2 md:mr-2 sm:mr-0"
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

            <div className="m-2">
              <RefreshButton
                loading={loading}
                onRefresh={() => {
                  setSearchText("");
                  setNameUserList([]);
                  refreshList(true);
                }}
              />
            </div>

            <UpdateTime content={`更新时间：${cacheTime}`} />

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
          </div>
        </div>

        <div className="mt-2">
          <Link to="/rank">
            <PrimaryButton>跳转排名页面</PrimaryButton>
          </Link>
        </div>

        <div className="top-10-area">
          <h5 className="font-sans text-xl font-semibold">XP Top 10</h5>
          <ul className="query-name-res-list">
            {top10List.map((item, index) => {
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
      </div>
      <MainFooter />
    </div>
  );
};

export default Home;
