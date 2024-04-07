import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/layout/adminLayout/AdminLayout";
import axios from "axios";
import Cookies from "js-cookie";
import "./SubjectsChapterTags.css";
import { useQuery } from "@tanstack/react-query";
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
  Skeleton,
  Spin,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const SubjectsTagsTable = ({
  token,
  serverRoute,
  refetch,
  onRefetch,
  onEdit,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";
  const subjectTagsQuery = useQuery({
    queryKey: ["subjectTags"],
    queryFn: () => {
      return axios.get(`${serverRoute}/subjectTags`, {
        headers: {
          authorization: token, // Replace with the actual token source
        },
      });
    },
  });

  useEffect(() => {
    if (refetch) {
      subjectTagsQuery.refetch();
      onRefetch(true);
    }
  }, [refetch, onRefetch, subjectTagsQuery]);

  if (subjectTagsQuery.isLoading) {
    return <Skeleton active />;
  }
  if (subjectTagsQuery.isError) {
    return (
      <div className="SUBJECTSTAGSTABLE">
        {message.error("Failed to fetch subject tags")}
        <Empty />
      </div>
    );
  }

  if (subjectTagsQuery.isSuccess) {
    console.log(subjectTagsQuery.data);
    const columns = [
      {
        title: "S.No.",
        dataIndex: "key",
        key: "key",
      },
      {
        title: "Subject Tag Name",
        dataIndex: "subjectTagName",
        key: "subjectTagName",
        sorter: (a, b) =>
          a.subjectTagName
            .toLowerCase()
            .localeCompare(b.subjectTagName.toLowerCase()),
      },
      {
        title: "Subject Tag Id",
        dataIndex: "subjectTagId",
        key: "subjectTagId",
        sorter: (a, b) =>
          a.subjectTagId
            .toLowerCase()
            .localeCompare(b.subjectTagId.toLowerCase()),
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) =>
          subjectTagsQuery.data.data.data.length > 0 ? (
            <Space size="middle">
              <a onClick={() => handleSubjectTagEdit(record)}>Edit</a>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() =>
                  handleSubjectTagDelete(record.subjectTagId, record.key)
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

    const handleSubjectTagEdit = (record) => {
      onEdit(record);
    };

    const handleSubjectTagDelete = async (subjectTagId, key) => {
      try {
        const deleteResponse = await axios.delete(
          `${serverRoute}/subjectTag/${subjectTagId}`,
          {
            headers: {
              authorization: token, // Replace with the actual token source
            },
          }
        );

        if (deleteResponse.data) {
          console.log(deleteResponse.data);
          openMessage("success", "Subject Deleted");
          subjectTagsQuery.refetch();
        } else {
          openMessage("error", "Deletion Failed");
        }
      } catch (error) {
        openMessage("error", "Deletion Faile");
      }
    };

    if (
      subjectTagsQuery.data.data.success &&
      subjectTagsQuery.data.data.data.length > 0
    ) {
      subjectTagsQuery.data.data.data.forEach((item, index) => {
        item.key = index + 1;
      });
    }

    return (
      <div className="SUBJECTSTAGSTABLE">
        {contextHolder}
        <h3 style={{ marginLeft: "10px", fontWeight: 700 }}>All Subjects</h3>
        {subjectTagsQuery.data.data.success &&
        subjectTagsQuery.data.data.data.length > 0 ? (
          <Table
            columns={columns}
            dataSource={subjectTagsQuery.data.data.data}
          />
        ) : (
          <Empty />
        )}
      </div>
    );
  }
};

const SubmitButton = ({ form, onClicked, loading }) => {
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
      disabled={!submittable || loading}
      onClick={handleClick}
    >
      Submit
      {loading && (
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 12,
              }}
              spin
            />
          }
        />
      )}
    </Button>
  );
};

