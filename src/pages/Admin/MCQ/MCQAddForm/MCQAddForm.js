import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Button,
  Form,
  Modal,
  Upload,
  message,
  Space,
  Select,
  Input,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import Popup from "../../../../components/popUp/Popup";
import TextEditor from "../../../../components/textEditor/TextEditor";
import "../../AdminForms.css";
import "./MCQAddForm.css";

const SubmitButton = ({ form, onClicked }) => {
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
      Submit
    </Button>
  );
};

const MCQAddForm = ({ defaultValues, schema, route }) => {
  const token = Cookies.get("token");
  const [form] = Form.useForm();
  const [popup, setPopup] = useState({
    state: false,
    type: false,
    message: "",
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileUploaded, setFileUploaded] = useState("");
  const [currentSubject, setCurrentSubject] = useState("");

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handlePopupClose = () => {
    setPopup({
      ...popup,
      state: false,
    });
  };

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        let options = [];
        let postData = [
          {
            questionDescriptionText: values["questionDescriptionText"],
            correctOption: values["correctOption"],
            difficulty: values["difficulty"],
            mcqSubject: values["subject"],
            mcqTopic: values["topic"],
            mcqImage: fileUploaded,
            state: true,
            isMcq: true,
          },
        ];
        Object.keys(values).forEach((key) => {
          if (key.includes("option")) {
            options.push(values[key]);
          }
        });
        postData[0]["options"] = options;
        console.log(postData);
        try {
          var questionResponse = null;
          if (defaultValues) {
            questionResponse = await axios.put(
              route, // pass the route
              postData, // set form values
              {
                headers: {
                  authorization: token, // Replace with the actual token source
                },
              }
            );
          } else {
            questionResponse = await axios.post(
              route, // pass the route
              postData, // set form values
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
              message: "MCQ Question data submitted sucessfully",
            });
          } else {
            setPopup({
              state: true,
              type: false,
              message: "Cannot update MCQ question data",
            });
          }
        } catch (error) {
          let message = "Failed to send the MCQ question data";
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
      })
      .catch((error) => {
        setPopup({
          state: true,
          type: false,
          message: "Failed to send the MCQ question data",
        });
      });
  };

  const handleRemove = () => {
    // Reset the file upload status when the file is removed
    setFileUploaded("");
  };

  const handleFileUpload = async (file) => {
    // Convert the file to base64
    const base64File = await getBase64(file);
    setFileUploaded(base64File);
    // Set the base64 value
  };

  const subjectOptions = [];
  const topicOptions = {};
  const difficultyOptions = [
    { label: "Easy", value: "Easy" },
    { label: "Medium", value: "Medium" },
    { label: "Hard", value: "Hard" },
  ];
  Object.keys(schema).forEach((subject) => {
    subjectOptions.push({
      label: subject.slice(0, 1).toUpperCase() + subject.slice(1).toLowerCase(),
      value: subject,
    });
    let topicArr = [];
    Object.keys(schema[subject]).forEach((topic) => {
      topicArr.push({
        label: topic.slice(0, 1).toUpperCase() + topic.slice(1).toLowerCase(),
        value: topic,
      });
    });
    topicOptions[subject] = topicArr;
  });

  //Change the currentSubject state
  const handleSubjectChange = (e) => {
    // e directly contains the value of the option
    setCurrentSubject(e);
  };

  const [mcqOptionsList, setMcqOptionsList] = useState(
    defaultValues ? Array(defaultValues.options.length).fill(null) : []
  );

  const handleAddMcqOptionsList = () => {
    setMcqOptionsList([...mcqOptionsList, null]);
  };

  const handleRemoveMcqOptionsList = (index) => {
    const updatedLists = [...mcqOptionsList];
    updatedLists.splice(index, 1);
    setMcqOptionsList(updatedLists);
  };

  return (
    <div className="MCQQUESTIONFORM">
      {popup.state && (
        <Popup
          onClose={handlePopupClose}
          content={popup.message}
          type={popup.type}
        />
      )}
      <Form
        form={form}
        name="validateOnly"
        layout="vertical"
        autoComplete="off"
        className="adminForms"
        initialValues={defaultValues}
      >
        <span className="AllInputs" style={{ flexWrap: "nowrap" }}>
          <Form.Item
            name="questionDescriptionText"
            label="Question Description"
            rules={[
              {
                required: true,
              },
            ]}
            className="xlarge"
            style={{ height: 280 }}
          >
            <TextEditor height={200} />
          </Form.Item>
        </span>
        <span className="AllInputs">
          <Upload
            accept="image/png, image/jpeg, image/tiff, image/bmp, image/gif"
            maxCount={1}
            listType="picture-card"
            style={{ width: "150px" }}
            onPreview={handlePreview}
            onRemove={handleRemove}
            customRequest={({ file, onSuccess, onError }) => {
              // Check file size
              if (file.size > 1000000) {
                // Show error and apply red border
                message.error("Image size should be less than 1MB");
                onError("Image size should be less than 1MB");
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

          <Form.Item
            name="subject"
            label="Select Subject"
            rules={[
              {
                required: true,
              },
            ]}
            className="vvsmall"
          >
            <Select
              allowClear
              placeholder="Please select"
              options={subjectOptions}
              onChange={handleSubjectChange}
            />
          </Form.Item>

          <Form.Item
            name="topic"
            label="Select Topic"
            rules={[
              {
                required: true,
              },
            ]}
            className="vvsmall"
          >
            <Select
              allowClear
              placeholder="Please select"
              options={topicOptions[currentSubject]}
              disabled={currentSubject ? false : true}
            />
          </Form.Item>

          <Form.Item
            name="difficulty"
            label="Select Difficulty"
            rules={[
              {
                required: true,
              },
            ]}
            className="vvsmall"
          >
            <Select
              allowClear
              placeholder="Please select"
              options={difficultyOptions}
              disabled={currentSubject ? false : true}
            />
          </Form.Item>
        </span>
        <span className="AllInputs" style={{ flexWrap: "wrap" }}>
          <Form.Item
            name={"option1"}
            label={"Option - 1"}
            rules={[
              {
                required: true,
              },
            ]}
            className="vsmall"
          >
            <Input placeholder={"Option - 1"} />
          </Form.Item>
          <Form.Item
            name={"option2"}
            label={"Option - 2"}
            rules={[
              {
                required: true,
              },
            ]}
            className="vsmall"
          >
            <Input placeholder={"Option - 2"} />
          </Form.Item>
          {mcqOptionsList.map((_, index) => (
            <span
              className="vsmall"
              style={{ display: "flex", alignItems: "center" }}
              key={index}
            >
              <Form.Item
                name={`option${index + 3}`}
                label={`Option - ${index + 3}`}
                rules={[
                  {
                    required: true,
                  },
                ]}
                className="vsmall"
              >
                <Input placeholder={`Option - ${index + 3}`} />
              </Form.Item>
              <Button onClick={() => handleRemoveMcqOptionsList(index)}>
                <MinusCircleOutlined />
              </Button>
            </span>
          ))}
        </span>
        <span className="AllInputs" style={{ justifyContent: "center" }}>
          <Button onClick={handleAddMcqOptionsList} id="set-btn">
            Add Option
            <PlusCircleOutlined />
          </Button>
        </span>
        <span className="AllInputs">
          <Form.Item
            name="correctOption"
            label="Select Correct Option"
            rules={[
              {
                required: true,
              },
            ]}
            className="vvsmall"
          >
            <Select
              allowClear
              placeholder="Please select"
              options={[
                ...mcqOptionsList.map((_, index) => ({
                  label: index + 1,
                  value: index + 1,
                })),
                {
                  label: mcqOptionsList.length + 1,
                  value: mcqOptionsList.length + 1,
                },
                {
                  label: mcqOptionsList.length + 2,
                  value: mcqOptionsList.length + 2,
                },
              ]}
            />
          </Form.Item>
        </span>
        <Form.Item>
          <Space>
            <SubmitButton form={form} onClicked={handleFormSubmit} />
            <Button htmlType="reset">Reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

// Function to convert file to base64
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default MCQAddForm;
