import React from "react";
import "./AreaRight.css";

const AreaRight = ({
  titleText,
  subTitleText,
  color,
  search,
  descSmall,
  children,
}) => {
  return (
    <div className="area-right">
      <div className="the-area-wrap">
        <div className="area-titles">
          <div className="atitle ahead" style={{ color: color }}>
            {titleText}
          </div>
          <div className="atitle">{subTitleText}</div>
          <div className="atitle-small">{descSmall}</div>
        </div>
        {search && children}
      </div>
    </div>
  );
};

export default AreaRight;