const SubjectTagsForm = ({
  token,
  serverRoute,
  onResponse,
  editMode,
  defaultValues,
}) => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (editMode) {
      form.setFieldsValue(defaultValues);
    }
  }, [defaultValues, form]);

  const handleFormSubmit = async () => {
    form.validateFields().then(async (values) => {
      //Post the Data
      var subjectTagResponse;
      try {
        setSubmitLoading(true);
        if (editMode) {
          subjectTagResponse = await axios.put(
            `${serverRoute}/subjectTag/${defaultValues.subjectTagId}`,
            values,
            {
              headers: {
                authorization: token, // Replace with the actual token source
              },
            }
          );
        } else {
          subjectTagResponse = await axios.post(
            `${serverRoute}/subjectTag`,
            values,
            {
              headers: {
                authorization: token, // Replace with the actual token source
              },
            }
          );
        }
      } catch (err) {
        //Error Part console.log here while testing
      } finally {
        setSubmitLoading(false);
      }

      //Check the post reponse
      if (
        subjectTagResponse &&
        subjectTagResponse.data &&
        subjectTagResponse.data.success
      ) {
        onResponse({ type: true, success: true });
        form.resetFields();
      } else {
        onResponse({ type: true, success: false });
      }
    });
  };

  const handleReset = () => {
    form.setFieldsValue({});
    form.resetFields();
    onResponse({ type: false, success: false });
  };

  return (
    <div className="SUBJECTTAGSFORM">
      <h3 style={{ marginLeft: "10px", fontWeight: 700 }}>
        {editMode ? "Edit Subject Tag" : "Add Subject Tag"}
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
            name="subjectTagName"
            label="Subject Tag Name"
            rules={[
              {
                required: true,
              },
            ]}
            className="vsmall"
          >
            <Input placeholder="Subject Tag Name" />
          </Form.Item>

          <Form.Item>
            <Space>
              <SubmitButton
                form={form}
                onClicked={handleFormSubmit}
                loading={submitLoading}
              />
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

const SubjectsChapterTags = ({ serverRoute, clientRoute }) => {
  const token = Cookies.get("token");

  //Popup State
  const [popup, setPopup] = useState({
    state: false,
    type: false,
    message: "",
  });

  const [subjectsToggle, setSubjectsToggle] = useState(true); //Detects toggle between subjects and chapters section

  const [refetchSubjectTag, setRefetchSubjectTags] = useState(false);
  const [refetchChapterTag, setRefetchChapterTags] = useState(false);
  const [subjectTagEditMode, setSubjectTagEditMode] = useState(false);
  const [chapterTagEditMode, setChapterTagEditMode] = useState(false); //By default edit mode is Off
  const [defaultSubjectTagEditValue, setDefaultSubjectTagEditValue] = useState(
    {}
  ); // There are no default values for editing until edit is clicked in subjects table

  const handlePopupClose = () => {
    setPopup({
      ...popup,
      state: false,
    });
  };

  const handleSubjectTagResponse = (response) => {
    if (response.type) {
      if (response.success) {
        setRefetchSubjectTags(true);
        setPopup({
          state: true,
          type: true,
          message: subjectTagEditMode
            ? "Subject Tag Edited Successfully"
            : "Subject Tag Created Successfully",
        });
      } else {
        setPopup({
          state: true,
          type: false,
          message: subjectTagEditMode
            ? "Subject Tag Editing Failed"
            : "Subject Tag Creation Failed",
        });
      }
    }

    if (subjectTagEditMode) {
      setSubjectTagEditMode(false);
      setDefaultSubjectTagEditValue({});
    }
  };

  useEffect(() => {
    if (refetchSubjectTag) {
      setRefetchSubjectTags(false);
    }
  }, [refetchSubjectTag]);

  const handleSubjectTagEdit = (record) => {
    setSubjectTagEditMode(true);
    setDefaultSubjectTagEditValue(record);
  };
  return (
    <div className="SUBJECTCHAPTERTAGS">
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
        heading={"Subjects & Chapters Tags"}
        defaultKey={"/admin/edit/subjectsChapters"}
      >
        <div className="admin-main">
          <div className="admin-main-header">
            <div
              className="main-buttons"
              style={{
                "--left": subjectsToggle ? "50px" : "calc(100% - 210px)",
              }}
            >
              <button
                type="button"
                className="btn"
                onClick={() => setSubjectsToggle(true)}
              >
                Subject Tags
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setSubjectsToggle(false)}
              >
                Chapter Tags
              </button>
            </div>
          </div>

          {subjectsToggle ? (
            <>
              <SubjectTagsForm
                token={token}
                serverRoute={serverRoute}
                onResponse={handleSubjectTagResponse}
                editMode={subjectTagEditMode}
                defaultValues={defaultSubjectTagEditValue}
              />
              <SubjectsTagsTable
                token={token}
                serverRoute={serverRoute}
                refetch={refetchSubjectTag}
                onRefetch={() => setRefetchSubjectTags(true)}
                onEdit={handleSubjectTagEdit}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </AdminLayout>
    </div>
  );
};

export default SubjectsChapterTags;
