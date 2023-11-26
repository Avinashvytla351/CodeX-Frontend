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
  DatePicker,
  TimePicker,
  InputNumber,
  Card,
  Checkbox,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "../../../AdminForms.css";

import Popup from "../../../../../components/popUp/Popup";

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

const TypeMCQContestAdd = ({ defaultValues, schema, route }) => {
  const token = Cookies.get("token");
  const [form] = Form.useForm();
  const [popup, setPopup] = useState({
    state: false,
    type: false,
    message: "",
  });
  const [visibility, setVisibility] = useState(true);

  const handlePopupClose = () => {
    setPopup({
      ...popup,
      state: false,
    });
  };

  const handleCheckboxChange = (e) => {
    setVisibility(e.target.checked); // Update the visibility state when the checkbox is changed
  };

  function convertISOTo24HourTime(isoString) {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return hours + minutes;
  }

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        let postFlag = true;
        let postEMessage = "";
        console.log(values);
        values.visibility = visibility;
        values.contestDate = values.contestDate.toISOString().split("T")[0];
        values.contestStartTime = convertISOTo24HourTime(
          values.contestStartTime.toString()
        );
        values.contestEndTime = convertISOTo24HourTime(
          values.contestEndTime.toString()
        );
        let difficultyDistribution = {};
        if (!values.questions || !values.questions.length) {
          postFlag = false;
          postEMessage = "No Questions Set";
        } else {
          values.questions.forEach((item) => {
            if (!schema[item.mcqSubject]) {
              postFlag = false;
              postEMessage =
                "No subject available with name " + item.mcqSubject;
            }
            if (!difficultyDistribution[item.mcqSubject]) {
              difficultyDistribution[item.mcqSubject] = {};
            }
            if (!item.topics || !item.topics.length) {
              postFlag = false;
              postEMessage =
                "No topics set for " + item.mcqSubject + " subject";
              return;
            }
            item.topics.forEach((topic) => {
              if (!schema[item.mcqSubject][topic.mcqTopic]) {
                postFlag = false;
                postEMessage = "No topic available with name" + topic.mcqTopic;
                return;
              }
              if (!difficultyDistribution[item.mcqSubject][topic.mcqTopic]) {
                difficultyDistribution[item.mcqSubject][topic.mcqTopic] = [
                  0, 0, 0,
                ];
              }
              if (schema[item.mcqSubject][topic.mcqTopic][0] >= topic.easy) {
                difficultyDistribution[item.mcqSubject][topic.mcqTopic][0] =
                  topic.easy;
              } else {
                postFlag = false;
                postEMessage =
                  "In subject " +
                  item.mcqSubject +
                  ", in topic " +
                  topic.mcqTopic +
                  ", easy questions count is greater than available questions";
                return;
              }
              if (schema[item.mcqSubject][topic.mcqTopic][1] >= topic.medium) {
                difficultyDistribution[item.mcqSubject][topic.mcqTopic][1] =
                  topic.medium;
              } else {
                postFlag = false;
                postEMessage =
                  "In subject " +
                  item.mcqSubject +
                  ", in topic " +
                  topic.mcqTopic +
                  ", medium questions count is greater than available questions";
                return;
              }
              if (schema[item.mcqSubject][topic.mcqTopic][2] >= topic.hard) {
                difficultyDistribution[item.mcqSubject][topic.mcqTopic][2] =
                  topic.hard;
              } else {
                postFlag = false;
                postEMessage =
                  "In subject " +
                  item.mcqSubject +
                  ", in topic " +
                  topic.mcqTopic +
                  ", hard questions count is greater than available questions";
                return;
              }
            });
          });
        }
        values.difficultyDistribution = difficultyDistribution;
        values.isMcqContest = true;
        if (postFlag) {
          try {
            var contestReponse = null;
            if (defaultValues) {
              contestReponse = await axios.put(
                route, // pass the route
                values, // set form values
                {
                  headers: {
                    authorization: token, // Replace with the actual token source
                  },
                }
              );
            } else {
              contestReponse = await axios.post(
                route, // pass the route
                values, // set form values
                {
                  headers: {
                    authorization: token, // Replace with the actual token source
                  },
                }
              );
            }
            if (contestReponse) {
              setPopup({
                state: true,
                type: true,
                message: "Contest data submitted sucessfully",
              });
            } else {
              setPopup({
                state: true,
                type: false,
                message: "Cannot update contest data",
              });
            }
          } catch (error) {
            let message = "Cannot update contest data";
            if (error.response && error.response.data.message) {
              message = error.response.data.message;
            }
            setPopup({
              state: true,
              type: false,
              message: message,
            });
          }
        } else {
          setPopup({
            state: true,
            type: false,
            message: postEMessage,
          });
        }
      })
      .catch((errorInfo) => {
        // Form validation errors, you can display the error messages here
        setPopup({
          state: true,
          type: false,
          message: "Failed to send the contest data",
        });
      });
  };

  const subjectOptions = [];
  const topicOptions = {};
  const difficultyOptions = [
    { label: "Easy", value: "Easy" },
    { label: "Medium", value: "Medium" },
    { label: "Hard", value: "Hard" },
  ];
  const topicSchema = {};
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
      topicSchema[topic] = schema[subject][topic];
    });
    topicOptions[subject] = topicArr;
  });

  const [questionLists, setQuestionLists] = useState(
    defaultValues ? Array(defaultValues.sets.length).fill(null) : []
  );

  const handleAddQuestionList = () => {
    setQuestionLists([...questionLists, null]);
  };

  const handleRemoveQuestionList = (index) => {
    const updatedLists = [...questionLists];
    updatedLists.splice(index, 1);
    setQuestionLists(updatedLists);
  };
  return (
    <div className="TYPEMCQCONTESTADD">
      {popup.state && (
        <Popup
          onClose={handlePopupClose}
          content={popup.message}
          type={popup.type}
        />
      )}
      <Form
        form={form}
        name="dynamic_form_complex"
        layout="vertical"
        autoComplete="off"
        className="adminForms"
      >
        <span className="AllInputs">
          <Form.Item
            name="contestName"
            label="Contest Name"
            rules={[
              {
                required: true,
              },
            ]}
            className="vsmall"
          >
            <Input placeholder="Contest Name" />
          </Form.Item>
          <Form.Item
            name="contestPassword"
            label="Contest Password"
            rules={[
              {
                required: false,
              },
            ]}
            className="vsmall"
          >
            <Input placeholder="Contest Password" />
          </Form.Item>
        </span>
        <span className="AllInputs">
          <Form.Item
            name="contestDate"
            label="Contest Date"
            rules={[
              {
                required: true,
              },
            ]}
            className="vvsmall"
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="contestStartTime"
            label="Contest Start Time"
            rules={[
              {
                required: true,
              },
            ]}
            className="vvsmall"
          >
            <TimePicker format={"HH:mm"} />
          </Form.Item>
          <Form.Item
            name="contestEndTime"
            label="Contest End Time"
            rules={[
              {
                required: true,
              },
            ]}
            className="vvsmall"
          >
            <TimePicker format={"HH:mm"} />
          </Form.Item>
          <Form.Item
            name="contestDuration"
            label="Contest Duration"
            rules={[
              {
                required: true,
              },
            ]}
            className="vvsmall vvheight"
          >
            <InputNumber
              style={{ width: 200 }}
              placeholder="Contest Duration"
            />
          </Form.Item>
        </span>

        <Form.List name="questions">
          {(fields, { add, remove }) => (
            <span className="AllInputs">
              {fields.map((field) => (
                <Card
                  className="medium"
                  size="small"
                  title={`Subject ${field.name + 1}`}
                  key={field.key}
                  extra={
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  }
                  style={{ marginBottom: 15 }}
                >
                  <Form.Item
                    label="Select Subject"
                    name={[field.name, "mcqSubject"]}
                    className="medium"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      options={subjectOptions}
                      placeholder="Please select"
                      style={{ height: 36 }}
                      onChange={(value) => {
                        form.setFieldsValue({
                          [field.name]: {
                            mcqSubject: value,
                            topics: [], // Clear the topics when subject changes
                          },
                        });
                        const updatedValues = [
                          ...form.getFieldValue("questions"),
                        ];
                        updatedValues[field.name].mcqSubject = value;
                        updatedValues[field.name].topics = []; // Clear the topics when subject changes
                        form.setFieldsValue({ questions: updatedValues });
                      }}
                    />
                  </Form.Item>

                  {/* Nest Form.List */}
                  <Form.Item label="Topics">
                    <Form.List name={[field.name, "topics"]}>
                      {(subFields, subOpt) => (
                        <span className="AllInputs">
                          {subFields.map((subField) => (
                            <span
                              className="AllInputs"
                              style={{
                                width: "fit-content",
                              }}
                              key={subField.key}
                            >
                              <Form.Item
                                label="Select Topic"
                                name={[subField.name, "mcqTopic"]}
                                className="vvsmall"
                                style={{ margin: "5px 0" }}
                                rules={[
                                  {
                                    required: true,
                                  },
                                ]}
                              >
                                <Select
                                  options={
                                    topicOptions[
                                      form.getFieldValue([
                                        field.name,
                                        "mcqSubject",
                                      ])
                                    ]
                                  }
                                  style={{ height: 36, width: 230 }}
                                  disabled={
                                    form.getFieldValue([
                                      field.name,
                                      "mcqSubject",
                                    ])
                                      ? false
                                      : true
                                  }
                                  placeholder="Please select"
                                  onChange={(value) => {
                                    form.setFieldsValue({
                                      [subField.name]: {
                                        mcqTopic: value,
                                        easy: 0,
                                      },
                                    });
                                  }}
                                />
                              </Form.Item>
                              <Form.Item
                                label={`Easy (Max ${
                                  topicSchema[
                                    form.getFieldValue([
                                      "questions",
                                      field.name,
                                      "topics",
                                      subField.name,
                                      "mcqTopic",
                                    ])
                                  ]
                                    ? topicSchema[
                                        form.getFieldValue([
                                          "questions",
                                          field.name,
                                          "topics",
                                          subField.name,
                                          "mcqTopic",
                                        ])
                                      ][0]
                                    : 0
                                })`}
                                name={[subField.name, "easy"]}
                                className="vvsmall"
                                style={{ margin: "5px 0" }}
                                rules={[
                                  {
                                    required: true,
                                  },
                                ]}
                              >
                                <InputNumber
                                  placeholder="Easy Count"
                                  disabled={
                                    form.getFieldValue([
                                      "questions",
                                      field.name,
                                      "topics",
                                      subField.name,
                                      "mcqTopic",
                                    ])
                                      ? false
                                      : true
                                  }
                                  max={
                                    form.getFieldValue([
                                      "questions",
                                      field.name,
                                      "topics",
                                      subField.name,
                                      "mcqTopic",
                                    ])
                                      ? topicSchema[
                                          form.getFieldValue([
                                            "questions",
                                            field.name,
                                            "topics",
                                            subField.name,
                                            "mcqTopic",
                                          ])
                                        ][0]
                                      : 0
                                  }
                                  min={0}
                                  style={{ height: 36, width: 230 }}
                                />
                              </Form.Item>
                              <Form.Item
                                label={`Medium (Max ${
                                  topicSchema[
                                    form.getFieldValue([
                                      "questions",
                                      field.name,
                                      "topics",
                                      subField.name,
                                      "mcqTopic",
                                    ])
                                  ]
                                    ? topicSchema[
                                        form.getFieldValue([
                                          "questions",
                                          field.name,
                                          "topics",
                                          subField.name,
                                          "mcqTopic",
                                        ])
                                      ][1]
                                    : 0
                                })`}
                                name={[subField.name, "medium"]}
                                className="vvsmall"
                                style={{ margin: "5px 0" }}
                                rules={[
                                  {
                                    required: true,
                                  },
                                ]}
                              >
                                <InputNumber
                                  placeholder="Medium Count"
                                  disabled={
                                    form.getFieldValue([
                                      "questions",
                                      field.name,
                                      "topics",
                                      subField.name,
                                      "mcqTopic",
                                    ])
                                      ? false
                                      : true
                                  }
                                  max={
                                    form.getFieldValue([
                                      "questions",
                                      field.name,
                                      "topics",
                                      subField.name,
                                      "mcqTopic",
                                    ])
                                      ? topicSchema[
                                          form.getFieldValue([
                                            "questions",
                                            field.name,
                                            "topics",
                                            subField.name,
                                            "mcqTopic",
                                          ])
                                        ][1]
                                      : 0
                                  }
                                  min={0}
                                  style={{ height: 36, width: 230 }}
                                />
                              </Form.Item>
                              <Form.Item
                                label={`Hard (Max ${
                                  topicSchema[
                                    form.getFieldValue([
                                      "questions",
                                      field.name,
                                      "topics",
                                      subField.name,
                                      "mcqTopic",
                                    ])
                                  ]
                                    ? topicSchema[
                                        form.getFieldValue([
                                          "questions",
                                          field.name,
                                          "topics",
                                          subField.name,
                                          "mcqTopic",
                                        ])
                                      ][2]
                                    : 0
                                })`}
                                name={[subField.name, "hard"]}
                                className="vvsmall"
                                style={{ margin: "5px 0" }}
                                rules={[
                                  {
                                    required: true,
                                  },
                                ]}
                              >
                                <InputNumber
                                  placeholder="Hard Count"
                                  disabled={
                                    form.getFieldValue([
                                      "questions",
                                      field.name,
                                      "topics",
                                      subField.name,
                                      "mcqTopic",
                                    ])
                                      ? false
                                      : true
                                  }
                                  max={
                                    form.getFieldValue([
                                      "questions",
                                      field.name,
                                      "topics",
                                      subField.name,
                                      "mcqTopic",
                                    ])
                                      ? topicSchema[
                                          form.getFieldValue([
                                            "questions",
                                            field.name,
                                            "topics",
                                            subField.name,
                                            "mcqTopic",
                                          ])
                                        ][2]
                                      : 0
                                  }
                                  min={0}
                                  style={{ height: 36, width: 230 }}
                                />
                              </Form.Item>
                              <CloseOutlined
                                onClick={() => {
                                  subOpt.remove(subField.name);
                                }}
                                style={{ marginTop: 30 }}
                              />
                            </span>
                          ))}
                          <span className="blocked">
                            <Button onClick={() => subOpt.add()}>
                              + Add Topic
                            </Button>
                          </span>
                        </span>
                      )}
                    </Form.List>
                  </Form.Item>
                </Card>
              ))}
              <span className="blocked">
                <Button onClick={() => add()}>+ Add Subject</Button>
              </span>
            </span>
          )}
        </Form.List>

        <span className="AllInputs">
          <Checkbox
            defaultChecked={defaultValues ? defaultValues.visibility : true}
            onChange={handleCheckboxChange}
          >
            Visibility
          </Checkbox>
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

export default TypeMCQContestAdd;
