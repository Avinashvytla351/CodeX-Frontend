import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/layout/adminLayout/AdminLayout";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/loading/Loading";
import "./SubjectsChapter.css";
import { useQuery, useMutation } from "@tanstack/react-query";
import Message from "../../../components/message/Message";
import Popup from "../../../components/popUp/Popup";
import "../AdminForms.css";
import {
  Form,
  Button,
  Empty,
  message,
  Space,
  Table,
  Popconfirm,
  Input,
  Select,
} from "antd";

const SubjectsTable = ({ token, serverRoute, refetch, onRefetch, onEdit }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";
  const subjectsQuery = useQuery({
    queryKey: ["subjects"],
    queryFn: () => {
      return axios.get("https://659d3738633f9aee7908e9df.mockapi.io/subjects", {
        headers: /*{
          authorization: token, // Replace with the actual token source
        }*/ { "content-type": "application/json" },
      });
    },
  });

  useEffect(() => {
    if (refetch) {
      subjectsQuery.refetch();
      onRefetch(true);
    }
  }, [refetch, onRefetch, subjectsQuery]);

  if (subjectsQuery.isLoading) {
    return <Loading />;
  }
  if (subjectsQuery.isError) {
    return (
      <div className="SUBJECTSTABLE">
        {message.error("Failed to fetch subjects")}
        <Empty />
      </div>
    );
  }

  if (subjectsQuery.isSuccess) {
    const columns = [
      {
        title: "S.No.",
        dataIndex: "key",
        key: "key",
      },
      {
        title: "Subject Id",
        dataIndex: "Subject_Id",
        key: "Subject_Id",
      },
      {
        title: "Subject Name",
        dataIndex: "Subject_Name",
        key: "Subject_Name",
        sorter: (a, b) =>
          a.Subject_Name.toLowerCase().localeCompare(
            b.Subject_Name.toLowerCase()
          ),
      },
      {
        title: "Subject Tag Name",
        dataIndex: "Subject_Tag_Name",
        key: "Subject_Tag_Name",
        sorter: (a, b) =>
          a.Subject_Tag_Name.toLowerCase().localeCompare(
            b.Subject_Tag_Name.toLowerCase()
          ),
      },
      {
        title: "Chapters Count",
        dataIndex: "Chapters_Count",
        key: "Chapters_Count",
        sorter: (a, b) => {
          return Number(a.Chapters_Count) > Number(b.Chapters_Count);
        },
      },
      {
        title: "Questions Count",
        dataIndex: "Questions_Count",
        key: "Questions_Count",
        sorter: (a, b) => {
          return Number(a.Questions_Count) > Number(b.Questions_Count);
        },
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) =>
          subjectsQuery.data.data.length > 0 ? (
            <Space size="middle">
              <a onClick={() => handleSubjectEdit(record)}>Edit</a>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() =>
                  handleSubjectDelete(record.Subject_Id, record.key)
                }
              >
                <a>Delete</a>
              </Popconfirm>
            </Space>
          ) : null,
      },
    ];

    const openMessage = (type, content) => {
      messageApi.open({
        key,
        type: type,
        content: content,
        duration: 2,
      });
    };

    const handleSubjectEdit = (record) => {
      onEdit(record); //Callback to Subject Form
    };

    const handleSubjectDelete = async (Subject_Id, key) => {
      try {
        const deleteResponse = await axios.delete(
          "https://659d3738633f9aee7908e9df.mockapi.io/subjects/" + Subject_Id,
          {
            headers: /*{
              authorization: token, // Replace with the actual token source
            }*/ { "content-type": "application/json" },
          }
        );
        if (deleteResponse.data) {
          openMessage("success", "Subject Deleted");
          subjectsQuery.refetch();
        } else {
          openMessage("error", "Deletion Failed");
        }
      } catch (error) {
        openMessage("error", "Deletion Failed");
      }
    };

    subjectsQuery.data.data.forEach((item, index) => {
      item.key = index + 1;
    });

    return (
      <div className="SUBJECTSTABLE">
        {contextHolder}
        <h3 style={{ marginLeft: "10px", fontWeight: 700 }}>All Subjects</h3>
        <Table columns={columns} dataSource={subjectsQuery.data.data} />
      </div>
    );
  }
};

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

