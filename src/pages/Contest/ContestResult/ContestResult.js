import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Loading from "../../../components/loading/Loading";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";
import "./ContestResult.css";

const ContestResult = ({ contestId, serverRoute }) => {
  useEffect(() => {
    document.title = "Result | KLHCode";
  }, []);
  const navigate = useNavigate();
  const token = Cookies.get("token"); //get token from cookies
  const username = Cookies.get("username"); //get username from cookies
  const branch = Cookies.get("branch"); //get branch from cookies
  const [loading, setLoading] = useState(true); //page loader
  const [participationData, setParticipationData] = useState({});

  const fetchParticipationData = async () => {
    try {
      const participationResponse = await axios.get(
        serverRoute +
          "/participations/" +
          contestId +
          "/" +
          username.toLowerCase(), // Replace 'yourContestIdVariable' with the actual contest ID
        {
          headers: {
            authorization: token, // Replace with the actual token source
          },
        }
      );
      if (participationResponse.data.success) {
        setParticipationData(participationResponse.data.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      navigate("/message", {
        state: {
          type: false,
          message: "Unable to fetch contest data",
        },
      });
    }
  };
  useEffect(() => {
    fetchParticipationData();
  }, []);

  const goToLeaderboard = () => {
    navigate(`/leaderboard/${contestId}`);
  };

  useEffect(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  let colors = [
    { back: "rgb(255,240,246)", text: "rgb(192, 75, 143)" },
    { back: "rgb(255,241,240)", text: "rgb(203, 69, 80)" },
    { back: "rgb(255,242,232)", text: "rgb(196, 96, 66)" },
    { back: "rgb(255,247,230)", text: "rgb(206, 107, 36)" },
    { back: "rgb(255,251,230)", text: "rgb(196, 144, 54)" },
    { back: "rgb(252,255,230)", text: "rgb(117, 151, 36)" },
    { back: "rgb(246,255,237)", text: "rgb(131, 176, 109)" },
    { back: "rgb(230,255,251)", text: "rgb(71, 159, 161)" },
    { back: "rgb(230,244,255)", text: "rgb(64, 121, 212)" },
    { back: "rgb(240,245,255)", text: "rgb(93, 110, 197)" },
    { back: "rgb(249,240,255)", text: "rgb(140, 116, 173)" },
  ];

  var total = 0;

  return (
    <div className="CONTESTRESULT">
      {!loading ? (
        participationData &&
        Object.keys(participationData).length > 0 &&
        participationData.submissionResults ? (
          <div className="result">
            <div className="title">Your Result</div>
            <div className="result-main">
              <div className="head">
                <div className="number"></div>
                <div className="name">Question Id</div>
                <div className="name">Marks</div>
              </div>
              {Object.keys(participationData.submissionResults).map(
                (item, index) => {
                  let color = Math.round(Math.random() * (colors.length - 1));
                  if (Number(participationData.submissionResults[item])) {
                    total =
                      total + Number(participationData.submissionResults[item]);
                  }
                  return (
                    <div className="item" key={index}>
                      <div
                        className="number"
                        style={{
                          background: colors[color].back,
                          color: colors[color].text,
                          border: `0.3mm solid ${colors[color].text}`,
                        }}
                      >
                        {index}
                      </div>
                      <div className="question">{item.toUpperCase()}</div>
                      <div className="marks">
                        {participationData.submissionResults[item]}
                      </div>
                    </div>
                  );
                }
              )}
              <div className="totals">
                <div className="number"></div>
                <div className="name">Total</div>
                <div className="name">{total}</div>
              </div>
            </div>
            <div className="button">
              <Button type="primary" onClick={goToLeaderboard}>
                Go to leaderboard
              </Button>
            </div>
          </div>
        ) : (
          <Result
            status="404"
            title="Contest window is not open"
            subTitle="Sorry, No results available"
            extra={
              <Button type="primary" onClick={goToLeaderboard}>
                Go to leaderboard
              </Button>
            }
          />
        )
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default ContestResult;
