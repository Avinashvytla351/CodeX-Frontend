import React from "react";
import "./SideMenu.css";

const SideMenu = ({ questions, onSelect, toggle, currentQuestion }) => {
  const handleClose = () => {
    onSelect({ type: "close", id: "" });
  };
  const handleSelect = (key) => {
    onSelect({ type: "select", id: key });
  };
  return (
    <div
      className="SIDEMENU"
      style={{ transform: toggle ? "translateX(0)" : "translateX(-500px)" }}
    >
      <div className="menu-title">
        Questions
        <button type="button" onClick={handleClose}>
          <span className="material-icons">close</span>
        </button>
      </div>
      <div className="question-items">
        {Object.keys(questions).map((questionKey) => {
          return (
            <div
              className={`question-item ${
                questionKey === currentQuestion ? "active" : ""
              }`}
              key={questionKey}
              onClick={() => handleSelect(questionKey)}
            >
              <div className="questionId">{questionKey}</div>
              {questions[questionKey] != -1 && (
                <span
                  className="score"
                  style={{
                    background:
                      questions[questionKey] === 100
                        ? "rgb(39, 150, 0)"
                        : questions[questionKey] === 50
                        ? "rgb(251, 188, 4)"
                        : "rgb(236, 94, 79)",
                  }}
                >
                  {questions[questionKey]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SideMenu;
