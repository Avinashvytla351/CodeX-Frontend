import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Popup from "../../../../components/popUp/Popup";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Space,
  Select,
  Steps,
  Upload,
  Modal,
  message,
  Typography,
  Card,
  Message,
} from "antd";
import "../../AdminForms.css";
import "./QuestionAddForm.css";
import TextEditor from "../../../../components/textEditor/TextEditor";
import {
  FileTextOutlined,
  SplitCellsOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Editor from "@monaco-editor/react";

const { Text } = Typography;

const { TextArea } = Input;

const SubmitButton = ({ form, onClicked, text }) => {
  const [submittable, setSubmittable] = React.useState(false);

  // Watch all values
  const values = Form.useWatch([], form);
  const handleClick = () => {
    onClicked(true);
  };
  React.useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(
        () => {
          setSubmittable(true);
        },
        (err) => {
          setSubmittable(false);
        }
      );
  }, [values]);
  return (
    <Button
      type="primary"
      htmlType="submit"
      disabled={!submittable}
      onClick={handleClick}
    >
      {text}
    </Button>
  );
};

const filterOption = (input, option) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const QuestionDetails = ({
  topics,
  companies,
  defaultValues,
  subjects,
  chapters,
  onContinue,
}) => {
  const [form] = Form.useForm();

  const [currentSubject, setCurrentSubject] = useState("");

  //Image related things
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileUploaded, setFileUploaded] = useState(null);

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleRemove = () => {
    // Reset the file upload status when the file is removed
    setFileUploaded(null);
  };

  const handleFileUpload = async (file) => {
    setFileUploaded(file);
  };

  //image related things ends

  const options1 = [];
  topics.forEach((topic) => {
    options1.push({
      label: topic,
      value: topic,
    });
  });
  const options2 = [];
  companies.forEach((company) => {
    options2.push({
      label: company,
      value: company,
    });
  });

  const subjectOptions = [];
  subjects.forEach((subject) => {
    subjectOptions.push({
      label: subject.subjectName,
      value: subject.subjectId,
    });
  });

  const chapterOptions = {};
  chapters.forEach((chapter) => {
    try {
      chapterOptions[chapter.subjectId].push({
        label: chapter.chapterName,
        value: chapter.chapterId,
      });
    } catch (err) {
      chapterOptions[chapter.subjectId] = [
        { label: chapter.chapterName, value: chapter.chapterId },
      ];
    }
  });

  const handleSubjectChange = (e) => {
    setCurrentSubject(e);
  };

  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      values.descriptionImage = fileUploaded;
      subjectOptions.forEach((option) => {
        if (option.value === values.subject) {
          values.subjectName = option.label;
        }
      });
      if (values.subjectName) {
        chapterOptions[values.subject].forEach((option) => {
          if (values.chapter === option.value) {
            values.chapterName = option.label;
          }
        });
      }
      onContinue(values); //callback to the QuestionsForm functions
    });
  };
  return (
    <Form
      form={form}
      name="validateOnly"
      layout="vertical"
      autoComplete="off"
      className="adminForms"
      initialValues={defaultValues}
    >
      <span className="AllInputs">
        <Form.Item
          name="subject"
          label="Subject"
          rules={[
            {
              required: true,
            },
          ]}
          className="vsmall"
        >
          <Select
            allowClear
            placeholder="Please select"
            options={subjectOptions}
            showSearch
            filterOption={filterOption}
            onChange={handleSubjectChange}
          />
        </Form.Item>

        <Form.Item
          name="chapter"
          label="Chapter"
          rules={[
            {
              required: true,
            },
          ]}
          className="vsmall"
        >
          <Select
            allowClear
            placeholder="Please select"
            options={chapterOptions[currentSubject]}
            showSearch
            filterOption={filterOption}
            disabled={!currentSubject.length}
          />
        </Form.Item>
      </span>
      <span className="AllInputs">
        <Form.Item
          name="questionName"
          label="Question Name"
          rules={[
            {
              required: true,
            },
          ]}
          className="vsmall"
        >
          <Input placeholder="Question Name" />
        </Form.Item>
        <Form.Item
          name="author"
          label="Author"
          rules={[
            {
              required: false,
            },
          ]}
          className="vsmall"
        >
          <Input placeholder="Author" />
        </Form.Item>
      </span>
      <span className="AllInputs">
        <Form.Item
          name="questionDescriptionText"
          label="Question Description"
          rules={[
            {
              required: true,
            },
          ]}
          className="xlarge"
        >
          <TextEditor />
        </Form.Item>
      </span>
      <span className="AllInputs">
        <span style={{ display: "flex", flexDirection: "column" }}>
          <Text style={{ marginBottom: 10 }}>Description Image</Text>
          <Upload
            accept="image/png, image/jpeg, image/tiff, image/bmp, image/gif"
            maxCount={1}
            listType="picture-card"
            style={{ width: "150px" }}
            onPreview={handlePreview}
            onRemove={handleRemove}
            customRequest={({ file, onSuccess, onError }) => {
              // Check file size
              if (file.size > 100000) {
                // Show error and apply red border
                message.error("Image size should be less than 100KB");
                onError("Image size should be less than 100KB");
                return;
              }

              const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/gif",
                "image/bmp",
                "image/tiff",
                // Add more image formats as needed
              ];

              if (!allowedTypes.includes(file.type)) {
                // Show error and apply red border
                message.error(
                  "Invalid file type. Please upload a supported image format."
                );
                onError(
                  "Invalid file type. Please upload a supported image format."
                );
                return;
              }

              // Simulate a successful upload without sending the file
              setTimeout(() => {
                // Resolve with a dummy response
                handleFileUpload(file);
                onSuccess(); // Notify Ant Design Upload component that the upload is successful
              }, 0);
            }}
          >
            {!fileUploaded && (
              <div>
                <PlusOutlined />
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Upload
                </div>
              </div>
            )}
          </Upload>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img
              alt="example"
              style={{
                width: "100%",
              }}
              src={previewImage}
            />
          </Modal>
        </span>

        <Form.Item
          name="difficulty"
          label="Difficulty"
          rules={[
            {
              required: true,
            },
          ]}
          className="vsmall"
        >
          <Select
            allowClear
            placeholder="Please select"
            options={[
              {
                label: "Easy",
                value: "Easy",
              },
              {
                label: "Medium",
                value: "Medium",
              },
              {
                label: "Hard",
                value: "Hard",
              },
            ]}
          />
        </Form.Item>
      </span>
      <span className="AllInputs">
        <Form.Item
          name="questionInputText"
          label="Question Input Format"
          rules={[
            {
              required: true,
            },
          ]}
          className="xlarge"
          style={{ height: 220 }}
        >
          <TextEditor height={150} />
        </Form.Item>
      </span>
      <span className="AllInputs">
        <Form.Item
          name="questionOutputText"
          label="Question Output"
          rules={[
            {
              required: true,
            },
          ]}
          className="xlarge"
          style={{ height: 220 }}
        >
          <TextEditor height={150} />
        </Form.Item>
      </span>
      <span className="AllInputs">
        <Form.Item
          name="explaination"
          label="Explaination"
          rules={[
            {
              required: false,
            },
          ]}
          className="xlarge"
          style={{ height: 220 }}
        >
          <TextEditor height={150} />
        </Form.Item>
      </span>
      <span className="AllInputs">
        <Form.Item
          name="topic"
          label="Topics"
          rules={[
            {
              required: false,
            },
          ]}
          className="vsmall"
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="Please select"
            options={options1}
          />
        </Form.Item>
        <Form.Item
          name="company"
          label="Companies"
          rules={[
            {
              required: false,
            },
          ]}
          className="vsmall"
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="Please select"
            options={options2}
          />
        </Form.Item>
      </span>
      <Form.Item>
        <Space>
          <SubmitButton
            form={form}
            onClicked={handleFormSubmit}
            text={"Continue"}
          />
          <Button htmlType="reset">Reset</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

