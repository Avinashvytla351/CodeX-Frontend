import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Popup from "../../../../components/popUp/Popup";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Space,
  DatePicker,
  TimePicker,
  InputNumber,
  Select,
} from "antd";
import "../../AdminForms.css";
import "./TypeContestAdd.css";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import moment from "moment";

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

const TypeContestAdd = ({ questions, route, manual, defaultValues }) => {
  const token = Cookies.get("token");
  const [form] = Form.useForm();
  const [visibility, setVisibility] = useState(true); // Initialize the visibility state
  const [popup, setPopup] = useState({
    state: false,
    type: false,
    message: "",
  });

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
        values.visibility = visibility;
        values.contestDate = values.contestDate.toISOString().split("T")[0];
        values.contestStartTime = convertISOTo24HourTime(
          values.contestStartTime.toString()
        );
        values.contestEndTime = convertISOTo24HourTime(
          values.contestEndTime.toString()
        );
        let sets = [];
        for (let keys in values) {
          if (keys.includes("set")) {
            sets.push(values[keys]);
          }
        }
        values.isMultipleSet = !manual;
        values.sets = !manual ? sets : [];
        values.isManual = manual;
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
  const options = [];
  questions.forEach((question) => {
    options.push({
      label: question.questionId,
      value: question.questionId,
    });
  });

  const handlePopupClose = () => {
    setPopup({
      ...popup,
      state: false,
    });
  };

  const [questionLists, setQuestionLists] = useState(
    !manual && defaultValues ? Array(defaultValues.sets.length).fill(null) : []
  );

  const handleAddQuestionList = () => {
    setQuestionLists([...questionLists, null]);
  };

  const handleRemoveQuestionList = (index) => {
    const updatedLists = [...questionLists];
    updatedLists.splice(index, 1);
    setQuestionLists(updatedLists);
  };

  var initValues = {};
  if (defaultValues) {
    initValues = {
      contestName: defaultValues.contestName,
      contestPassword: defaultValues.contestPassword,
      contestDate: moment(defaultValues.contestDate, "YYYY-MM-DD"),
      contestStartTime: moment(
        defaultValues.contestStartTime.slice(0, 2) +
          ":" +
          defaultValues.contestStartTime.slice(2, 4),
        "HH:mm"
      ),
      contestEndTime: moment(
        defaultValues.contestEndTime.slice(0, 2) +
          ":" +
          defaultValues.contestEndTime.slice(2, 4),
        "HH:mm"
      ),
      contestDuration: defaultValues.contestDuration,
    };
    const optionLabels = new Set(options.map((option) => option.label));
    if (manual) {
      defaultValues.questionsList = defaultValues.questionsList.filter((id) =>
        optionLabels.has(id)
      );
      initValues["questionsList"] = defaultValues.questionsList;
    } else {
      const updatedSets = [];

      defaultValues.sets.forEach((set, index) => {
        // Filter the elements in the set
        const filteredSet = set.filter((id) => optionLabels.has(id));
        updatedSets.push(filteredSet);
        initValues[`set${index}`] = filteredSet;
      });

      // Update defaultValues.sets with the filtered sets
      defaultValues.sets = updatedSets;
    }
  }

  return (
    <div className="TYPECONTEST">
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
        initialValues={initValues}
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
        <span className="AllInputs" style={{ flexDirection: "column" }}>
          {manual ? ( //Check if it is manual contest set the list
            <Form.Item
              name="questionsList"
              label="Select Questions"
              rules={[
                {
                  required: true,
                },
              ]}
              className="medium"
            >
              <Select
                mode="multiple"
                allowClear
                placeholder="Please select"
                options={options}
              />
            </Form.Item>
          ) : (
            questionLists.map((_, index) => (
              <Space
                key={index}
                style={{ display: "flex", marginBottom: 8, width: "100%" }}
              >
                <Form.Item
                  name={`set${index}`}
                  label={`Select Questions for set - ${index + 1}`}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  style={{ width: "100%", flexGrow: 1 }}
                  className="medium"
                >
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="Please select"
                    options={options}
                    style={{ width: "100%", flexGrow: 1 }}
                  />
                </Form.Item>
                <Button onClick={() => handleRemoveQuestionList(index)}>
                  <MinusCircleOutlined />
                </Button>
              </Space>
            ))
          )}
          {!manual && (
            <Button onClick={handleAddQuestionList} id="set-btn">
              Add Set
              <PlusCircleOutlined />
            </Button>
          )}
        </span>
        <span className="AllInputs">
          <Checkbox
            defaultChecked={defaultValues ? defaultValues.visibility : true}
            onChange={handleCheckboxChange}
          >
            Visibility
          </Checkbox>
        </span>
        <br />
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

export default TypeContestAdd;
