import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CommentOutlined,
  RobotOutlined,
  FormatPainterOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import CommentsFeed from '../pages/CommentsFeed'
import Game from '../pages/Game'
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import 'antd/dist/antd.min.css'
import '../styles.css';
import Colors from '../pages/Colors';

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (

    <Router>
      <Layout id='components-layout-demo-custom-trigger'>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['/']}>
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
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
