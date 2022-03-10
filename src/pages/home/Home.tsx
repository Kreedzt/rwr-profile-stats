import React, { FC, useCallback, useEffect, useState } from "react";
import { Button, Input, Layout, List, Typography } from "antd";
import { RouteComponentProps, Link } from "@reach/router";
import { VERSION } from "../../constants";
import { Person } from "../../models/person";
import { Profile } from "../../models/profile";
import { ProfileService } from "../../services/profile";
import "./Home.less";

const { Footer, Header, Content } = Layout;
const { Item: ListItem } = List;

type AllListItem = [number, Person, Profile];

const Home: FC<RouteComponentProps> = () => {
  const [allList, setAllList] = useState<AllListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>();
  const [nameUserList, setNameUserList] = useState<AllListItem[]>([]);

  const refreshList = useCallback(async () => {
    try {
      setLoading(true);
      const allList = await ProfileService.queryAllCache();
      setAllList(allList);
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

  useEffect(() => {
    refreshList();
  }, []);

  return (
    <Layout className="home-layout">
      <Header>RWR 信息查询系统</Header>
      <Content className="home-content">
        <div className="query-area">
          查询区域
          <div>
            <Input
              value={searchText}
              placeholder="输入用户名查询"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              danger
              onClick={() => {
                setSearchText("");
                setNameUserList([]);
              }}
            >
              重置
            </Button>

            <Button loading={loading} onClick={onQuery}>
              查询
            </Button>
            <List
              className="query-name-res-list"
              header={<div>查询结果列表</div>}
              dataSource={nameUserList}
              bordered
              size="small"
              renderItem={(item) => (
                <ListItem key={item[0]}>
                  <Typography.Text mark>
                    [{item[2].username}]
                    <Link to={`/profile/${item[0]}`}>跳转到详情</Link>
                  </Typography.Text>
                </ListItem>
              )}
            />
          </div>
        </div>
        <div>XP Top 10</div>
      </Content>
      <Footer>RWR 信息查询系统, v: {VERSION}</Footer>
    </Layout>
  );
};

export default Home;