const TestcasesForm = ({ defaultValues, onBack, onSubmit }) => {
  const [form] = Form.useForm();
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const success = (type, content) => {
    messageApi.open({
      type: type,
      content: content,
      className: "custom-class",
      style: {
        marginTop: "20vh",
      },
    });
  };

  const defaultCodeSnippets = {
    python: "# Python code",
    cpp: "// C++ code",
    c: "// C code",
    java: "// Java code",
  };

  const handleLanguageChange = (event) => {
    const selectedValue = event;
    setSelectedLanguage(selectedValue);
  };

  const handleBack = () => {
    onBack(true); //Callback for back to Question Details, sent to Question Description (Export Function)
  };

  function handleEditorChange(value) {
    // here is the current value
    value = btoa(value);
    setCode(value);
  }

  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      if (values.exampleTestCase) {
        values.exampleTestCase.push({
          Input: values.exampleTestCaseInput1,
          Output: values.exampleTestCaseOutput1,
        });
      } else {
        values.exampleTestCase = [];
        values.exampleTestCase.push({
          Input: values.exampleTestCaseInput1,
          Output: values.exampleTestCaseOutput1,
        });
      }
      if (values.hiddenTestCase) {
        values.hiddenTestCase.push({
          Input: values.hiddenTestCaseInput1,
          Weightage: values.Weightage1,
          Output: values.hiddenTestCaseOutput1,
        });
      } else {
        values.hiddenTestCase = [];
        values.hiddenTestCase.push({
          Input: values.hiddenTestCaseInput1,
          Weightage: values.Weightage1,
          Output: values.hiddenTestCaseOutput1,
        });
      }

      values.code = code;

      let weightageSum = 0;
      values.hiddenTestCase.forEach((testCase) => {
        weightageSum += testCase.Weightage;
      });

      let flag = true;

      if (weightageSum > 100) {
        success("error", "Sum of weightages is more than 100%");
        flag = false;
      } else if (weightageSum < 100) {
        success("error", "Sum of weightages is less than 100%");
        flag = false;
      }

      if (code.length == 0) {
        success("error", "Please mention the code to validate testcases");
        flag = false;
      }

      if (flag) {
        onSubmit(values);
      }
    });
  };
  return (
    <div className="TESTCASESFORM">
      {contextHolder}
      <Form
        form={form}
        name="validateOnly"
        layout="vertical"
        autoComplete="off"
        className="adminForms"
        initialValues={defaultValues}
      >
        <h3 style={{ marginLeft: "10px", fontWeight: 700 }}>
          Example Testcases
        </h3>
        <Card title="Example Test Case - 1" style={{ marginBottom: 20 }}>
          <span className="AllInputs" style={{ flexWrap: "wrap" }}>
            <Form.Item
              name={"exampleTestCaseInput1"}
              label={"Input"}
              rules={[
                {
                  required: true,
                  message: "Missing Input",
                },
              ]}
              className="small"
            >
              <TextArea placeholder={"Input"} />
            </Form.Item>
            <Form.Item
              name={"exampleTestCaseOutput1"}
              label={"Output"}
              rules={[
                {
                  required: true,
                  message: "Missing Output",
                },
              ]}
              className="small"
            >
              <TextArea placeholder={"Output"} />
            </Form.Item>
          </span>
        </Card>

        <Form.List name="exampleTestCase">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  title={`Example Test Case - ${key + 2}`}
                  extra={
                    <Button danger onClick={() => remove(name)}>
                      <CloseOutlined />
                    </Button>
                  }
                  style={{ marginBottom: 20 }}
                >
                  <span className="AllInputs" style={{ flexWrap: "wrap" }}>
                    <Form.Item
                      {...restField}
                      name={[name, "Input"]}
                      label={"Input"}
                      rules={[
                        {
                          required: true,
                          message: "Missing Input",
                        },
                      ]}
                      className="small"
                    >
                      <TextArea placeholder={"Input"} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "Output"]}
                      label={"Output"}
                      rules={[
                        {
                          required: true,
                          message: "Missing Output",
                        },
                      ]}
                      className="small"
                    >
                      <TextArea placeholder={"Output"} />
                    </Form.Item>
                  </span>
                </Card>
              ))}
              <span
                className="AllInputs"
                style={{ justifyContent: "center", marginBottom: 50 }}
              >
                <Button onClick={() => add()} id="set-btn">
                  Add Example Testcase
                  <PlusCircleOutlined />
                </Button>
              </span>
            </>
          )}
        </Form.List>

        <Text>
          Follow these instructions while creating your hidden testcases:
          <ol>
            <li>
              Assign weightage for hidden test cases, ensuring that the sum of
              all weights equals 100%
            </li>
            <li>
              Score for the question is distributed among the testcases based on
              their respective weightages
            </li>
          </ol>
        </Text>

        <h3 style={{ marginLeft: "10px", fontWeight: 700 }}>
          Hidden Testcases
        </h3>
        <Card title="Hidden Test Case - 1" style={{ marginBottom: 20 }}>
          <span className="AllInputs" style={{ flexWrap: "wrap" }}>
            <Form.Item
              name={"hiddenTestCaseInput1"}
              label={"Input"}
              rules={[
                {
                  required: true,
                  message: "Missing Input",
                },
              ]}
              className="small"
            >
              <TextArea placeholder={"Input"} />
            </Form.Item>
            <Form.Item
              name={"Weightage1"}
              label={"Weightage"}
              rules={[
                {
                  required: true,
                  message: "Missing Weightage",
                },
              ]}
              className="vvsmall"
            >
              <InputNumber addonAfter="%" max={100} />
            </Form.Item>
            <Form.Item
              name={"hiddenTestCaseOutput1"}
              label={"Output"}
              rules={[
                {
                  required: true,
                  message: "Missing Output",
                },
              ]}
              className="small"
            >
              <TextArea placeholder={"Output"} />
            </Form.Item>
          </span>
        </Card>

        <Form.List name="hiddenTestCase">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  title={`Hidden Test Case - ${key + 2}`}
                  extra={
                    <Button danger onClick={() => remove(name)}>
                      <CloseOutlined />
                    </Button>
                  }
                  style={{ marginBottom: 20 }}
                >
                  <span className="AllInputs" style={{ flexWrap: "wrap" }}>
                    <Form.Item
                      {...restField}
                      name={[name, "Input"]}
                      label={"Input"}
                      rules={[
                        {
                          required: true,
                          message: "Missing Input",
                        },
                      ]}
                      className="small"
                    >
                      <TextArea placeholder={"Input"} />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "Weightage"]}
                      label={"Weightage"}
                      rules={[
                        {
                          required: true,
                          message: "Missing Weightage",
                        },
                      ]}
                      className="vvsmall"
                    >
                      <InputNumber addonAfter="%" max={100} />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "Output"]}
                      label={"Output"}
                      rules={[
                        {
                          required: true,
                          message: "Missing Output",
                        },
                      ]}
                      className="small"
                    >
                      <TextArea placeholder={"Output"} />
                    </Form.Item>
                  </span>
                </Card>
              ))}
              <span className="AllInputs" style={{ justifyContent: "center" }}>
                <Button onClick={() => add()} id="set-btn">
                  Add Hidden Testcase
                  <PlusCircleOutlined />
                </Button>
              </span>
            </>
          )}
        </Form.List>

        <Card title={"Code Validation"} style={{ margin: "20px 0" }}>
          <span className="AllInputs">
            <Form.Item
              name={"codeLanguage"}
              label={"Language"}
              rules={[
                {
                  required: true,
                  message: "Missing Language",
                },
              ]}
              className="medium"
            >
              <Select
                allowClear
                placeholder="Please select"
                options={[
                  {
                    label: "Python",
                    value: "python",
                  },
                  {
                    label: "CPP",
                    value: "cpp",
                  },
                  {
                    label: "C",
                    value: "c",
                  },
                  {
                    label: "JAVA",
                    value: "java",
                  },
                ]}
                onChange={handleLanguageChange}
              />
            </Form.Item>
          </span>

          <span className="AllInputs">
            <Editor
              height="350px"
              width="100%"
              language={selectedLanguage}
              options={{
                fontSize: 14,
                contextmenu: true,
              }}
              value={defaultCodeSnippets[selectedLanguage]}
              theme="vs"
              onChange={handleEditorChange}
            />
          </span>
        </Card>

        <Form.Item>
          <Space>
            <Button onClick={handleBack}>Back</Button>
            <SubmitButton
              form={form}
              onClicked={handleFormSubmit}
              text={"Submit"}
            />
            <Button htmlType="reset">Reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

