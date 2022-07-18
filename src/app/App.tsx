import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CommentOutlined,
  RobotOutlined,
  FormatPainterOutlined,
  RiseOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import CommentsFeed from '../pages/CommentsFeed'
import Game from '../pages/Game'
import { Route, Link, Routes, useLocation } from "react-router-dom";
import 'antd/dist/antd.min.css'
import '../styles.css';
import Colors from '../pages/Colors';
import Snake from '../pages/Snake';

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);  
  const location = useLocation()

  return (

    <Layout id='components-layout-demo-custom-trigger'>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/']}
          selectedKeys={[location.pathname]}>
            <Menu.Item key="/">
                <CommentOutlined />
                <span>Comments Feed</span>
                <Link to="/" />
            </Menu.Item>
            <Menu.Item key="/game">
                <RobotOutlined />
                <span>Game</span>
                <Link to="/game" />
            </Menu.Item>
            <Menu.Item key="/colors">
              <FormatPainterOutlined />
                <span>Colors</span>
                <Link to="/colors" />
            </Menu.Item>
            <Menu.Item key="/snake">
              <RiseOutlined />
                <span>Snake</span>
                <Link to="/snake" />
            </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          <Routes>
            <Route path="/" element={<CommentsFeed />}></Route>
            <Route path="/game" element={<Game/>}></Route>
            <Route path="/colors" element={<Colors/>}></Route>
            <Route path="/snake" element={<Snake/>}></Route>
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
