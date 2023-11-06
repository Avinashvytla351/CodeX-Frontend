import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Popup from "../../../../components/popUp/Popup";
import { Button, Form, Select, Space } from "antd";
import "../../AdminForms.css";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../components/loading/Loading";
import "./ContestFetch.css";

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

const ContestFetch = ({ serverRoute, onContestFetch, deleteList }) => {
  deleteList = deleteList ? deleteList : [];
  const navigate = useNavigate();

  const token = Cookies.get("token");
  const [form] = Form.useForm();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [popup, setPopup] = useState({
    state: false,
    type: false,
    message: "",
  });

  const fetchContests = async () => {
    try {
      const contestsResponse = await axios.get(serverRoute + "/contests", {
        headers: {
          authorization: token, // Replace with the actual token source
        },
      });
      if (contestsResponse.data.success) {
        setContests(contestsResponse.data.data);
        let option = [];
        contestsResponse.data.data.forEach((contest, index) => {
          option.push({
            label: contest.contestId + " - " + contest.contestName,
            value: index,
          });
        });
        setOptions(option);
      } else {
        navigate("/message", {
          state: { type: false, message: "Failed to Fetch contests" },
        });
      }
      setLoading(false);
    } catch (error) {
      navigate("/message", {
        state: { type: false, message: "Failed to Fetch contests" },
      });
    }
  };

  useEffect(() => {
    fetchContests();
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
        onContestFetch(contests[values.contestId]);
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
    <div className="CONTESTFETCH">
      {popup.state && (
        <Popup
          onClose={handlePopupClose}
          content={popup.message}
          type={popup.type}
        />
      )}
      {!loading && contests.length ? (
        <Form
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
          className="adminForms"
        >
          <span className="AllInputs">
            <Form.Item
              name="contestId"
              label="Contest Id"
              rules={[
                {
                  required: true,
                },
              ]}
              className="vsmall"
            >
              <Select
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

export default ContestFetch;