const QuestionAddForm = ({
  topics,
  companies,
  route,
  defaultValues,
  subjects,
  chapters,
}) => {
  const token = Cookies.get("token");
  const [popup, setPopup] = useState({
    state: false,
    type: false,
    message: "",
  });
  const [current, setCurrent] = useState(0);
  const [questionDetails, setQuestionDetails] = useState({});

  const handlePopupClose = () => {
    setPopup({
      ...popup,
      state: false,
    });
  };

  const handleQuestionDetails = (formValues) => {
    setCurrent(1);
    setQuestionDetails(formValues);
  };

  const handleFinalSubmit = async (testCases) => {
    const values = new FormData();
    Object.keys(questionDetails).forEach((item) => {
      values.append(item, JSON.stringify(questionDetails[item]));
    });
    Object.keys(testCases).forEach((item) => {
      values.append(item, JSON.stringify(testCases[item]));
    });
    values.append("image", questionDetails.descriptionImage);
    console.log(values.get("descriptionImage"));
    try {
      var questionResponse = null;
      if (defaultValues) {
        questionResponse = await axios.put(
          route, // pass the route
          values, // set form values
          {
            headers: {
              authorization: token, // Replace with the actual token source
            },
          }
        );
      } else {
        questionResponse = await axios.post(
          route, // pass the route
          values, // set form values
          {
            headers: {
              authorization: token, // Replace with the actual token source
            },
          }
        );
      }
      if (questionResponse) {
        setPopup({
          state: true,
          type: true,
          message: "Question data submitted sucessfully",
        });
      } else {
        setPopup({
          state: true,
          type: false,
          message: "Cannot update question data",
        });
      }
    } catch (error) {
      let message = "Failed to send the question data";
      message =
        error.response && error.response.data.message
          ? error.response.data.message
          : message;
      setPopup({
        state: true,
        type: false,
        message: message,
      });
    }
  };

  const handleBack = (value) => {
    if (value) {
      setCurrent(0);
    }
  };
  return (
    <div className="QUESTIONFORM">
      {popup.state && (
        <Popup
          onClose={handlePopupClose}
          content={popup.message}
          type={popup.type}
        />
      )}
      <Steps
        size="small"
        current={current}
        style={{ width: 500, margin: "20px auto" }}
        items={[
          {
            title: "Question Description",
            icon: <FileTextOutlined />,
          },
          {
            title: "Testcases",
            icon: <SplitCellsOutlined />,
          },
        ]}
      />
      {current ? (
        <TestcasesForm
          defaultValues={defaultValues}
          onBack={handleBack}
          onSubmit={handleFinalSubmit}
        />
      ) : (
        <QuestionDetails
          topics={topics}
          companies={companies}
          subjects={subjects}
          chapters={chapters}
          defaultValues={defaultValues}
          onContinue={handleQuestionDetails}
        />
      )}
    </div>
  );
};

export default QuestionAddForm;
