import React, { useState } from "react";
import { Menu, Layout, Button, theme } from "antd";
import {
  BuildOutlined,
  BlockOutlined,
  UserSwitchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import "./AdminLayout.css";

const { Content, Sider, Footer } = Layout;

const AdminMenu = () => {
  const menuItems = [
    {
      label: "Home",
      key: "/",
      type: "main",
      icon: <HomeOutlined />,
    },
    {
      label: "Manage Contests",
      key: "1",
      type: "main",
      icon: <BuildOutlined />,
      children: [
        {
          label: "Add Contests",
          key: "/admin/add/contest",
        },
        {
          label: "Edit Contests",
          key: "/admin/edit/contest",
        },
        {
          label: "Delete Contests",
          key: "/admin/delete/contest",
        },
        {
          label: "Extend User Time",
          key: "/extendUserTime",
        },
      ],
    },
    {
      label: "Manage Questions",
      key: "2",
      type: "main",
      icon: <BlockOutlined />,
      children: [
        {
          label: "Add Questions",
          key: "/admin/add/question",
        },
        {
          label: "Edit Questions",
          key: "/admin/edit/question",
        },
        {
          label: "Delete Questions",
          key: "/admin/delete/question",
        },
        {
          label: "Delete Multiple Questions",
          key: "/admin/deletequestions/multiple",
        },
        {
          label: "View All Questions",
          key: "/admin/viewQuestion",
        },
      ],
    },
    {
      label: "Manage Users",
      key: "/admin/manageusers",
      type: "main",
      icon: <UserSwitchOutlined />,
    },
    {
      label: "Logout",
      key: "/logout",
      type: "main",
      danger: true,
      icon: <LogoutOutlined />,
    },
    // Add more menu items as needed
  ];
  return (
    <Menu
      mode="inline"
      items={menuItems}
      style={{ width: "100%", overflow: "auto" }}
    ></Menu>
  );
};

const AdminLayout = ({ serverRoute, clientRoute, children }) => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <Layout className="ADMINLAYOUT">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="layoutmenu"
        width={"25%"}
        height={"100vh"}
        style={{
          minWidth: "300px",
          background: "white",
          overflow: "auto",
        }}
      >
        <Button
          type="text"
          icon={
            collapsed ? (
              <MenuUnfoldOutlined style={{ fontSize: "24px" }} />
            ) : (
              <MenuFoldOutlined style={{ fontSize: "24px" }} />
            )
          }
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 80,
            height: 80,
            background: "white",
          }}
        />
        <AdminMenu />
      </Sider>
      <Layout className="subLayout">
        <Content
          style={{
            margin: "8px",
            padding: 12,
            minHeight: 280,
            overflow: "auto",
            background: "white",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
