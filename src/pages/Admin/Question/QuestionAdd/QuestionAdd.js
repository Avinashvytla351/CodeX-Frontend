import React, { useEffect, useState } from "react";
import AdminLayout from "../../../../components/layout/adminLayout/AdminLayout";
import "./QuestionAdd.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../components/loading/Loading";
import QuestionAddForm from "../QuestionAddForm/QuestionAddForm";

const QuestionAdd = ({ serverRoute, clientRoute }) => {
  useEffect(() => {
    document.title = "Add Question | KLHCode";
  }, []);
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [companies, setCompanies] = useState([]);
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
      let message = "Failed to fetch tags";
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
    fetchTags();
  }, []);
  return (
    <div className="ADMINQUESTIONADD">
      {!loading ? (
        <AdminLayout
          serverRoute={serverRoute}
          clientRoute={clientRoute}
          heading={"Add Question"}
          defaultKey={"/admin/add/question"}
        >
          <div className="admin-main">
            <QuestionAddForm
              topics={topics}
              companies={companies}
              route={serverRoute + "/question"}
            />
          </div>
        </AdminLayout>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default QuestionAdd;
