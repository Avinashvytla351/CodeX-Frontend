import React from "react";
import "./Doodle.css";

const Doodle = ({ background }) => {
  return <div className="doodle" style={{ background: background }}></div>;
};

export default Doodle;
