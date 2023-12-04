import React from "react";
import "./QuestionDesc.css";
import StringToHTML from "../../components/stringToHTML/StringToHTML";

const QuestionDesc = ({ question, solved }) => {
  function copyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
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
          <div className="desc">
            <StringToHTML htmlString={question.questionDescriptionText} />
          </div>

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
                  <span
                    className="material-icons-outlined"
                    onClick={() =>
                      copyToClipboard(question.questionExampleInput1)
                    }
                  >
                    content_copy
                  </span>
                </span>
                <div className="inout-value">
                  {question.questionExampleInput1}
                </div>
              </div>
              <div className="inout">
                <span className="example-heading">
                  Output
                  <span
                    className="material-icons-outlined"
                    onClick={() =>
                      copyToClipboard(question.questionExampleOutput1)
                    }
                  >
                    content_copy
                  </span>
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
                  <span
                    className="material-icons-outlined"
                    onClick={() =>
                      copyToClipboard(question.questionExampleInput2)
                    }
                  >
                    content_copy
                  </span>
                </span>
                <div className="inout-value">
                  {question.questionExampleInput2}
                </div>
              </div>
              <div className="inout">
                <span className="example-heading">
                  Output
                  <span
                    className="material-icons-outlined"
                    onClick={() =>
                      copyToClipboard(question.questionExampleOutput2)
                    }
                  >
                    content_copy
                  </span>
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
                  <span
                    className="material-icons-outlined"
                    onClick={() =>
                      copyToClipboard(question.questionExampleInput3)
                    }
                  >
                    content_copy
                  </span>
                </span>
                <div className="inout-value">
                  {question.questionExampleInput3}
                </div>
              </div>
              <div className="inout">
                <span className="example-heading">
                  Output
                  <span
                    className="material-icons-outlined"
                    onClick={() =>
                      copyToClipboard(question.questionExampleOutput3)
                    }
                  >
                    content_copy
                  </span>
                </span>
                <div className="inout-value">
                  {question.questionExampleOutput3}
                </div>
              </div>
            </div>
          )}

          {question.questionExplanation && <h3>Explaination</h3>}
          {question.questionExplanation && (
            <p>{question.questionExplanation}</p>
          )}

          <input type="checkbox" name="" id="accord1" />
          {question && question.topic && (
            <label htmlFor="accord1" className="accordian">
              Related Topics
              <span className="icon"></span>
            </label>
          )}
          {question && question.topic && (
            <div className="collapse1">
              {question.topic.map((item, index) => (
                <span className="collapse-item" key={index}>
                  {item}
                </span>
              ))}
            </div>
          )}

          <input type="checkbox" name="" id="accord2" />
          {question && question.company && (
            <label htmlFor="accord2" className="accordian">
              Related Companies
              <span className="icon"></span>
            </label>
          )}
          {question && question.company && (
            <div className="collapse2">
              {question.company.map((item, index) => (
                <span className="collapse-item" key={index}>
                  {item}
                </span>
              ))}
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
