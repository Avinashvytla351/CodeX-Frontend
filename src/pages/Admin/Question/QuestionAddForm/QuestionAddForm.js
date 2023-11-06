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
import "./QuestionAddForm.css";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import TextEditor from "../../../../components/textEditor/TextEditor";

const { TextArea } = Input;

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

const QuestionAddForm = ({ topics, companies, route, defaultValues }) => {
  const token = Cookies.get("token");
  const [form] = Form.useForm();
  const [popup, setPopup] = useState({
    state: false,
    type: false,
    message: "",
  });

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
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
      })
      .catch((error) => {
        setPopup({
          state: true,
          type: false,
          message: "Failed to send the question data",
        });
      });
  };

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

  const handlePopupClose = () => {
    setPopup({
      ...popup,
      state: false,
    });
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
          <Form.Item
            name="questionInputText"
            label="Question Input"
            rules={[
              {
                required: true,
              },
            ]}
            className="large"
          >
            <TextArea placeholder="Question Input" />
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
            className="large"
          >
            <TextArea placeholder="Question Output" />
          </Form.Item>
        </span>
        <span className="AllInputs">
          <Form.Item
            name="questionExampleInput1"
            label="Example Input 1"
            rules={[
              {
                required: true,
              },
            ]}
            className="small"
          >
            <TextArea placeholder="Example Input 1" />
          </Form.Item>

          <Form.Item
            name="questionExampleOutput1"
            label="Example Output 1"
            rules={[
              {
                required: true,
              },
            ]}
            className="small"
          >
            <TextArea placeholder="Example Output 1" />
          </Form.Item>
        </span>

        <span className="AllInputs">
          <Form.Item
            name="questionExampleInput2"
            label="Example Input 2"
            rules={[
              {
                required: true,
              },
            ]}
            className="small"
          >
            <TextArea placeholder="Example Input 2" />
          </Form.Item>

          <Form.Item
            name="questionExampleOutput2"
            label="Example Output 2"
            rules={[
              {
                required: true,
              },
            ]}
            className="small"
          >
            <TextArea placeholder="Example Output 2" />
          </Form.Item>
        </span>

        <span className="AllInputs">
          <Form.Item
            name="questionExampleInput3"
            label="Example Input 3"
            rules={[
              {
                required: true,
              },
            ]}
            className="small"
          >
            <TextArea placeholder="Example Input 3" />
          </Form.Item>

          <Form.Item
            name="questionExampleOutput3"
            label="Example Output 3"
            rules={[
              {
                required: true,
              },
            ]}
            className="small"
          >
            <TextArea placeholder="Example Output 3" />
          </Form.Item>
        </span>

        <span className="AllInputs">
          <Form.Item
            name="questionHiddenInput1"
            label="Hidden Input 1"
            rules={[
              {
                required: true,
              },
            ]}
            className="small"
          >
            <TextArea placeholder="Hidden Input 1" />
          </Form.Item>

          <Form.Item
            name="questionHiddenOutput1"
            label="Hidden Output 1"
            rules={[
              {
                required: true,
              },
            ]}
            className="small"
          >
            <TextArea placeholder="Hidden Output 1" />
          </Form.Item>
        </span>

        <span className="AllInputs">
          <Form.Item
            name="questionHiddenInput2"
            label="Hidden Input 2"
            rules={[
              {
                required: true,
              },
            ]}
            className="small"
          >
            <TextArea placeholder="Hidden Input 2" />
          </Form.Item>

          <Form.Item
            name="questionHiddenOutput2"
            label="Hidden Output 2"
            rules={[
              {
                required: true,
              },
            ]}
            className="small"
          >
            <TextArea placeholder="Hidden Output 2" />
          </Form.Item>
        </span>

        <span className="AllInputs">
          <Form.Item
            name="questionHiddenInput3"
            label="Hidden Input 3"
            rules={[
              {
                required: true,
              },
            ]}
            className="small"
          >
            <TextArea placeholder="Hidden Input 3" />
          </Form.Item>

          <Form.Item
            name="questionHiddenOutput3"
            label="Hidden Output 3"
            rules={[
              {
                required: true,
              },
            ]}
            className="small"
          >
            <TextArea placeholder="Hidden Output 3" />
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
            className="large"
          >
            <TextArea placeholder="Explaination" />
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

        <span className="AllInputs">
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
          <Form.Item
            name="editorial"
            label="Editorial"
            rules={[
              {
                required: false,
              },
            ]}
            className="vsmall"
          >
            <Input placeholder="Editorial" />
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

export default QuestionAddForm;
