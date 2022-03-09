import React, { FC } from "react";
import { Button, Layout } from "antd";
import { RouteComponentProps } from "@reach/router";
import { VERSION } from "../../constants";

const { Footer, Header, Content } = Layout;

const Home: FC<RouteComponentProps> = () => {
  return (
    <Layout>
      <Header>Header</Header>
      <Content>Content</Content>
      <Footer>RWR 信息查询系统, v: {VERSION}</Footer>
    </Layout>
  );
};

export default Home;
