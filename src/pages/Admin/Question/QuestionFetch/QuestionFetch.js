import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Popup from "../../../../components/popUp/Popup";
import { Button, Form, Select, Space } from "antd";
import "../../AdminForms.css";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../components/loading/Loading";
import "./QuestionFetch.css";

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
        () => {
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

const filterOption = (input, option) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const QuestionFetch = ({
  serverRoute,
  onQuestionFetch,
  deleteList,
  multiple,
}) => {
  deleteList = deleteList ? deleteList : [];
  const navigate = useNavigate();

  const token = Cookies.get("token");
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [popup, setPopup] = useState({
    state: false,
    type: false,
    message: "",
  });

  const fetchQuestions = async () => {
    try {
      const questionResponse = await axios.get(
        serverRoute + "/questions/coding",
        {
          headers: {
            authorization: token, // Replace with the actual token source
          },
        }
      );
      if (questionResponse.data.success) {
        setQuestions(questionResponse.data.data);
        let option = [];
        questionResponse.data.data.forEach((question, index) => {
          option.push({
            label: question.questionId + " - " + question.questionName,
            value: index,
          });
        });
        setOptions(option);
      } else {
        navigate("/message", {
          state: { type: false, message: "Failed to fetch questions" },
        });
      }
      setLoading(false);
    } catch (error) {
      navigate("/message", {
        state: { type: false, message: "Failed to fetch questions" },
      });
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (deleteList) {
      let tempOptions = [];
      const optionLabels = options.map((option) => option.label);
      optionLabels.forEach((option, index) => {
        if (!deleteList.includes(option)) {
          tempOptions.push(options[index]);
        }
      });
      setOptions(tempOptions);
    }
  }, [deleteList.length]);

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (multiple) {
          let resQuestionArray = [];
          values.questionId.forEach((id) => {
            resQuestionArray.push(questions[id]);
          });
          onQuestionFetch(resQuestionArray);
        } else {
          onQuestionFetch(questions[values.questionId]);
        }
        form.resetFields();
      })
      .catch((error) => {
        setPopup({
          state: true,
          type: false,
          message: "Failed to fetch question data",
        });
      });
  };

  const handlePopupClose = () => {
    setPopup({
      ...popup,
      state: false,
    });
  };

  return (
    <div className="QUESTIONFETCH">
      {popup.state && (
        <Popup
          onClose={handlePopupClose}
          content={popup.message}
          type={popup.type}
        />
      )}
      {!loading && questions.length ? (
        <Form
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
          className="adminForms"
        >
          <span className="AllInputs">
            <Form.Item
              name="questionId"
              label="Question Id"
              rules={[
                {
                  required: true,
                },
              ]}
              className="medium"
            >
              <Select
                mode={multiple ? "multiple" : undefined}
                placeholder="Please select"
                options={options}
                showSearch
                filterOption={filterOption}
              />
            </Form.Item>
          </span>
          <Form.Item className="sub-btn">
            <Space>
              <SubmitButton form={form} onClicked={handleFormSubmit} />
              <Button htmlType="reset">Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default QuestionFetch;
