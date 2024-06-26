import React, { useEffect, useState } from "react";
import AdminLayout from "../../../../components/layout/adminLayout/AdminLayout";
import "./QuestionEdit.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../components/loading/Loading";
import QuestionAddForm from "../QuestionAddForm/QuestionAddForm";
import QuestionFetch from "../QuestionFetch/QuestionFetch";

const QuestionEdit = ({ serverRoute, clientRoute }) => {
  useEffect(() => {
    document.title = "Edit Question | KLHCode";
  }, []);
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [question, setQuestion] = useState({});
  const [back, setBack] = useState(false); //for the admin layout header

  //Fetch Tags
  const fetchTags = async () => {
    try {
      const tagsResponse = await axios.get(serverRoute + "/tags", {
        headers: {
          authorization: token, // Replace with the actual token source
        },
      });
      if (tagsResponse.data.success) {
        setCompanies(tagsResponse.data.data.companyTags);
        setTopics(tagsResponse.data.data.topicTags);
      } else {
        navigate("/message", {
          state: { type: false, message: "Failed to fetch tags" },
        });
      }
      setLoading(false);
    } catch (error) {
      navigate("/message", {
        state: { type: false, message: "Failed to fetch tags" },
      });
    }
  };
  useEffect(() => {
    fetchTags();
  }, []);

  const handleQuestionFetch = (event) => {
    setQuestion(event);
    setBack(true);
  };
  return (
    <div className="ADMINQUESTIONEDIT">
      {!loading ? (
        <AdminLayout
          serverRoute={serverRoute}
          clientRoute={clientRoute}
          heading={"Edit Question"}
          back={back}
          defaultKey={"/admin/edit/question"}
        >
          {Object.keys(question).length ? (
            <div className="admin-main">
              <QuestionAddForm
                topics={topics}
                companies={companies}
                route={serverRoute + "/question/" + question.questionId}
                defaultValues={question}
              />
            </div>
          ) : (
            <QuestionFetch
              serverRoute={serverRoute}
              onQuestionFetch={handleQuestionFetch}
            />
          )}
        </AdminLayout>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default QuestionEdit;
