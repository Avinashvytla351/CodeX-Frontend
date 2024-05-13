import React, { useEffect, useState } from "react";
import AdminLayout from "../../../../components/layout/adminLayout/AdminLayout";
import "./QuestionAdd.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../components/loading/Loading";
import QuestionAddForm from "../QuestionAddForm/QuestionAddForm";
import QuestionAddFormExcel from "../QuestionAddFormExcel/QuestionAddFormExcel";
import { useQuery } from "@tanstack/react-query";

const QuestionAdd = ({ serverRoute, clientRoute }) => {
  useEffect(() => {
    document.title = "Add Question | KLHCode";
  }, []);
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [errorMessage, setErrorMessage] = useState({
    state: false,
    message: "",
  });
  const [manual, setManual] = useState(true);

  const tagsQuery = useQuery({
    queryKey: ["tags"],
    queryFn: () => {
      return axios.get(serverRoute + "/tags", {
        headers: {
          authorization: token,
        },
      });
    },
  });

  const subjectsQuery = useQuery({
    queryKey: ["subjects"],
    queryFn: () => {
      return axios.get(`${serverRoute}/subjects`, {
        headers: { authorization: token },
      });
    },
  });

  const chaptersQuery = useQuery({
    queryKey: ["chapters"],
    queryFn: () => {
      return axios.get(`${serverRoute}/chapters`, {
        headers: { authorization: token },
      });
    },
  });
  useEffect(() => {
    if (tagsQuery.isError && !errorMessage.state) {
      setErrorMessage({ state: true, message: "Unable to fetch tags" });
    } else if (subjectsQuery.isError && !errorMessage.state) {
      setErrorMessage({ state: true, message: "Unable to fetch subjects" });
    } else if (chaptersQuery.isError && !errorMessage.state) {
      setErrorMessage({ state: true, message: "Unable to fetch chapters" });
    } else if (
      !tagsQuery.isFetching &&
      !subjectsQuery.isFetching &&
      !chaptersQuery.isFetching
    ) {
      setLoading(false);
    }

    if (tagsQuery.isSuccess) {
      if (tagsQuery.data.data && tagsQuery.data.data.success) {
        setCompanies(tagsQuery.data.data.data.companyTags);
        setTopics(tagsQuery.data.data.data.topicTags);
      }
    }

    if (subjectsQuery.isSuccess) {
      if (
        subjectsQuery &&
        subjectsQuery.data &&
        subjectsQuery.data.data &&
        subjectsQuery.data.data.data
      ) {
        setSubjects(subjectsQuery.data.data.data);
      }
    }

    if (chaptersQuery.isSuccess) {
      if (
        chaptersQuery &&
        chaptersQuery.data &&
        chaptersQuery.data.data &&
        chaptersQuery.data.data.data
      ) {
        setChapters(chaptersQuery.data.data.data);
      }
    }
  }, [
    tagsQuery.isError,
    subjectsQuery.isError,
    chaptersQuery.isError,
    tagsQuery.isFetching,
    subjectsQuery.isFetching,
    chaptersQuery.isFetching,
    tagsQuery.isSuccess,
    subjectsQuery.isSuccess,
    chaptersQuery.isSuccess,
    errorMessage.state,
  ]);

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
            <div className="admin-main-header">
              <div
                className="main-buttons"
                style={{ "--left": manual ? "50px" : "calc(100% - 210px)" }}
              >
                <button
                  type="button"
                  className="btn"
                  onClick={() => setManual(true)}
                >
                  Add Manually
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setManual(false)}
                >
                  Upload Excel
                </button>
              </div>
            </div>
            {manual ? (
              <QuestionAddForm
                topics={topics}
                companies={companies}
                subjects={subjects}
                chapters={chapters}
                route={serverRoute + "/question"}
              />
            ) : (
              <QuestionAddFormExcel
                topics={topics}
                companies={companies}
                subjects={subjects}
                chapters={chapters}
                route={serverRoute + "/question"}
              />
            )}
          </div>
        </AdminLayout>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default QuestionAdd;
