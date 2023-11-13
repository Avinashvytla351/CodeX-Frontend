import React, { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import "./IDE.css";
import Cookies from "js-cookie";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const IDE = (props) => {
  const token = Cookies.get("token");
  const username = Cookies.get("username");
  const containerRef = useRef(null);
  const [codeData, setCodeData] = useState({
    sourceCode: "# Python code",
    languageId: 34,
    input: "",
    compiler_options: null,
    contestId: props.contestId ? props.contestId : "practice",
    username: username.toLowerCase(),
    questionId: props.questionId,
    isRun: true,
  });

  const languageOptions = [
    { value: "python", label: "Python" },
    { value: "cpp", label: "CPP" },
    { value: "c", label: "C" },
    { value: "java", label: "Java" },
  ];
  const sizeOptions = [
    { value: 14, label: "14px" },
    { value: 16, label: "16px" },
    { value: 18, label: "18px" },
    { value: 20, label: "20px" },
  ];

  // Define default code snippets for each language
  const defaultCodeSnippets = {
    python: "# Python code",
    cpp: "// C++ code",
    c: "// C code",
    java: "// Java code",
  };
  const languageId = {
    python: "34",
    cpp: "10",
    c: "5",
    java: "26",
  };

  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [selectedSize, setSelectedSize] = useState(14);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(""); //Flag for identifying the output
  const [stdout, setStdout] = useState({
    statusVal: "",
    memory: 0,
    time: 0,
    outputVal: "",
    score: 0,
    run: true,
  });

  const handleLanguageChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedLanguage(selectedValue);
    setCodeData({
      ...codeData,
      languageId: languageId[selectedValue],
    });
  };

  const handleSizeChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedSize(selectedValue);
  };

  function handleEditorChange(value, event) {
    // here is the current value
    setCodeData({
      ...codeData,
      sourceCode: value,
    });
  }

  function handleStdinChange(event) {
    setCodeData({
      ...codeData,
      input: event.target.value,
    });
  }

  //RUN Code

  var abortController = new AbortController();

  const handleRunClick = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    // Check if there is an existing request in progress and abort it
    if (loading) {
      abortController.abort();
    }

    // Create a new AbortController
    var newAbortController = new AbortController();

    // Set the current AbortController to the new one
    abortController = newAbortController;

    // Set loading to true while making the request
    setLoading(true);

    // Send a POST request to the "runSubmission" endpoint with the new AbortController
    setCodeData({
      ...codeData,
      isRun: true,
    });
    axios
      .post(`${props.serverRoute}/validateSubmission`, codeData, {
        headers: {
          Authorization: token,
        },
        signal: newAbortController.signal, // Associate the AbortController with the request
      })
      .then((response) => {
        // Handle the response, e.g., display the output
        var tempStatus = "";
        if (response.data.success) {
          if (response.data.data.status.id) {
            if (
              response.data.data.status.id === 3 ||
              response.data.data.status.id === 4
            ) {
              tempStatus = "Compiled Successfully";
            } else {
              tempStatus = response.data.data.status.description;
            }
          } else {
            tempStatus = "Failed due invalid code or Internal Error";
          }
        } else {
          tempStatus = "Failed due invalid code or Internal Error";
        }
        setStdout({
          statusVal: tempStatus,
          memory: response.data.data.memory,
          time: response.data.data.time,
          outputVal: response.data.data.stdout || response.data.data.stderr,
          score: 0,
          run: true,
        });
      })
      .catch((error) => {
        // Check if the request was aborted
        setStdout({
          statusVal: "Failed to Fetch the result",
          memory: 0,
          time: 0,
          outputVal: "Check your internet connection or try after sometime",
          score: 0,
          run: true,
        });
      })

      .finally(() => {
        // Set loading to false when the request is complete
        setLoading(false);
        setOutput("RUN");
      });
  };

  const handleSubmitClick = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    // Check if there is an existing request in progress and abort it
    if (loading) {
      abortController.abort();
    }

    // Create a new AbortController
    var newAbortController = new AbortController();

    // Set the current AbortController to the new one
    abortController = newAbortController;

    // Set loading to true while making the request
    setLoading(true);
    setCodeData({
      ...codeData,
      isRun: false,
    });

    // Send a POST request to the "validateSubmission" endpoint with the new AbortController
    axios
      .post(`${props.serverRoute}/validateSubmission`, codeData, {
        headers: {
          Authorization: token,
        },
        signal: newAbortController.signal, // Associate the AbortController with the request
      })
      .then((response) => {
        // Handle the response, e.g., display the result
        console.log(response.data);
        setStdout({
          statusVal: "Submitted Successfully",
          memory: 0,
          time: 0,
          outputVal: "",
          score: response.data.data.score,
          run: false,
        });

        props.onScoreChange({
          id: props.questionId,
          score: response.data.data.score,
        });
      })
      .catch((error) => {
        // Check if the request was aborted
        if (error.name === "AbortError") {
          console.log("Request aborted");
        } else {
          console.error("Error validating submission:", error);
        }

        setStdout({
          statusVal: "Failed to Fetch the result",
          memory: 0,
          time: 0,
          outputVal: "Check your internet connection or try after sometime",
          score: 0,
          run: false,
        });
        props.onScoreChange({
          id: props.questionId,
          score: 0,
        });
      })
      .finally(() => {
        // Set loading to false when the request is complete
        setLoading(false);
        setOutput("SUBMIT");
      });
  };

  return (
    <div className="IDEDITOR" ref={containerRef}>
      <div className="editor">
        <div className="editor-main">
          <div className="editor-head">
            <div className="options">
              <select
                className="dropdown"
                onChange={handleLanguageChange}
                value={selectedLanguage}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                className="dropdown"
                onChange={handleSizeChange}
                value={selectedSize}
              >
                {sizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="qid">{props.questionId}</div>
          </div>
          <div className="ide">
            <Editor
              height="100%"
              width="100%"
              language={selectedLanguage}
              options={{
                fontSize: selectedSize,
                contextmenu: props.admin ? true : false,
              }}
              value={defaultCodeSnippets[selectedLanguage]}
              theme="vs-dark"
              onChange={handleEditorChange}
              onMount={(editor) => {
                // Attach a keydown event listener to the editor
                editor.onKeyDown((event) => {
                  const { keyCode, ctrlKey, metaKey } = event;
                  if (
                    (keyCode === 33 || keyCode === 52) &&
                    (metaKey || ctrlKey)
                  ) {
                    event.preventDefault();
                  }
                });
              }}
            />
          </div>
        </div>
        <div className="editor-out">
          <div className="block"></div>
          <h5>Test with custom input</h5>
          <textarea
            name="input"
            id="input"
            rows="7"
            placeholder="Your Input"
            onChange={handleStdinChange}
          ></textarea>
          {output && (
            <div className="output-area">
              {loading ? (
                <Oval
                  height={80}
                  width={80}
                  color="rgb(150, 251, 74)"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                  ariaLabel="oval-loading"
                  secondaryColor="#4fa94d"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
              ) : (
                <div className="stdout">
                  <div className="out-status">{stdout.statusVal}</div>
                  <div className="out-details">
                    <span className="info">Time: {stdout.time}</span>
                    <span className="info">Memory: {stdout.memory}</span>
                  </div>
                  <label htmlFor="output">
                    {stdout.run ? "Output" : "Result"}
                  </label>
                  {stdout.run ? (
                    <textarea
                      name=""
                      id="output"
                      rows="7"
                      readOnly
                      value={stdout.outputVal ? stdout.outputVal : ""}
                    ></textarea>
                  ) : (
                    <div
                      className="result"
                      style={{
                        background:
                          stdout.score === 100
                            ? "rgb(39, 150, 0)"
                            : stdout.score === 50
                            ? "rgb(251, 188, 4)"
                            : "rgb(236, 94, 79)",
                      }}
                    >
                      <span>Your Score</span>
                      {stdout.score}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="controls">
            <button type="button" onClick={handleRunClick}>
              Run
            </button>
            <button type="button" onClick={handleSubmitClick}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDE;
