import React from "react";
import "./QuestionDesc.css";

const QuestionDesc = ({ question, solved }) => {
  return (
    <div className="QUESTION">
      {question ? (
        <div className="questionMain">
          <div className="title">
            <h2>{question.questionName}</h2>
            <div className="title-details">
              <span
                className="difficulty"
                style={{
                  color:
                    question.difficulty === "Easy"
                      ? "rgb(81, 218, 133)"
                      : question.difficulty === "Medium"
                      ? "rgb(246, 189, 65)"
                      : "rgb(236,94,79)",
                }}
              >
                {question.difficulty}
              </span>
              {solved ? (
                <span className="material-icons-round">done_all</span>
              ) : (
                <span></span>
              )}
            </div>
          </div>
          <p>{question.questionDescriptionText}</p>

          <h3>Input</h3>
          <p>{question.questionInputText}</p>
          <h3>Output</h3>
          <p>{question.questionOutputText}</p>
          {question.questionExampleInput1 && <h3>Sample 1</h3>}
          {question.questionExampleInput1 && (
            <div className="example">
              <div className="inout">
                <span className="example-heading">
                  Input
                  <span className="material-icons-outlined">content_copy</span>
                </span>
                <div className="inout-value">
                  {question.questionExampleInput1}
                </div>
              </div>
              <div className="inout">
                <span className="example-heading">
                  Output
                  <span className="material-icons-outlined">content_copy</span>
                </span>
                <div className="inout-value">
                  {question.questionExampleOutput1}
                </div>
              </div>
            </div>
          )}
          {question.questionExampleInput2 && <h3>Sample 2</h3>}
          {question.questionExampleInput2 && (
            <div className="example">
              <div className="inout">
                <span className="example-heading">
                  Input
                  <span className="material-icons-outlined">content_copy</span>
                </span>
                <div className="inout-value">
                  {question.questionExampleInput2}
                </div>
              </div>
              <div className="inout">
                <span className="example-heading">
                  Output
                  <span className="material-icons-outlined">content_copy</span>
                </span>
                <div className="inout-value">
                  {question.questionExampleOutput2}
                </div>
              </div>
            </div>
          )}
          {question.questionExampleInput3 && <h3>Sample 3</h3>}
          {question.questionExampleInput3 && (
            <div className="example">
              <div className="inout">
                <span className="example-heading">
                  Input
                  <span className="material-icons-outlined">content_copy</span>
                </span>
                <div className="inout-value">
                  {question.questionExampleInput3}
                </div>
              </div>
              <div className="inout">
                <span className="example-heading">
                  Output
                  <span className="material-icons-outlined">content_copy</span>
                </span>
                <div className="inout-value">
                  {question.questionExampleOutput3}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
};

export default QuestionDesc;
