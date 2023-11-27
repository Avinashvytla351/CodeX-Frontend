import React, { useState, useEffect } from "react";
import "./MCQQuestionDesc.css";
import StringToHTML from "../../components/stringToHTML/StringToHTML";
import { Image } from "antd";

const MCQQuestionDesc = ({ question, onResponse, onNavigate }) => {
  const [selectedOption, setSelectedOption] = useState(
    question.selected ? question.selected : null
  );

  const handleOption = (option) => {
    setSelectedOption(option);
    onResponse(option);
  };

  useEffect(() => {
    // Reset selected option when a new question is received
    setSelectedOption(question.selected ? question.selected : null);
  }, [question]);

  const [imageurl, setImageUrl] = useState(question.mcqImage);

  useEffect(() => {
    // modify imageUrl when question changes
    let image = question.mcqImage;
    let imageUrl = "";
    try {
      if (image.slice(0, 20).includes("drive")) {
        const fileId = image.split("/")[5];
        imageUrl = `https://drive.google.com/uc?id=${fileId}`;
      } else if (image.slice(0, 20).includes("data")) {
        imageUrl = image;
      }
    } catch (error) {
      imageUrl = "";
    }

    setImageUrl(imageUrl);
  }, [question.mcqImage]);
  return (
    <div className="MCQQUESTIONDESC">
      {question ? (
        <div className="questionMain">
          <div className="title">
            <h2></h2>
            <div className="title-details">
              <span
                className="difficulty"
                style={{ color: "rgb(230, 225, 233)" }}
              >
                {question.questionId.toUpperCase() + " |"}
                &nbsp;
              </span>
              <span
                className="difficulty"
                style={{ color: "rgb(230, 225, 233)" }}
              >
                {question.mcqSubject.slice(0, 1).toUpperCase() +
                  question.mcqSubject
                    .slice(1, question.mcqSubject.length)
                    .toLowerCase() +
                  " >"}
                &nbsp;
              </span>
              <span
                className="difficulty"
                style={{ color: "rgb(230, 225, 233)" }}
              >
                {question.mcqTopic.slice(0, 1).toUpperCase() +
                  question.mcqTopic
                    .slice(1, question.mcqTopic.length)
                    .toLowerCase() +
                  " >"}
                &nbsp;
              </span>
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
            </div>
          </div>
          <div className="desc">
            <StringToHTML htmlString={question.questionDescriptionText} />
          </div>
          {question.mcqImage && (
            <div className="img">
              <Image
                height={250}
                src={imageurl}
                placeholder={
                  <Image preview={false} src={imageurl} width={200} />
                }
              />
            </div>
          )}
          <div className="options">
            {question.options.map((option, index) => (
              <span className="option-wrap" key={index}>
                <input
                  type="radio"
                  name={`options${question.questionId}`}
                  id={`option${index}`}
                  onChange={() => handleOption(index + 1)}
                  checked={selectedOption === index + 1}
                />
                <label htmlFor={`option${index}`}>
                  <span>{option}</span>
                </label>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p>No questions available</p>
      )}
    </div>
  );
};

export default MCQQuestionDesc;
