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
  ExperimentOutlined,
  CheckSquareOutlined,
  GroupOutlined,
} from "@ant-design/icons";

import "./AdminLayout.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const { Content, Sider, Header } = Layout;

const AdminMenu = ({ defaultKey }) => {
  const navigate = useNavigate();
  const menuItems = [
    {
      label: "Home",
      key: "/",
      type: "main",
      icon: <HomeOutlined />,
    },
    {
      label: "Subjects & Chapters",
      key: "1",
      type: "main",
      icon: <GroupOutlined />,
      children: [
        {
          label: "Manage Subjects & Chapters",
          key: "/admin/edit/subjectsChapters",
        },
        {
          label: "Manage Subject & Chapter Tags",
          key: "/admin/edit/subjectChapterTags",
        },
      ],
    },

    {
      label: "Manage Contests",
      key: "2",
      type: "main",
      icon: <ExperimentOutlined />,
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
          key: "/admin/extendTime/contest",
        },
      ],
    },
    {
      label: "Manage Questions",
      key: "3",
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
          label: "View All Questions",
          key: "/admin/view/question",
        },
      ],
    },
    {
      label: "Manage MCQ Contests",
      key: "4",
      type: "main",
      icon: <BuildOutlined />,
      children: [
        {
          label: "Add MCQ Contests",
          key: "/admin/add/mcqContest",
        },
      ],
    },
    {
      label: "Manage MCQ Question",
      key: "5",
      type: "main",
      icon: <CheckSquareOutlined />,
      children: [
        {
          label: "Add MCQ Question",
          key: "/admin/add/mcq",
        },
      ],
    },
    {
      label: "Manage Users",
      key: "/admin/manageUsers",
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
      defaultSelectedKeys={defaultKey ? [defaultKey] : ["/admin/add/contest"]}
      onClick={({ key }) => {
        if (key == "/logout") {
          Cookies.remove("token");
          Cookies.remove("username");
          Cookies.remove("branch");
          Cookies.remove("user");
          navigate("/");
        } else {
          navigate(key);
        }
      }}
    ></Menu>
  );
};

const AdminLayout = ({
  serverRoute,
  clientRoute,
  children,
  heading,
  back,
  defaultKey,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const handleRefresh = () => {
    window.location.reload();
  };
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
        <AdminMenu defaultKey={defaultKey} />
      </Sider>
      <Layout className="subLayout">
        <Header className="head">
          {back && (
            <button type="button" onClick={handleRefresh} className="back-btn">
              <span className="material-icons">west</span>
            </button>
          )}
          {heading}
        </Header>
        <Content
          style={{
            margin: "8px",
            padding: 12,
            minHeight: 280,
            overflow: "auto",
            background: "white",
            borderRadius: "1mm",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
