import React from "react";
import "./Message.css";
import { useLocation } from "react-router-dom";

const Message = (data) => {
  const location = useLocation();
  data = Object.keys(data).length ? data : location.state;
  return (
    <div
      className="MESSAGE"
      style={{ background: data.type ? "rgb(78,206,114)" : "rgb(206,101,78)" }}
    >
      <div className="circle">
        <span className="material-icons">{data.type ? "done" : "close"}</span>
      </div>
      <div className="content">{data.message}</div>
    </div>
  );
};

export default Message;