const SubjectForm = ({
  token,
  serverRoute,
  onResponse,
  editMode,
  defaultValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editMode) {
      form.setFieldsValue(defaultValues);
    }
  }, [defaultValues, form]);

  const handleFormSubmit = async () => {
    form.validateFields().then(async (values) => {
      values.Subject_Tag_Id = values.Subject_Tag;

      //Post the Data
      var subjectResponse;
      try {
        if (editMode) {
          subjectResponse = await axios.put(
            "https://659d3738633f9aee7908e9df.mockapi.io/subjects/" +
              defaultValues.Subject_Id,
            values,
            {
              headers: /*{
            authorization: token, // Replace with the actual token source
          }*/ { "content-type": "application/json" },
            }
          );
        } else {
          subjectResponse = await axios.post(
            "https://659d3738633f9aee7908e9df.mockapi.io/subjects",
            values,
            {
              headers: /*{
          authorization: token, // Replace with the actual token source
        }*/ { "content-type": "application/json" },
            }
          );
        }
      } catch (err) {
        //Error Part console.log here while testing
      }

      //Check the post reponse
      if (subjectResponse && subjectResponse.data) {
        onResponse({ type: true, success: true });
        form.resetFields();
      } else {
        onResponse({ type: true, success: false });
      }
    });
  };

  const options = [
    { label: "C Programming", value: "0001" },
    { label: "Python Programming", value: "0002" },
    { label: "CPP Programming", value: "0003" },
    { label: "JAVA Programming", value: "0004" },
    { label: "HTML", value: "0005" },
  ];

  const handleReset = () => {
    form.setFieldsValue({});
    form.resetFields();
    onResponse({ type: false, success: false });
  };

  return (
    <div className="SUBJECTSFORM">
      <h3 style={{ marginLeft: "10px", fontWeight: 700 }}>
        {editMode ? "Edit Subject " + defaultValues.Subject_Id : "Add Subject"}
      </h3>
      <Form
        form={form}
        name="validateOnly"
        layout="vertical"
        autoComplete="off"
        className="adminForms"
      >
        <span className="AllInputs" style={{ alignItems: "flex-end" }}>
          <Form.Item
            name="Subject_Name"
            label="Subject Name"
            rules={[
              {
                required: true,
              },
            ]}
            className="vsmall"
          >
            <Input placeholder="Subject Name" />
          </Form.Item>

          <Form.Item
            name="Subject_Tag"
            label="Subject Tag"
            rules={[
              {
                required: true,
              },
            ]}
            className="vsmall"
          >
            <Select allowClear placeholder="Please select" options={options} />
          </Form.Item>

          <Form.Item>
            <Space>
              <SubmitButton form={form} onClicked={handleFormSubmit} />
              <Button htmlType="reset" onClick={handleReset}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </span>
      </Form>
    </div>
  );
};

const SubjectsChapters = ({ serverRoute, clientRoute }) => {
  const token = Cookies.get("token");
  const [refetchSubject, setRefetchSubject] = useState(false);
  const [subjectEditMode, setSubjectEditMode] = useState(false); //By default edit mode is Off
  const [defaultSubjectEditValue, setDefaultSubjectEditValue] = useState({}); // There are no default values for editing until edit is clicked in subjects table
  const [popup, setPopup] = useState({
    state: false,
    type: false,
    message: "",
  });

  const handlePopupClose = () => {
    setPopup({
      ...popup,
      state: false,
    });
  };

  const handleSubjectSubmitResponse = (response) => {
    if (response.type) {
      if (response.success) {
        setRefetchSubject(true);
        setPopup({
          state: true,
          type: true,
          message: subjectEditMode
            ? "Subject Edited Successfully"
            : "Subject Created Successfully",
        });
      } else {
        setPopup({
          state: true,
          type: false,
          message: subjectEditMode
            ? "Subject Editing Failed"
            : "Subject Creation Failed",
        });
      }
    }

    if (subjectEditMode) {
      setSubjectEditMode(false);
      setDefaultSubjectEditValue({});
    }
  };

  // Move the refetch logic to useEffect to avoid updating state during render
  useEffect(() => {
    if (refetchSubject) {
      setRefetchSubject(false);
    }
  }, [refetchSubject]);

  //Recieve the callback from subject table when edit is clicked
  const handleSubjectEdit = (editSubjectRecord) => {
    setSubjectEditMode(true);
    editSubjectRecord.Subject_Tag = editSubjectRecord.Subject_Tag_Name;
    setDefaultSubjectEditValue(editSubjectRecord);
  };

  return (
    <div className="SUBJECTCHAPTERS">
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
        heading={"Subjects & Chapters"}
        defaultKey={"/admin/add/subjects"}
      >
        <SubjectForm
          token={token}
          serverRoute={serverRoute}
          onResponse={handleSubjectSubmitResponse}
          editMode={subjectEditMode}
          defaultValues={defaultSubjectEditValue}
        />
        <SubjectsTable
          token={token}
          serverRoute={serverRoute}
          refetch={refetchSubject}
          onRefetch={() => setRefetchSubject(true)}
          onEdit={handleSubjectEdit}
        />
      </AdminLayout>
    </div>
  );
};

export default SubjectsChapters;
