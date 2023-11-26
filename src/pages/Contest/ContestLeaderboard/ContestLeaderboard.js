import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import "./ContestLeaderboard.css";
import { Table, Tag } from "antd";
import Loading from "../../../components/loading/Loading";
import { useNavigate } from "react-router-dom";

const ContestLeaderboard = ({ serverRoute }) => {
  const token = Cookies.get("token"); //get token from cookies
  const { contestId } = useParams(); //get contestId from url
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  const fetchLeaderboard = async () => {
    try {
      const leaderboardResponse = await axios.get(
        serverRoute + "/leaderboard/" + contestId, // Replace 'yourContestIdVariable' with the actual contest ID
        {
          headers: {
            authorization: token, // Replace with the actual token source
          },
        }
      );

      if (leaderboardResponse.data.success) {
        console.log(leaderboardResponse.data);
      }
    } catch (error) {
      let message = error.message;
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message = error.response.data.message;
      }
      navigate("/message", {
        state: { type: false, message: message },
      });
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const columns = [
    {
      title: "Full Name",
      width: 100,
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    {
      title: "Age",
      width: 100,
      dataIndex: "age",
      key: "age",
      fixed: "left",
    },
    {
      title: "Column 1",
      dataIndex: "address",
      key: "1",
      width: 150,
    },
    {
      title: "Column 2",
      dataIndex: "address",
      key: "2",
      width: 150,
    },
    {
      title: "Column 3",
      dataIndex: "address",
      key: "3",
      width: 150,
    },
    {
      title: "Column 4",
      dataIndex: "address",
      key: "4",
      width: 150,
    },
    {
      title: "Column 5",
      dataIndex: "address",
      key: "5",
      width: 150,
    },
    {
      title: "Column 6",
      dataIndex: "address",
      key: "6",
      width: 150,
    },
    {
      title: "Column 7",
      dataIndex: "address",
      key: "7",
      width: 150,
    },
    {
      title: "Column 8",
      dataIndex: "address",
      key: "8",
      width: 150,
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 100,
      render: () => <a>action</a>,
    },
  ];
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      name: `Edward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
    });
  }
  return (
    <div className="CONTESTLEADERBOARD">
      <div className="head">
        <span className="head-title">{contestId}</span>
        <Tag color="blue" bordered={false}>
          100 users
        </Tag>
      </div>
      <div className="table">
        <Table
          columns={columns}
          dataSource={data}
          scroll={{
            x: 1500,
            y: 300,
          }}
        />
      </div>
    </div>
  );
};

export default ContestLeaderboard;
