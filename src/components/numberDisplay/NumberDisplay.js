import React from "react";
import "./NumberDisplay.css";

const NumberDisplay = ({ contents, currentItem, onSelect }) => {
  const handleSelect = (key) => {
    onSelect({ type: "select", id: key });
  };
  return (
    <div className="NUMBERDISPLAY">
      <div className="numbers">
        {contents &&
          contents.questions &&
          contents.questions.map((contentKey, index) => {
            return (
              <div
                className={`number ${
                  contentKey.questionId === currentItem ? "active" : ""
                }`}
                key={contentKey.questionId}
                onClick={() => handleSelect(index)}
              >
                {index + 1}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default NumberDisplay;
