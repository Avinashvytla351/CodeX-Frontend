import React from "react";
import "./ContestCard.css";

function ContestCard({ data, active }) {
  return (
    <div className="contest contestCard">
      <a
        href={`${`experiments/${data.contestId}`}`}
        target="_blank"
        className="cardy"
      >
        {active && (
          <div className="act-tag">
            <span className="material-icons-round"> star </span>Active
          </div>
        )}
        <div className="card-content">
          <div className="title">{data.contestName}</div>
          <div className="details">
            <span className="dura">
              {data.contestDuration && `${data.contestDuration}M`}
              <div className="det-abs">Duration</div>
            </span>
            {data.contestStartTime && data.contestEndTime && (
              <span className="dura2">
                {`${data.contestStartTime.slice(
                  0,
                  2
                )}:${data.contestStartTime.slice(2, 4)}`}
                <div className="det-abs">Start</div>
              </span>
            )}
            {data.contestStartTime && data.contestEndTime && (
              <span className="dura2">
                {`${data.contestEndTime.slice(
                  0,
                  2
                )}:${data.contestEndTime.slice(2, 4)}`}
                <div className="det-abs">End</div>
              </span>
            )}
          </div>
          <div className="con-date">
            {data.contestDate && <b>Date: {data.contestDate}</b>}
          </div>
          <div className="participate">Participate</div>
        </div>
      </a>
    </div>
  );
}

export default ContestCard;
