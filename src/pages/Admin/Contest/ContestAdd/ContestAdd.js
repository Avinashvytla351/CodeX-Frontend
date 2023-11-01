import React, { useEffect, useState } from "react";
import AdminLayout from "../../../../components/layout/adminLayout/AdminLayout";
import "./ContestAdd.css";
import TypeContestAdd from "../TypeContestAdd/TypeContestAdd";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../components/loading/Loading";

const ContestAdd = ({ serverRoute, clientRoute }) => {
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [manual, setManual] = useState(true);

  const fetchQuestions = async () => {
    try {
      const questionsResponse = await axios.get(serverRoute + "/questions", {
        headers: {
          authorization: token, // Replace with the actual token source
        },
      });
      if (questionsResponse.data) {
        setQuestions(questionsResponse.data);
      } else {
        navigate("/message", {
          state: { type: false, message: "Failed to Fetch questions" },
        });
      }
      setLoading(false);
    } catch (error) {
      navigate("/message", {
        state: { type: false, message: "Failed to Fetch questions" },
      });
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);
  return (
    <div className="ADMINCONTESTADD">
      {!loading ? (
        <AdminLayout serverRoute={serverRoute} clientRoute={clientRoute}>
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
                  Manual Contest
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setManual(false)}
                >
                  MultiSet Contest
                </button>
              </div>
            </div>
            {questions && (
              <TypeContestAdd
                questions={questions}
                route={serverRoute + "/contest"}
                manual={manual}
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

export default ContestAdd;
