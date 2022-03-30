import React, { FC, useCallback, useEffect, useState } from "react";
import { Alert, Button, Input, Layout, List, Typography } from "antd";
import { RouteComponentProps, Link, useNavigate } from "@reach/router";
import { VERSION } from "../../constants";
import { Person } from "../../models/person";
import { Profile } from "../../models/profile";
import { ProfileService } from "../../services/profile";
import "./Home.less";
import RefreshButton from "../../components/refreshButton/RefreshButton";

const { Footer, Content } = Layout;
const { Item: ListItem } = List;

type AllListItem = [number, Person, Profile];

const Home: FC<RouteComponentProps> = () => {
  const [allList, setAllList] = useState<AllListItem[]>([]);
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
      const allList = await ProfileService.queryAllCache(force);
      setAllList(allList);
      refreshTop10List(allList);
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
  }, [searchText]);

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
              <Button
                loading={loading}
                danger
                onClick={() => {
                  setSearchText("");
                  setNameUserList([]);
                }}
              >
                重置查询内容
              </Button>

              <Button type="primary" loading={loading} onClick={onQuery}>
                查询
              </Button>
            </div>
            <RefreshButton
              loading={loading}
              onRefresh={() => {
                setSearchText("");
                setNameUserList([]);
                refreshList(true);
              }}
            />

            <List
              className="query-name-res-list"
              header={<div>查询结果列表</div>}
              dataSource={nameUserList}
              bordered
              size="small"
              renderItem={(item) => (
                <ListItem
                  key={item[0]}
                  className="query-list-item"
                  onClick={() => onGotoDetail(item[0])}
                >
                  <Typography.Text>
                    <span>用户名: {item[2].username}</span>
                    &nbsp; |&nbsp;
                    <span>
                      游玩时间: {item[2].stats.time_played / 60} 分钟
                    </span>
                  </Typography.Text>
                  <Link to={`/profile/${item[0]}`}>点击跳转到详情</Link>
                </ListItem>
              )}
            />
          </div>
        </div>
        <div className="top-10-area">
          <List
            className="query-name-res-list"
            header={<div>XP Top 10</div>}
            dataSource={top10List}
            bordered
            size="small"
            renderItem={(item, index) => (
              <ListItem
                key={item[0]}
                className="query-list-item"
                onClick={() => onGotoDetail(item[0])}
              >
                <Typography.Text>
                  <span>#{index + 1}</span>
                  &nbsp; |&nbsp;
                  <span>用户名: {item[2].username}</span>
                  &nbsp; |&nbsp;
                  <span>XP: {item[2].stats.rank_progression * 10000}</span>
                </Typography.Text>
                <Link to={`/profile/${item[0]}`}>点击跳转到详情</Link>
              </ListItem>
            )}
          />
        </div>
      </Content>
      <Footer className="home-footer">RWR 信息查询系统, v: {VERSION}</Footer>
    </Layout>
  );
};

export default Home;
