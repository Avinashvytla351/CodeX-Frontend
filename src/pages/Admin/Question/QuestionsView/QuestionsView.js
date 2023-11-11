import React, { useEffect, useState } from "react";
import AdminLayout from "../../../../components/layout/adminLayout/AdminLayout";
import "./QuestionsView.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../components/loading/Loading";
import { Space, Table, Tag, Popconfirm } from "antd";

import Popup from "../../../../components/popUp/Popup";

const QuestionsView = ({ serverRoute, clientRoute }) => {
  useEffect(() => {
    document.title = "View Questions | KLHCode";
  }, []);
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [popup, setPopup] = useState({
    state: false,
    type: false,
    message: "",
  });

  //Fetch Questions
  const fetchQuestions = async () => {
    try {
      const questionResponse = await axios.get(serverRoute + "/questions", {
        headers: {
          authorization: token, // Replace with the actual token source
        },
      });
      if (questionResponse.data.success) {
        let questionData = [];
        questionResponse.data.data.forEach((question, index) => {
          let tempMap = {
            key: index + 1,
            questionId: question.questionId,
            questionName: question.questionName,
            difficulty: question.difficulty,
            topics: question.topic,
            companies: question.company,
          };
          questionData.push(tempMap);
        });
        setQuestions(questionData);
      } else {
        navigate("/message", {
          state: { type: false, message: "Failed to fetch questions" },
        });
      }
      setLoading(false);
    } catch (error) {
      navigate("/message", {
        state: { type: false, message: "Failed to fetch questions" },
      });
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  let columnSchema = [
    {
      title: "S.No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Question ID",
      dataIndex: "questionId",
      key: "questionId",
      sorter: (a, b) => {
        return Number(a.questionId.slice(7)) > Number(b.questionId.slice(7));
      },
    },
    {
      title: "Question Name",
      dataIndex: "questionName",
      key: "questionName",
      sorter: (a, b) =>
        a.questionName
          .toLowerCase()
          .localeCompare(b.questionName.toLowerCase()),
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      render: (difficulty) => {
        let color = "";
        if (difficulty === "Easy") {
          color = "green";
        } else if (difficulty === "Medium") {
          color = "orange";
        } else {
          color = "red";
        }

        return <Tag color={color}>{difficulty}</Tag>;
      },
      filters: [
        {
          text: "Easy",
          value: "Easy",
        },
        {
          text: "Medium",
          value: "Medium",
        },
        {
          text: "Hard",
          value: "Hard",
        },
      ],
      onFilter: (value, record) => {
        return record.difficulty == value;
      },
    },
    {
      title: "Topics",
      key: "topics",
      dataIndex: "topics",
      render: (topics) => (
        <>
          {topics.map((tag) => {
            let color = "";
            return (
              <Tag color={color} key={tag} bordered={false}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Companies",
      key: "companies",
      dataIndex: "companies",
      render: (companies) => (
        <>
          {companies.map((tag) => {
            let color = "";
            return (
              <Tag color={color} key={tag} bordered={false}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) =>
        questions.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.questionId, record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleDelete = async (id, key) => {
    try {
      const deleteResponse = await axios.delete(
        serverRoute + "/question/" + id,
        {
          headers: {
            authorization: token, // Replace with the actual token source
          },
        }
      );
      if (deleteResponse.data.success) {
        const newData = questions.filter((item) => item.key !== key);
        setQuestions(newData);
        setPopup({
          state: true,
          type: true,
          message: "Question deleted successfully",
        });
      }
    } catch (error) {
      console.log(error);
      setPopup({
        state: true,
        type: false,
        message: "Failed to delete question",
      });
    }
  };

  const handlePopupClose = () => {
    setPopup({
      ...popup,
      state: false,
    });
  };

  return (
    <div className="ADMINQUESTIONVIEW">
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
          heading={"View Questions"}
        >
          {questions.length && (
            <Table
              columns={columnSchema}
              dataSource={questions}
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

export default QuestionsView;
