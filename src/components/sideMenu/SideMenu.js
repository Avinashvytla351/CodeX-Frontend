//USING IN CONTEST MCQ CONTEST
import React from "react";
import "./SideMenu.css";
import { Progress } from "antd";

const SideMenu = ({
  contents,
  onSelect,
  toggle,
  currentItem,
  progress,
  color,
}) => {
  const handleClose = () => {
    onSelect({ type: "close", id: "" });
  };
  const handleSelect = (key) => {
    onSelect({ type: "select", id: key });
  };

  let progressMap = {};
  for (var item in contents) {
    progressMap[item] = 0;
    if (contents[item] && contents[item].questions) {
      contents[item].questions.forEach((question) => {
        if (question && question.state) {
          progressMap[item] += 1;
        }
      });

      progressMap[item] = contents[item].questions.length
        ? (progressMap[item] / contents[item].questions.length) * 100
        : 0;
    }
  }
  return (
    <div
      className="SIDEMENU"
      style={{
        transform: toggle ? "translateX(0)" : "translateX(-500px)",
        "--color": color,
      }}
    >
      <div className="menu-title">
        Sections
        <button type="button" onClick={handleClose}>
          <span className="material-icons">close</span>
        </button>
      </div>
      <div className="question-items">
        {Object.keys(contents).map((contentKey) => {
          return (
            <div
              className={`question-item ${
                contentKey === currentItem ? "active" : ""
              }`}
              key={contentKey}
              onClick={() => handleSelect(contentKey)}
            >
              <div className="questionId">
                {contentKey.slice(0, 1).toUpperCase() +
                  contentKey.slice(1, contentKey.length).toLowerCase()}
              </div>
              {progress ? (
                <Progress
                  type="circle"
                  percent={
                    progressMap[contentKey] ? progressMap[contentKey] : 0
                  }
                  size={20}
                />
              ) : (
                contents[contentKey] !== -1 && (
                  <span
                    className="score"
                    style={{
                      background:
                        contents[contentKey] === 100
                          ? "rgb(39, 150, 0)"
                          : contents[contentKey] === 50
                          ? "rgb(251, 188, 4)"
                          : "rgb(236, 94, 79)",
                    }}
                  >
                    {contents[contentKey]}
                  </span>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SideMenu;
