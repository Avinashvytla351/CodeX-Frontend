import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/layout/adminLayout/AdminLayout";
import "./manageUsers.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/loading/Loading";
import { Space, Table, Tag, Popconfirm, Input } from "antd";

import Popup from "../../../components/popUp/Popup";

const ManageUsers = ({ serverRoute, clientRoute }) => {
  useEffect(() => {
    document.title = "Manage Users | KLHCode";
  }, []);
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [popup, setPopup] = useState({
    state: false,
    type: false,
    message: "",
  });

  //Table Search UseState
  const [searchVal, setSearchVal] = useState("");

  //Fetch Questions
  const fetchUsers = async () => {
    try {
      const userResponse = await axios.get(serverRoute + "/admin/users", {
        headers: {
          authorization: token, // Replace with the actual token source
        },
      });
      if (userResponse.data.success) {
        let userData = [];
        userResponse.data.data.forEach((user, index) => {
          let tempMap = {
            key: index + 1,
            username: user.username,
            name: user.name,
            email: user.email,
            branch: user.branch,
            password: user.password,
            status: user.isVerified,
          };
          userData.push(tempMap);
        });
        setUsers(userData);
      } else {
        navigate("/message", {
          state: { type: false, message: "Failed to fetch users" },
        });
      }
      setLoading(false);
    } catch (error) {
      navigate("/message", {
        state: { type: false, message: "Failed to fetc users" },
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  let columnSchema = [
    {
      title: "S.No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      filters: [
        {
          text: "22",
          value: "22",
        },
        {
          text: "19",
          value: "19",
        },
        {
          text: "23",
          value: "23",
        },
        {
          text: "24",
          value: "24",
        },
        {
          text: "NA",
          value: "",
        },
      ],
      onFilter: (value, record) => {
        let year = record.username.slice(0, 2);
        if (year == value) {
          return true;
        } else {
          if (value == "") {
            if (year == 22 || year == 23 || year == 24) {
              return false;
            } else {
              return true;
            }
          } else {
            return false;
          }
        }
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filteredValue: [searchVal],
      onFilter: (value, record) => {
        return (
          String(record.username).includes(value) ||
          String(record.name).includes(value) ||
          String(record.email).includes(value) ||
          String(record.branch).includes(value)
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      filters: [
        {
          text: "CSE",
          value: "cse",
        },
        {
          text: "CSIT",
          value: "csit",
        },
        {
          text: "ECE",
          value: "ece",
        },
      ],
      onFilter: (value, record) => {
        return record.branch == value;
      },
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) => {
        if (status) {
          return (
            <Tag color={"green"} bordered={false}>
              {"Verified"}
            </Tag>
          );
        } else {
          return (
            <Tag color={"red"} bordered={false}>
              {"Not Verified"}
            </Tag>
          );
        }
      },
    },
    {
      title: "Delete User",
      dataIndex: "operation",
      render: (_, record) =>
        users.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.username, record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
    {
      title: "Verify User",
      dataIndex: "operation",
      render: (_, record) =>
        users.length >= 1 && !record.status ? (
          <Popconfirm
            title="Sure to verify?"
            onConfirm={() => handleVerify(record.username, record.key)}
          >
            <a>Verify</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleDelete = async (id, key) => {
    try {
      const deleteResponse = await axios.delete(serverRoute + "/users/" + id, {
        headers: {
          authorization: token, // Replace with the actual token source
        },
      });
      if (deleteResponse.data.success) {
        const newData = users.filter((item) => item.key !== key);
        setUsers(newData);
        setPopup({
          state: true,
          type: true,
          message: "User deleted successfully",
        });
      }
    } catch (error) {
      setPopup({
        state: true,
        type: false,
        message: "Failed to delete user",
      });
    }
  };

  const handleVerify = async (id, key) => {
    try {
      const verifyResponse = await axios.post(
        serverRoute + "/admin/makeVerify",
        {
          username: id,
        },
        {
          headers: {
            authorization: token, // Replace with the actual token source
          },
        }
      );
      if (verifyResponse.data.success) {
        const newData = [];
        users.forEach((user) => {
          if (user.key == key) {
            user.status = true;
          }
          newData.push(user);
        });
        setUsers(newData);
        setPopup({
          state: true,
          type: true,
          message: "User verified successfully",
        });
      }
    } catch (error) {
      setPopup({
        state: true,
        type: false,
        message: "Failed to verify user",
      });
    }
  };

  const handlePopupClose = () => {
    setPopup({
      ...popup,
      state: false,
    });
  };

  const handleSearch = (event) => {
    setSearchVal(event.target.value);
  };

  return (
    <div className="ADMINMANAGEUSER">
      {popup.state && (
        <Popup
          onClose={handlePopupClose}
          content={popup.message}
          type={popup.type}
        />
      )}
      {!loading ? (
        <AdminLayout
          serverRoute={serverRoute}
          clientRoute={clientRoute}
          heading={"Manage Users"}
          defaultKey={"/admin/manageUsers"}
        >
          <Input.Search
            placeholder="Search users..."
            style={{ marginBottom: 10 }}
            onChange={handleSearch}
          />
          {users.length && (
            <Table
              columns={columnSchema}
              dataSource={users}
              pagination={true}
            />
          )}
        </AdminLayout>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default ManageUsers;
