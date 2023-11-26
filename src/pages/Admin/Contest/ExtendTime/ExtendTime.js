import React, { useEffect, useState } from "react";
import AdminLayout from "../../../../components/layout/adminLayout/AdminLayout";
import axios from "axios";
import Cookies from "js-cookie";
import Popup from "../../../../components/popUp/Popup";
import { Button, Form, Input, Space, InputNumber, Select } from "antd";
import "../../AdminForms.css";
import Loading from "../../../../components/loading/Loading";
import { useNavigate } from "react-router-dom";

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

const filterOption = (input, option) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const ExtendTime = ({ serverRoute, clientRoute }) => {
  useEffect(() => {
    document.title = "Extend User Time | KLHCode";
  }, []);
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const [form] = Form.useForm();
  const [popup, setPopup] = useState({
    state: false,
    type: false,
    message: "",
  });
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState([]);

  const fetchContests = async () => {
    try {
      const contestsResponse = await axios.get(
        serverRoute + "/contests/coding",
        {
          headers: {
            authorization: token, // Replace with the actual token source
          },
        }
      );
      if (contestsResponse.data.success) {
        let option = [];
        contestsResponse.data.data.forEach((contest, index) => {
          option.push({
            label: contest.contestId + " - " + contest.contestName,
            value: contest.contestId,
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
        console.log(values);
        try {
          const updateResponse = await axios.post(
            serverRoute + "/changeValidTime",
            values,
            {
              headers: {
                authorization: token, // Replace with the actual token source
              },
            }
          );
          if (updateResponse) {
            setPopup({
              state: true,
              type: true,
              message: "Duration updated successfully",
            });
          }
        } catch (error) {
          setPopup({
            state: true,
            type: false,
            message: "No Participation or Internal Server Error",
          });
        }
      })
      .catch((error) => {
        setPopup({
          state: true,
          type: false,
          message: "Failed to updated duration",
        });
      });
  };
  return (
    <div className="ADMINEXTENDTIME">
      {popup.state && (
        <Popup
          onClose={handlePopupClose}
          content={popup.message}
          type={popup.type}
        />
      )}
      <AdminLayout
        serverRoute={serverRoute}
        clientRoute={clientRoute}
        heading={"Extend User Time"}
        defaultKey={"/admin/extendTime/contest"}
      >
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
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  min: 10,
                },
              ]}
              className="vsmall"
            >
              <Input placeholder="Username" />
            </Form.Item>
          </span>
          <span className="AllInputs">
            <Form.Item
              name="time"
              label="Duration"
              rules={[
                {
                  required: true,
                },
              ]}
              className="vsmall"
              style={{ width: "100%" }}
            >
              <InputNumber
                placeholder="Duration in Minutes"
                style={{ width: "100%" }}
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
      </AdminLayout>
    </div>
  );
};

export default ExtendTime;
