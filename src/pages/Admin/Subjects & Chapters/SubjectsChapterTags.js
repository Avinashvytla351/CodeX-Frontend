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
          openMessage("success", "Subject Tag Deleted");
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

const ChaptersTagsTable = ({
  token,
  serverRoute,
  refetch,
  onRefetch,
  onEdit,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";
  const chapterTagsQuery = useQuery({
    queryKey: ["chapterTags"],
    queryFn: () => {
      return axios.get(`${serverRoute}/chapterTags`, {
        headers: {
          authorization: token, // Replace with the actual token source
        },
      });
    },
  });

  useEffect(() => {
    if (refetch) {
      chapterTagsQuery.refetch();
      onRefetch(true);
    }
  }, [refetch, onRefetch, chapterTagsQuery]);

  if (chapterTagsQuery.isLoading) {
    return <Skeleton active />;
  }
  if (chapterTagsQuery.isError) {
    return (
      <div className="CHAPTERSTAGSTABLE">
        {message.error("Failed to fetch chapter tags")}
        <Empty />
      </div>
    );
  }

  if (chapterTagsQuery.isSuccess) {
    const columns = [
      {
        title: "S.No.",
        dataIndex: "key",
        key: "key",
      },
      {
        title: "Chapter Tag Name",
        dataIndex: "chapterTagName",
        key: "chapterTagName",
        sorter: (a, b) =>
          a.chapterTagName
            .toLowerCase()
            .localeCompare(b.chapterTagName.toLowerCase()),
      },
      {
        title: "Chapter Tag Id",
        dataIndex: "chapterTagId",
        key: "chapterTagId",
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) =>
          chapterTagsQuery.data.data.data.length > 0 ? (
            <Space size="middle">
              <a onClick={() => handleChapterTagEdit(record)}>Edit</a>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() =>
                  handleChapterTagDelete(record.chapterTagId, record.key)
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

    const handleChapterTagEdit = (record) => {
      onEdit(record);
    };

    const handleChapterTagDelete = async (chapterTagId, key) => {
      try {
        const deleteResponse = await axios.delete(
          `${serverRoute}/chapterTag/${chapterTagId}`,
          {
            headers: {
              authorization: token, // Replace with the actual token source
            },
          }
        );

        if (deleteResponse.data) {
          openMessage("success", "Chapter Tag Deleted");
          chapterTagsQuery.refetch();
        } else {
          openMessage("error", "Deletion Failed");
        }
      } catch (error) {
        openMessage("error", "Deletion Faile");
      }
    };

    if (
      chapterTagsQuery.data.data.success &&
      chapterTagsQuery.data.data.data.length > 0
    ) {
      chapterTagsQuery.data.data.data.forEach((item, index) => {
        item.key = index + 1;
      });
    }

    return (
      <div className="CHAPTERSTAGSTABLE">
        {contextHolder}
        <h3 style={{ marginLeft: "10px", fontWeight: 700 }}>All Chapters</h3>
        {chapterTagsQuery.data.data.success &&
        chapterTagsQuery.data.data.data.length > 0 ? (
          <Table
            columns={columns}
            dataSource={chapterTagsQuery.data.data.data}
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

const ChapterTagsForm = ({
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
      var chapterTagResponse;
      try {
        setSubmitLoading(true);
        if (editMode) {
          chapterTagResponse = await axios.put(
            `${serverRoute}/chapterTag/${defaultValues.chapterTagId}`,
            values,
            {
              headers: {
                authorization: token, // Replace with the actual token source
              },
            }
          );
        } else {
          chapterTagResponse = await axios.post(
            `${serverRoute}/chapterTag`,
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
        chapterTagResponse &&
        chapterTagResponse.data &&
        chapterTagResponse.data.success
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
    <div className="CHAPTERTAGSFORM">
      <h3 style={{ marginLeft: "10px", fontWeight: 700 }}>
        {editMode ? "Edit Chapter Tag" : "Add Chapter Tag"}
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
            name="chapterTagName"
            label="Chapter Tag Name"
            rules={[
              {
                required: true,
              },
            ]}
            className="vsmall"
          >
            <Input placeholder="Chapter Tag Name" />
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
  const [defaultChapterTagEditValue, setDefaultChapterTagEditValue] = useState(
    {}
  );

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

  useEffect(() => {
    if (refetchChapterTag) {
      setRefetchChapterTags(false);
    }
  }, [refetchChapterTag]);

  const handleChapterTagEdit = (record) => {
    setChapterTagEditMode(true);
    setDefaultChapterTagEditValue(record);
  };

  const handleChapterTagResponse = (response) => {
    if (response.type) {
      if (response.success) {
        setRefetchChapterTags(true);
        setPopup({
          state: true,
          type: true,
          message: chapterTagEditMode
            ? "Chapter Tag Edited Successfully"
            : "Chapter Tag Created Successfully",
        });
      } else {
        setPopup({
          state: true,
          type: false,
          message: chapterTagEditMode
            ? "Chapter Tag Editing Failed"
            : "Chapter Tag Creation Failed",
        });
      }
    }

    if (chapterTagEditMode) {
      setChapterTagEditMode(false);
      setDefaultChapterTagEditValue({});
    }
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
        defaultKey={"/admin/edit/subjectChapterTags"}
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
            <>
              <ChapterTagsForm
                token={token}
                serverRoute={serverRoute}
                onResponse={handleChapterTagResponse}
                editMode={chapterTagEditMode}
                defaultValues={defaultChapterTagEditValue}
              />
              <ChaptersTagsTable
                token={token}
                serverRoute={serverRoute}
                refetch={refetchChapterTag}
                onRefetch={() => setRefetchChapterTags(true)}
                onEdit={handleChapterTagEdit}
              />
            </>
          )}
        </div>
      </AdminLayout>
    </div>
  );
};

export default SubjectsChapterTags;
