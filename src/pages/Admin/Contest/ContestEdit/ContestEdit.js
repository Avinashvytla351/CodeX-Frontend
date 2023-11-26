import React, { useEffect, useState } from "react";
import AdminLayout from "../../../../components/layout/adminLayout/AdminLayout";
import "./ContestEdit.css";
import TypeContestAdd from "../TypeContestAdd/TypeContestAdd";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../components/loading/Loading";
import ContestFetch from "../ContestFetch/ContestFetch";

const ContestEdit = ({ serverRoute, clientRoute }) => {
  useEffect(() => {
    document.title = "Edit Contest | KLHCode";
  }, []);
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [manual, setManual] = useState(true);
  const [contest, setContest] = useState({});
  const [back, setBack] = useState(false); //for the admin layout header

  const fetchQuestions = async () => {
    try {
      const questionsResponse = await axios.get(
        serverRoute + "/questions/coding?queryString=questionId,questionName",
        {
          headers: {
            authorization: token, // Replace with the actual token source
          },
        }
      );
      if (questionsResponse.data.success) {
        setQuestions(questionsResponse.data.data);
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

  const handleContestFetch = (event) => {
    setContest(event);
    setBack(back);
    if (event.sets.length > 0) {
      setManual(false);
    } else {
      setManual(true);
    }
  };
  return (
    <div className="ADMINCONTESTEDIT">
      {!loading ? (
        <AdminLayout
          serverRoute={serverRoute}
          clientRoute={clientRoute}
          heading={"Edit Contest"}
          back={back}
          defaultKey={"/admin/edit/contest"}
        >
          {Object.keys(contest).length ? (
            <div className="admin-main">
              <div className="admin-main-header">
                <div
                  className="main-buttons"
                  style={{ "--left": manual ? "50px" : "calc(100% - 210px)" }}
                >
                  <button type="button" className="btn" disabled>
                    Manual Contest
                  </button>
                  <button type="button" className="btn" disabled>
                    MultiSet Contest
                  </button>
                </div>
              </div>
              {questions && (
                <TypeContestAdd
                  questions={questions}
                  route={serverRoute + "/contest/" + contest.contestId}
                  manual={manual}
                  defaultValues={contest}
                />
              )}
            </div>
          ) : (
            <ContestFetch
              serverRoute={serverRoute}
              onContestFetch={handleContestFetch}
            />
          )}
        </AdminLayout>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default ContestEdit;
