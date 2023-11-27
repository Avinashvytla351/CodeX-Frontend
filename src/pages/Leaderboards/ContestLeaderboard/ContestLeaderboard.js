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
  const [columns, setCoulmns] = useState([]);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [height, setHeight] = useState(window.innerHeight - 180);

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
        setLeaderboard(leaderboardResponse.data.data);
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

  useEffect(() => {
    const columns = [
      {
        title: "Rank",
        width: 60,
        dataIndex: "rank",
        key: "rank",
        fixed: "left",
      },
      {
        title: "Username",
        width: 100,
        dataIndex: "username",
        key: "username",
        fixed: "left",
      },
    ];
    if (leaderboard[0]) {
      if (leaderboard[0].mcqSubjects) {
        leaderboard[0].mcqSubjects.forEach((subject) => {
          columns.push({
            title:
              subject.slice(0, 1).toUpperCase() +
              subject.slice(1, subject.length).toLowerCase(),
            dataIndex: subject.toLowerCase(),
            key: subject.toLowerCase(),
            width: 150,
          });
        });
      } else {
        Object.keys(leaderboard[0]).forEach((key) => {
          if (key.toUpperCase() != "USERNAME") {
            columns.push({
              title: key,
              dataIndex: key.toLowerCase(),
              key: key.toLowerCase(),
              width: 150,
            });
          }
        });
      }

      columns.push({
        title: "Score",
        width: 100,
        dataIndex: "score",
        key: "score",
        fixed: "right",
      });
    }

    setCoulmns(columns);
    let data = [];
    if (leaderboard[0]) {
      if (leaderboard[0].mcqSubjects) {
        leaderboard.forEach((item, index) => {
          if (index > 0) {
            let newData = {
              key: index,
              rank: index + 1,
              username: item.username,
            };

            let total = 0;

            //Initialising all the subject names in the newData
            leaderboard[0].mcqSubjects.forEach((subject) => {
              newData[subject.toLowerCase()] = 0;
            });

            Object.keys(item.mcqSubjectScore).forEach((subjectKey) => {
              newData[subjectKey.toLowerCase()] =
                item.mcqSubjectScore[subjectKey];

              if (Number(item.mcqSubjectScore[subjectKey])) {
                total = total + Number(item.mcqSubjectScore[subjectKey]);
              }
            });

            newData["score"] = total;
            data.push(newData);
          }
        });
      } else {
        leaderboard.forEach((item, index) => {
          let newData = {
            key: index,
            rank: index + 1,
            username: item.username,
          };

          let total = 0;
          Object.keys(leaderboard[0]).forEach((key) => {
            if (key.toUpperCase() != "USERNAME") {
              newData[key.toLowerCase()] = item[key];

              try {
                if (Number(item[key])) {
                  total = total + Number(item[key]);
                }
              } catch (err) {
                total = total + 0;
              }
            }
          });
          newData["score"] = total;
          data.push(newData);
        });
      }
    }
    setData(data);
  }, [leaderboard]);

  return (
    <div className="CONTESTLEADERBOARD">
      <div className="head">
        <span className="head-title">{contestId}</span>
        <Tag color="blue" bordered={false}>
          100 users
        </Tag>
      </div>
      <div className="table">
        {columns.length > 0 && (
          <Table
            columns={columns}
            dataSource={data}
            scroll={{
              x: 1500,
              y: height,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ContestLeaderboard;
