import React, { useEffect, useState } from "react";
import MCQPreContest from "../MCQPreContest/MCQPreContest";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import "./MCQContestPage.css";
import Timer from "../../../components/timer/Timer";
import SideMenu from "../../../components/sideMenu/SideMenu";
import { useNavigate } from "react-router-dom";
import Popup from "../../../components/popUp/Popup";
import Loading from "../../../components/loading/Loading";
import NumberDisplay from "../../../components/numberDisplay/NumberDisplay";
import MCQQuestionDesc from "../../MCQQuestion/MCQQuestionDesc";

const MCQContestPage = ({ serverRoute }) => {
  const navigate = useNavigate();
  const token = Cookies.get("token"); //get token from cookies
  const username = Cookies.get("username"); //get username from cookies
  const branch = Cookies.get("branch"); //get branch from cookies
  const { contestId } = useParams();
  const [loading, setLoading] = useState(true); //page loader
  const [started, setStarted] = useState(false); //set if contest start button is clicked
  const [contestPassword, setContestPassword] = useState(""); //store contest password
  const [contents, setContents] = useState([]); //Store Challenge Contents
  const [open, setOpen] = useState(false); //set if contest is open
  const [isAdmin, setIsAdmin] = useState(false);
  const [validTill, setValidTill] = useState("");
  const [submissionResults, setSubmissionResults] = useState({}); //Store Submission Results
  const [toggle, setToggle] = useState(false); //Question nav bar toggle
  const [currentQuestion, setCurrentQuestion] = useState(null); //Integer defining the index of the question in questions array
  const [currentSection, setCurrentSection] = useState(""); //String Defining the subject name in the contents

  var chance = 1; //Contest exit chance

  //Popup state
  const [popup, setPopup] = useState({
    state: false,
    type: false,
    message: "",
  });

  const handleAttempt = (event) => {
    setStarted(event);
  };

  useEffect(() => {
    document.title = "Challenge | KLHCode";
  }, [started]);

  //Check if contest is on going or not and fetch the contest password
  const fetchContestData = async () => {
    try {
      const isOngoing = await axios.get(
        serverRoute + "/contest/active/" + contestId, // Replace 'yourContestIdVariable' with the actual contest ID
        {
          headers: {
            authorization: token, // Replace with the actual token source
          },
        }
      );

      const isAdminResponse = await axios.get(serverRoute + "/isAdmin", {
        headers: {
          authorization: token, // Replace with the actual token source
        },
      });

      const adminData = isAdminResponse.data;
      setIsAdmin(adminData.success);

      if (isOngoing.data.success || isAdmin) {
        const contestReponse = await axios.get(
          serverRoute + "/contest/" + contestId,
          {
            headers: {
              authorization: token, // Replace with the actual token source
            },
          }
        );
        let password = contestReponse.data.data.contestPassword;
        setContestPassword(password);
        setOpen(true);
        setLoading(false);
      } else {
        navigate(`/leaderboard/${contestId}`);
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
    fetchContestData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (open) {
        //get all the questions for contest
        const questionsResponse = await axios.post(
          serverRoute + "/questions/contest/" + contestId,
          {
            username: username,
            branch: branch,
          },
          {
            headers: {
              authorization: token, // Replace with the actual token source
            },
          }
        );
        if (questionsResponse.data.success) {
          let newContents = {};
          questionsResponse.data.data.questions.forEach((question) => {
            if (newContents[question.mcqSubject]) {
              newContents[question.mcqSubject].questions.push(question);
              question.state = false;
              question.selected = null;
            } else {
              newContents[question.mcqSubject] = {
                type: "contest",
                questions: [question],
              };
            }
          });
          setContents(newContents);
          setCurrentSection(Object.keys(newContents)[0]);
          setCurrentQuestion(0);
          setLoading(false);
          setValidTill(questionsResponse.data.data.participation.validTill);
          setSubmissionResults(
            questionsResponse.data.data.participation.submissionResults
          );
        } else {
          navigate("/message", {
            state: {
              type: false,
              message: "Unable to fetch questions for the contest",
            },
          });
        }
      }
    } catch (error) {
      let message = "Unable to fetch contest data";
      if (error.response && error.response.data.message) {
        message = error.response.data.message;
      }
      navigate("/message", {
        state: { type: false, message: message },
      }); // with message
      setLoading(false);
    }
  };

  //End Contest
  const sendResult = async () => {
    let responses = [];
    Object.keys(contents).forEach((item) => {
      contents[item].questions.forEach((question) => {
        responses.push({
          questionId: question.questionId,
          response: question.selected ? question.selected.toString() : null,
        });
      });
    });
    let submissionResponse = {
      contestId: contestId,
      username: username,
      responses: responses,
    };
    try {
      const submitResponse = await axios.post(
        serverRoute + "/validateMCQSubmission",
        submissionResponse,
        {
          headers: {
            authorization: token, // Replace with the actual token source
          },
        }
      );

      console.log(submitResponse.data);
    } catch (error) {}
  };
  const endContest = async () => {
    sendResult();
    if (!isAdmin) {
      try {
        const endResponse = await axios.post(
          serverRoute + "/endContest", // Replace route
          {
            username: username,
            contestId: contestId,
          },
          {
            headers: {
              authorization: token, // Replace with the actual token source
            },
          }
        );
        navigate(`/leaderboard/${contestId}`);
      } catch (error) {
        navigate(`/leaderboard/${contestId}`);
      }
    }
  };

  //Popup Handling
  const handlePopupClose = () => {
    setPopup({
      ...popup,
      state: false,
    });
    if (!document.fullscreenElement) {
      // Attempt to re-enter fullscreen
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
        // If re-entering fullscreen fails, you may want to handle it accordingly
      });
    }
  };

  // Run fetchData when contest is started
  useEffect(() => {
    const handleFocus = () => {
      //Window Focused
    };

    const handleBlur = () => {
      endContest();
    };

    //Fullscreen change detection
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        // Fullscreen entered
      } else {
        // Fullscreen exited or tab switching
        if (chance) {
          setPopup({
            state: true,
            type: false,
            message: "Do not try to exit the full screen",
          });
          chance = chance - 1;
        } else {
          endContest();
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is not visible (switched to another tab or window)
        endContest();
      } else {
        // Page is visible (switched back to this tab or window)
      }
    };

    if (started) {
      fetchData();

      if (!isAdmin) {
        // Add event listener for fullscreen change
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        // Add event listener for visibility change
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Request fullscreen
        document.documentElement.requestFullscreen().catch((err) => {
          console.error("Error attempting to enable fullscreen:", err);
        });

        window.addEventListener("focus", handleFocus);
        window.addEventListener("blur", handleBlur);

        return () => {
          // Remove event listener when component unmounts
          document.removeEventListener(
            "fullscreenchange",
            handleFullscreenChange
          );

          // Remove event listener when component unmounts
          document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange
          );

          window.removeEventListener("focus", handleFocus);
          window.removeEventListener("blur", handleBlur);
        };
      }
    }
  }, [started]);

  const handleTimeUp = (event) => {
    //handle when time is up
    endContest();
  };

  /* useEffect(() => {
    // Check if the 'questions' state is not empty
    if (questions.length > 0) {
      setCurrentQuestion(questions[0]);
      // Create a new score map
      const newScoreMap = { ...scoreMap };
      questions.forEach((question) => {
        newScoreMap[question.questionId] = -1;
      });
      // Iterate over submissionResults and update the scoreMap
      if (submissionResults) {
        Object.keys(submissionResults).forEach((submission) => {
          newScoreMap[submission] = submissionResults[submission];
        });
      }

      // Set the updated score map
      setScoreMap(newScoreMap);

      setLoading(false);
    }
  }, [questions]);*/

  const handleSelect = (event) => {
    if (event.type === "close") {
      setToggle(false);
    } else if (event.type === "select") {
      setCurrentSection(event.id);
      setCurrentQuestion(0);
    }
  };
  const handleToggle = () => {
    setToggle(true);
  };

  const handleQuestionSelect = (event) => {
    if (event.type === "select") {
      setCurrentQuestion(event.id);
    }
  };

  //Disabling the contextmenu
  useEffect(() => {
    const disableRightClick = (event) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  //Disabling the key combo
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        ((event.ctrlKey || event.metaKey) &&
          event.shiftKey &&
          event.key === "I") ||
        (event.altKey && event.key === "Tab") ||
        ((event.ctrlKey || event.metaKey) &&
          event.shiftKey &&
          event.key === "J") ||
        ((event.ctrlKey || event.metaKey) &&
          event.shiftKey &&
          event.key === "C")
      ) {
        // Handle the attempt to open developer tools
        event.preventDefault(); // Prevent the default behavior (opening developer tools)
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  //Modify the selected option in question in contents
  const handleResponse = (response) => {
    try {
      contents[currentSection].questions[currentQuestion].state = true;
      contents[currentSection].questions[currentQuestion].selected = response;
    } catch (error) {
      setPopup({
        state: true,
        type: false,
        message: "Unable to set the option",
      });
    }
  };

  return (
    <div className="MCQCONTESTPAGE">
      {popup.state && (
        <Popup
          onClose={handlePopupClose}
          content={popup.message}
          type={popup.type}
        />
      )}
      {!loading ? (
        !started ? (
          <MCQPreContest
            onAttempt={handleAttempt}
            password={contestPassword}
            open={open}
            contestId={contestId}
          />
        ) : (
          <div className="contest-main">
            {Object.keys(contents).length > 0 && (
              <SideMenu
                contents={contents}
                onSelect={handleSelect}
                toggle={toggle}
                currentItem={currentSection}
                progress={true}
                color={"rgb(146, 190, 255)"}
              />
            )}
            <div className="contest-head">
              <div className="left">
                <button
                  type="button"
                  className="contest-btn"
                  onClick={handleToggle}
                >
                  <span className="material-icons">menu</span>
                </button>
                <div className="contest-title">{contestId.toUpperCase()}</div>
              </div>
              <div className="center">
                {validTill && (
                  <Timer countDownDate={validTill} onTimeUp={handleTimeUp} />
                )}
              </div>
              <div className="right">
                <div className="name">{username.toUpperCase()}</div>
                <button
                  type="button"
                  className="contest-btn"
                  onClick={endContest}
                >
                  <span className="material-icons">close</span>
                </button>
              </div>
            </div>
            <div className="contest-question">
              {Object.keys(contents).length > 0 && currentSection && (
                <MCQQuestionDesc
                  question={contents[currentSection].questions[currentQuestion]}
                  onResponse={handleResponse}
                />
              )}
              {Object.keys(contents).length > 0 && currentSection && (
                <NumberDisplay
                  contents={contents[currentSection]}
                  currentItem={(() => {
                    try {
                      return contents[currentSection].questions[currentQuestion]
                        .questionId;
                    } catch (error) {
                      return null;
                    }
                  })()}
                  onSelect={handleQuestionSelect}
                />
              )}
            </div>
          </div>
        )
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default MCQContestPage;
