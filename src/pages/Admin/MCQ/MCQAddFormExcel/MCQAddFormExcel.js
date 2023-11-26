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
  Typography,
  Collapse,
  Tag,
  Table,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Popup from "../../../../components/popUp/Popup";
import "../../AdminForms.css";
import "./MCQAddFormExcel.css";
import { read, utils } from "xlsx";

const { Text } = Typography;

const MCQAddFormExcel = ({ route, schema }) => {
  const token = Cookies.get("token");
  const [form] = Form.useForm();
  const [popup, setPopup] = useState({
    state: false,
    type: false,
    message: "",
  });
  const [fileUploaded, setFileUploaded] = useState([]);

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
        try {
          var questionResponse = null;
          questionResponse = await axios.post(
            route, // pass the route
            fileUploaded, // set data
            {
              headers: {
                authorization: token, // Replace with the actual token source
              },
            }
          );
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
    setFileUploaded([]);
  };

  var report = { success: true, data: [] };
  const subjectOptions = [];
  const topicOptions = {};
  Object.keys(schema).forEach((subject) => {
    subjectOptions.push(subject);
    let topicArr = [];
    Object.keys(schema[subject]).forEach((topic) => {
      topicArr.push(topic);
    });
    topicOptions[subject] = topicArr;
  });

  const handleFileUpload = async (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      report.success = true;
      report.data = [];
      const data = e.target.result; // No need for Uint8Array conversion
      const workbook = read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet data to JSON format
      const jsonData = utils.sheet_to_json(sheet, { header: 1 });

      // Assume the first row contains column names
      const columns = jsonData[0];

      // Extract data column-wise
      const columnData = {};
      columns.forEach(async (column, columnIndex) => {
        let columnValues = jsonData.slice(1).map((row) => row[columnIndex]);
        if (column.toLowerCase().includes("description")) {
          columnValues.forEach((item, index) => {
            if (columnData[index]) {
              columnData[index]["questionDescriptionText"] = item;
            } else {
              columnData[index] = { questionDescriptionText: item };
            }
          });
        } else if (column.toLowerCase().includes("image")) {
          columnValues.forEach((item, index) => {
            if (
              item &&
              item.toLowerCase().includes("drive_link") &&
              item.toLowerCase().includes("https") &&
              item.toLowerCase().includes("drive")
            ) {
              if (columnData[index]) {
                columnData[index]["mcqImage"] = item;
              } else {
                columnData[index] = { mcqImage: item };
              }
            } else {
              if (item) {
                report.success = false;
                report.data.push({
                  row: index + 2,
                  column: "image",
                  issue: "please mention a valid drive url",
                });
                columnData[index]["state"] = false;
              }
            }
          });
        } else if (column.toLowerCase().includes("options")) {
          columnValues.forEach((item, index) => {
            let options = item ? item.split(",") : null;
            if (options && options.length > 1) {
              if (columnData[index]) {
                columnData[index]["options"] = options;
              } else {
                columnData[index] = { options: options };
              }
            } else {
              if (item) {
                report.success = false;
                report.data.push({
                  row: index + 2,
                  column: "options",
                  issue: "a minimum 2 options are required",
                });
                columnData[index]["state"] = false;
              }
            }
          });
        } else if (column.toLowerCase().includes("correct")) {
          columnValues.forEach((item, index) => {
            if (
              item &&
              columnData[index] &&
              Number(item) &&
              columnData[index]["options"] &&
              columnData[index]["options"].length >= Number(item)
            ) {
              columnData[index]["correctOption"] = item;
            } else {
              if (item) {
                report.success = false;
                report.data.push({
                  row: index + 2,
                  column: "correctOption",
                  issue:
                    "the number options are not satisfying with the correct option provided",
                });
                columnData[index]["state"] = false;
              }
            }
          });
        } else if (column.toLowerCase().includes("subject")) {
          columnValues.forEach((item, index) => {
            let flag = 0;
            subjectOptions.forEach((subject, subindex) => {
              if (item && subject.toLowerCase() === item.toLowerCase()) {
                flag = subindex + 1;
                return;
              }
            });
            if (flag) {
              if (columnData[index]) {
                columnData[index]["mcqSubject"] = subjectOptions[flag - 1];
              } else {
                columnData[index] = { mcqSubject: subjectOptions[flag - 1] };
              }
            } else {
              if (item) {
                report.success = false;
                report.data.push({
                  row: index + 2,
                  column: "subject",
                  issue: "there is invalid subject",
                });
                columnData[index]["state"] = false;
              }
            }
          });
        } else if (column.toLowerCase().includes("topic")) {
          columnValues.forEach((item, index) => {
            let flag = 0;
            if (item && columnData[index] && columnData[index]["mcqSubject"]) {
              topicOptions[columnData[index]["mcqSubject"]].forEach(
                (topic, topIndex) => {
                  if (topic.toLowerCase() === item.toLowerCase()) {
                    flag = topIndex + 1;
                  }
                }
              );
            }
            if (flag) {
              if (columnData[index]) {
                columnData[index]["mcqTopic"] =
                  topicOptions[columnData[index]["mcqSubject"]][flag - 1];
              } else {
                columnData[index] = {
                  mcqTopic:
                    topicOptions[columnData[index]["mcqSubject"]][flag - 1],
                };
              }
            } else {
              if (item) {
                report.success = false;
                report.data.push({
                  row: index + 2,
                  column: "topic",
                  issue: "there is invalid topic",
                });
                columnData[index]["state"] = false;
              }
            }
          });
        } else if (column.toLowerCase().includes("difficulty")) {
          columnValues.forEach((item, index) => {
            let flag = 0;
            if (item && item.toLowerCase() === "easy") {
              item = "Easy";
              flag = 1;
            } else if (item && item.toLowerCase() === "medium") {
              item = "Medium";
              flag = 1;
            } else if (item && item.toLowerCase() === "hard") {
              item = "Hard";
              flag = 1;
            }
            if (flag) {
              if (columnData[index]) {
                columnData[index]["difficulty"] = item;
              } else {
                columnData[index] = { difficulty: item };
              }
            } else {
              if (item) {
                report.success = false;
                report.data.push({
                  row: index + 2,
                  column: "difficulty",
                  issue: "there is invalid difficulty",
                });
                columnData[index]["state"] = false;
              }
            }
          });
        }
      });

      Object.keys(columnData).forEach((column) => {
        if (
          !columnData[column]["state"] &&
          Object.keys(columnData[column]).length > 1
        ) {
          columnData[column]["state"] = true;
        }
        if (
          Object.keys(columnData[column]).length <= 8 &&
          Object.keys(columnData[column]).length > 1
        ) {
          if (
            columnData[column].state &&
            (!columnData[column].options ||
              !columnData[column].options.length ||
              !columnData[column].correctOption ||
              !columnData[column].mcqSubject ||
              !columnData[column].mcqTopic ||
              !columnData[column].difficulty)
          ) {
            report.success = false;
            report.data.push({
              row: Number(column) + 2,
              column: "a required",
              issue: "is missing",
            });
            columnData[column]["state"] = false;
          }
        } else {
          delete columnData[column];
        }
      });

      if (report.success) {
        let postArray = [];
        Object.keys(columnData).forEach((column) => {
          if (!columnData[column]["status"]) {
            columnData[column]["status"] = true;
          }
          columnData[column]["isMcq"] = true;
          postArray.push(columnData[column]);
        });
        setFileUploaded(postArray);
        console.log(postArray);
      } else {
        Modal.warning({
          title: "Errors in file",
          content: (
            <>
              <Text>
                <ol>
                  {report.data.map((item) => (
                    <li key={`${item.row}-${item.column}`}>
                      At <strong>row-{item.row}</strong>,{" "}
                      <strong>"{item.column}" column </strong> , {item.issue}
                    </li>
                  ))}
                </ol>
              </Text>
            </>
          ),
        });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const columns = [
    {
      title: "questionDescription",
      dataIndex: "questionDescription",
      key: "questionDescription",
    },
    {
      title: "image",
      dataIndex: "image",
      key: "image",
    },
    {
      title: "options",
      dataIndex: "options",
      key: "options",
    },
    {
      title: "correctOption",
      dataIndex: "correctOption",
      key: "correctOption",
    },
    {
      title: "subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "topic",
      dataIndex: "topic",
      key: "topic",
    },
    {
      title: "difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
    },
  ];

  const dataSource = [
    {
      questionDescription: "This is question description",
      image: "drive_link",
      options: "Option 1,Option 2,Option 3,Option 4",
      correctOption: "2",
      subject: "Subject Name",
      topic: "Topic Name",
      difficulty: "Easy",
    },
  ];

  return (
    <div className="MCQQUESTIONFORMEXCEL">
      {popup.state && (
        <Popup
          onClose={handlePopupClose}
          content={popup.message}
          type={popup.type}
        />
      )}
      <Text>
        Follow these instructions while preparing excel sheet for questions:
        <ol>
          <li>Make sure that the excel file size is less than 4MB</li>
          <li>
            If <strong>image</strong> is needed for a question then its better
            to upload the <strong>image in drive</strong> and place the{" "}
            <strong>drive url</strong> in excel and make sure to change the
            sharing to be anyone with link
          </li>
          <li>
            Make sure to name the columns properly,{" "}
            <a
              href="../../../../../public/MCQQuestionsTemplate.csv"
              download="MCQQuestionsTemplate.csv"
            >
              download
            </a>{" "}
            the template and use it
          </li>
          <li>
            Provide the subjects, topics, difficulty properly. Make sure that a
            particular topic is available in a subject. refer the below list of
            subjects and respective topics
          </li>
          <li>
            Mention the options by "," (comma) seperated as shown in below
            sample
          </li>
          <li>
            Make sure that <em>options</em> column is always before the{" "}
            <em>correctOption</em> column and similarly make sure that{" "}
            <em>subject</em> column is always before the <em>topic</em> column
          </li>
        </ol>
      </Text>
      <Collapse
        items={[
          {
            key: "1",
            label: "Subjects and Topics List",
            children: (
              <ol>
                {Object.keys(schema).map((subject) => (
                  <li key={subject}>
                    <em>{subject}</em> -&nbsp;
                    {Object.keys(schema[subject]).map((topic, index) => (
                      <Tag
                        key={index}
                        bordered={false}
                        style={{ marginBottom: 7 }}
                      >
                        {topic}
                      </Tag>
                    ))}
                  </li>
                ))}
              </ol>
            ),
          },
        ]}
      />
      <Text
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <h4>Excel Columns</h4>
        <a
          href="../../../../../public/MCQQuestionsTemplate.csv"
          download="MCQQuestionsTemplate.csv"
        >
          Download Template
        </a>
      </Text>
      <Table
        dataSource={dataSource}
        columns={columns}
        bordered
        pagination={false}
      />
      <Form
        form={form}
        name="validateOnly"
        layout="vertical"
        autoComplete="off"
        className="adminForms"
      >
        <Text>
          <p>
            <span style={{ color: "red", fontSize: "18px" }}>*</span> Upload
            Excel File
          </p>
        </Text>
        <span className="AllInputs">
          <Upload
            accept=".xls, .xlsx, .csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel.sheet.macroEnabled.12"
            maxCount={1}
            listType="picture"
            style={{ width: "150px" }}
            onRemove={handleRemove}
            customRequest={({ file, onSuccess, onError }) => {
              // Check file size
              if (file.size > 4000000) {
                // Show error and apply red border
                message.error("Image size should be less than 4MB");
                onError("Image size should be less than 4MB");
                return;
              }

              const allowedTypes = [
                ".xls",
                ".xlsx",
                "text/csv",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-excel.sheet.macroEnabled.12",
                // Add more image formats as needed
              ];

              if (!allowedTypes.includes(file.type)) {
                // Show error and apply red border
                message.error(
                  "Invalid file type. Please upload a supported Excel format."
                );
                onError(
                  "Invalid file type. Please upload a supported Excel format."
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
            {!fileUploaded.length && (
              <Button icon={<UploadOutlined />}>Upload</Button>
            )}
          </Upload>
        </span>
        <br />
        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!fileUploaded.length}
              onClick={handleFormSubmit}
            >
              Submit
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MCQAddFormExcel;
