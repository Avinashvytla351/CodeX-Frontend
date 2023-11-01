import React, { useEffect, useState } from "react";
import "./Timer.css";

const Timer = ({ countDownDate, onTimeUp }) => {
  var countDownDate = new Date(countDownDate);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const now = Date.now();
      const distance = countDownDate - now;

      if (distance <= 0) {
        onTimeUp(true);
        clearInterval(timerInterval);
        setTimeLeft(0);
      } else {
        setTimeLeft(distance);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [countDownDate]);

  const formatTime = (time) => {
    const hours = String(
      Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    );
    const minutes = String(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = String(Math.floor((time % (1000 * 60)) / 1000));

    return `${hours.padStart(2, "0")}:${minutes.padStart(
      2,
      "0"
    )}:${seconds.padStart(2, "0")}`;
  };

  return <div className="timer">{formatTime(timeLeft)}</div>;
};

export default Timer;
