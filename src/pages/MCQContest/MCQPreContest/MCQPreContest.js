import React, { useEffect, useState } from "react";
import HeroLayoutCenter from "../../../components/layout/heroLayoutCenter/HeroLayoutCenter";
import "./MCQPreContest.css";
import logo from "../../../images/try logo.png";
import Popup from "../../../components/popUp/Popup";

const MCQPreContest = ({ password, onAttempt, open, contestId }) => {
  useEffect(() => {
    document.title = "Instructions | KLHCode";
  }, []);

  const [passwordVal, setPasswordVal] = useState("");
  const [popUp, setPopUp] = useState(false);

  const handlePassword = (event) => {
    setPasswordVal(event.target.value);
  };

  const checkPassword = () => {
    if (passwordVal === password) {
      onAttempt(true);
    } else {
      onAttempt(false);
      setPopUp(true);
    }
  };
  const participateButton = () => {
    onAttempt(true);
  };
  const handlePopupClose = (e) => {
    if (e) {
      setPopUp(false);
    }
  };
  return (
    <div className="MCQPRECONTEST">
      {popUp && (
        <Popup
          content="Wrong Password"
          type={false}
          onClose={handlePopupClose}
        />
      )}
      {open ? (
        <HeroLayoutCenter>
          <div className="form">
            <img src={logo} alt="" />
            {password ? (
              <form action="">
                <p>PAssWoRD</p>
                <span className="inputf">
                  <input
                    type="password"
                    className="input"
                    placeholder="Password"
                    autoComplete="off"
                    onChange={handlePassword}
                  />
                  <span className="label">Password</span>
                </span>
                <button type="button" className="btn" onClick={checkPassword}>
                  Submit
                </button>
              </form>
            ) : (
              <button type="button" className="btn" onClick={participateButton}>
                Participate
              </button>
            )}
            <a
              href={`/leaderboard/${contestId}`}
              target="_blank"
              className="btn"
              style={{ background: "black" }}
            >
              Leaderboard
            </a>
          </div>
          <div className="instructions">
            <div className="inst-title">INsTRUcTIoNs</div>
            <ol>
              <li>Once You Start the Exam the page will Enter Full Screen</li>
              <li>Stay in full screen mode to avoid exam termination</li>
              <li>
                Exiting full screen while in the browser allows only one chance
                to resume the exam.
              </li>
              <li>
                If you accidentally close the exam by exiting full screen, reach
                out to the administrator for a time extension.
              </li>
              <li>
                Make sure you use only Google Chrome or FireFox Browsers only
              </li>
              <li>Keep an eye on the timer running at the top.</li>
            </ol>
          </div>
        </HeroLayoutCenter>
      ) : (
        <div className="instructions">
          <p>Contest Window is not Open</p>
        </div>
      )}
    </div>
  );
};

export default MCQPreContest;
