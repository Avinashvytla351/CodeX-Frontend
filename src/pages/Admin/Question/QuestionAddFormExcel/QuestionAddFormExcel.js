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
import "./QuestionAddFormExcel.css";
import { read, utils } from "xlsx";

const { Text } = Typography;

const QuestionAddFormExcel = ({
  topics,
  companies,
  route,
  subjects,
  chapters,
}) => {
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

  const handleRemove = () => {
    // Reset the file upload status when the file is removed
    setFileUploaded([]);
  };

  var report = { success: true, data: [] };

  const chapterOptions = {};
  chapters.forEach((chapter) => {
    try {
      chapterOptions[chapter.Subject_Id].push(chapter.Chapter_Name);
    } catch (err) {
      chapterOptions[chapter.Subject_Id] = [chapter.Chapter_Name];
    }
  });

  const subjectOptions = [];
  subjects.forEach((subject) => {
    try {
      if (chapterOptions[subject.Subject_Id]) {
        subjectOptions.push({
          label: subject.Subject_Name,
          value: subject.Subject_Id,
        });
      }
    } catch (err) {}
  });

  const columns = [
    {
      title: "subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "chapter",
      dataIndex: "chapter",
      key: "chapter",
    },
    {
      title: "questionName",
      dataIndex: "questionName",
      key: "questionName",
    },
    {
      title: "author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "questionDescriptionText",
      dataIndex: "questionDescriptionText",
      key: "questionDescriptionText",
    },
    {
      title: "descriptionImage",
      dataIndex: "descriptionImage",
      key: "descriptionImage",
    },
    {
      title: "difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
    },
    {
      title: "questionInputText",
      dataIndex: "questionInputText",
      key: "questionInputText",
    },
    {
      title: "questionOutputText",
      dataIndex: "questionOutputText",
      key: "questionOutputText",
    },
    {
      title: "explaination",
      dataIndex: "explaination",
      key: "explaination",
    },
    {
      title: "topic",
      dataIndex: "topic",
      key: "topic",
    },
    {
      title: "company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "language",
      dataIndex: "language",
      key: "language",
    },
    {
      title: "exampleTestCaseInput1",
      dataIndex: "exampleTestCaseInput1",
      key: "exampleTestCaseInput1",
    },
    {
      title: "exampleTestCaseOutput1",
      dataIndex: "exampleTestCaseOutput1",
      key: "exampleTestCaseOutput1",
    },
    {
      title: "exampleTestCaseInput2",
      dataIndex: "exampleTestCaseInput2",
      key: "exampleTestCaseInput2",
    },
    {
      title: "exampleTestCaseOutput2",
      dataIndex: "exampleTestCaseOutput2",
      key: "exampleTestCaseOutput2",
    },
    {
      title: "exampleTestCaseInput3",
      dataIndex: "exampleTestCaseInput3",
      key: "exampleTestCaseInput3",
    },
    {
      title: "exampleTestCaseOutput3",
      dataIndex: "exampleTestCaseOutput3",
      key: "exampleTestCaseOutput3",
    },
    {
      title: "exampleTestCaseInput4",
      dataIndex: "exampleTestCaseInput4",
      key: "exampleTestCaseInput4",
    },
    {
      title: "exampleTestCaseOutput4",
      dataIndex: "exampleTestCaseOutput4",
      key: "exampleTestCaseOutput4",
    },
    {
      title: "exampleTestCaseOutput1",
      dataIndex: "exampleTestCaseOutput1",
      key: "exampleTestCaseOutput1",
    },
    {
      title: "",
      dataIndex: "hiddenTestCaseInput1",
      key: "hiddenTestCaseInput1",
    },
    {
      title: "",
      dataIndex: "hiddenTestCaseOutput1",
      key: "hiddenTestCaseOutput1",
    },
    {
      title: "",
      dataIndex: "weightage1",
      key: "weightage1",
    },
    {
      title: "...",
      dataIndex: "next",
      key: "next",
    },
  ];

  const dataSource = [
    {
      subject: "Subject Name",
      chapter: "Chapter Name",
      questionName: "Question Name",
      author: "Author Name",
      questionDescriptionText: "This is question description",
      descriptionImage: "drive_link",
      difficulty: "Easy/Medium/Hard",
      questionInputText: "Input Format",
      questionOutputText: "Output Format",
      explaination: "Explaination",
      topic: "Topic Name",
      company: "Company Name",
      code: "Correct code",
      language: "Language of Correct Code",
      exampleTestCaseInput1: "Sample Input 1",
      exampleTestCaseOutput1: "Sample Output 1",
      exampleTestCaseInput2: "Sample Input 2",
      exampleTestCaseOutput2: "Sample Output 2",
      exampleTestCaseInput3: "Sample Input 3",
      exampleTestCaseOutput3: "Sample Output 3",
      exampleTestCaseInput4: "Sample Input 4",
      exampleTestCaseOutput4: "Sample Output 4",
      hiddenTestCaseInput1: "Hidden Input 1",
      hiddenTestCaseOutput1: "Hidden Output 1",
      weightage1: "50% (Weightage)",
      next: "More Hidden Testcases...",
    },
  ];

  const handleFileUpload = () => {};

  const handleFormSubmit = () => {};
  return (
    <div className="QUESTIONFORMEXCEL">
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
            Provide the subjects, chapters, topics, companies, difficulty
            properly.
          </li>
          <li>
            Make sure that a particular chapter is available in a subject. refer
            the below list of subjects and respective chapter
          </li>
          <li>In Excel, limit example test cases to a maximum of four.</li>
          <li>
            When <strong>adding hidden test cases</strong>, ensure to maintain
            the
            <em> order of input output and weightage</em> in Excel. Each test
            case should be structured as follows:
          </li>
          <li>
            For each hidden test cases, include input, output, and weightage in
            adjacent columns without any column headings, as number of testcases
            in each question vary dynamically.
          </li>
          <li>
            <strong>
              Ensure each hidden test case is appropriately paired with its
              input, output, and weightage details{" "}
              <em>mention weightage with "%" symbol</em>
            </strong>{" "}
          </li>
        </ol>
      </Text>
      <Collapse
        items={[
          {
            key: "1",
            label: "Subjects and Chapters List",
            children: (
              <ol>
                {subjectOptions.map((subject) => (
                  <li key={subject.value}>
                    <em>{subject.label}</em> -&nbsp;
                    {chapterOptions[subject.value].map((chapter, index) => (
                      <Tag
                        key={index + subject.value}
                        bordered={false}
                        style={{ marginBottom: 7 }}
                      >
                        {chapter}
                      </Tag>
                    ))}
                  </li>
                ))}
              </ol>
            ),
          },
        ]}
      />

      <Collapse
        style={{ marginTop: 20 }}
        items={[
          {
            key: "1",
            label: "Topics and Companies List",
            children: (
              <ol>
                <li>
                  <em>Topics</em> -&nbsp;
                  {topics.map((topic, index) => (
                    <Tag
                      key={index + "topics"}
                      bordered={false}
                      style={{ marginBottom: 7 }}
                    >
                      {topic}
                    </Tag>
                  ))}
                </li>
                <li style={{ marginTop: 20 }}>
                  <em>Companies</em> -&nbsp;
                  {topics.map((company, index) => (
                    <Tag
                      key={index + "company"}
                      bordered={false}
                      style={{ marginBottom: 7 }}
                    >
                      {company}
                    </Tag>
                  ))}
                </li>
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
        <h4 style={{ marginLeft: "10px" }}>Excel Columns</h4>
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
        scroll={{
          x: "420vw",
        }}
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

export default QuestionAddFormExcel;
