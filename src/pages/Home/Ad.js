import React from "react";

const Ad = ({ title, body, imageSrc, backgroundColor, icon }) => {
  return (
    <span className="ad">
      <div className="adv">
        <div className="adv-title">
          <span className="title" style={{ background: backgroundColor }}>
            {icon}
            {title}
          </span>
        </div>
        <div className="adv-content">
          <div className="adv-body">{body}</div>
          <div className="adv-img">
            <img src={imageSrc} alt="" />
          </div>
        </div>
      </div>
    </span>
  );
};

export default Ad;
