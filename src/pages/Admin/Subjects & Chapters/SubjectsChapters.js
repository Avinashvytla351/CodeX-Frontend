import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/layout/adminLayout/AdminLayout";
import axios from "axios";
import Cookies from "js-cookie";
import "./SubjectsChapter.css";
import { useQuery, useMutation } from "@tanstack/react-query";
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

const SubjectsTable = ({
  token,
  serverRoute,
  refetch,
  onRefetch,
  onEdit,
  onData,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";
  const subjectsQuery = useQuery({
    queryKey: ["subjects"],
    queryFn: () => {
      return axios.get(`${serverRoute}/subjects`, {
        headers: {
          authorization: token, // Replace with the actual token source
        },
      });
    },
  });

  useEffect(() => {
    if (refetch) {
      subjectsQuery.refetch();
      onRefetch(true);
    }
    if (
      subjectsQuery.data &&
      subjectsQuery.data.data &&
      subjectsQuery.data.data.data
    ) {
      onData(subjectsQuery.data.data.data);
    }
  }, [refetch, onRefetch, subjectsQuery]);

  if (subjectsQuery.isLoading) {
    return <Skeleton active />;
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
        dataIndex: "subjectId",
        key: "subjectId",
      },
      {
        title: "Subject Name",
        dataIndex: "subjectName",
        key: "subjectName",
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
        title: "Chapters Count",
        dataIndex: "chaptersCount",
        key: "chaptersCount",
        sorter: (a, b) => {
          return Number(a.chaptersCount) > Number(b.chaptersCount);
        },
      },
      {
        title: "Questions Count",
        dataIndex: "questionsCount",
        key: "questionsCount",
        sorter: (a, b) => {
          return Number(a.questionsCount) > Number(b.questionsCount);
        },
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) =>
          subjectsQuery.data.data.data.length > 0 ? (
            <Space size="middle">
              <a onClick={() => handleSubjectEdit(record)}>Edit</a>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() =>
                  handleSubjectDelete(record.subjectId, record.key)
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

    const handleSubjectDelete = async (subjectId, key) => {
      try {
        const deleteResponse = await axios.delete(
          `${serverRoute}/subject/${subjectId}`,
          {
            headers: {
              authorization: token, // Replace with the actual token source
            },
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

    subjectsQuery.data.data.data.forEach((item, index) => {
      item.key = index + 1;
    });

    return (
      <div className="SUBJECTSTABLE">
        {contextHolder}
        <h3 style={{ marginLeft: "10px", fontWeight: 700 }}>All Subjects</h3>
        <Table columns={columns} dataSource={subjectsQuery.data.data.data} />
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

const SubjectForm = ({
  token,
  serverRoute,
  onResponse,
  editMode,
  defaultValues,
}) => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (editMode) {
      form.setFieldsValue(defaultValues);
    }
  }, [defaultValues, form]);

  const handleFormSubmit = async () => {
    form.validateFields().then(async (values) => {
      values.subjectTagId = values.subjectTag;

      //Post the Data
      var subjectResponse;
      try {
        setSubmitLoading(true);
        if (editMode) {
          subjectResponse = await axios.put(
            `${serverRoute}/subject/${defaultValues.subjectId}`,
            values,
            {
              headers: {
                authorization: token, // Replace with the actual token source
              },
            }
          );
        } else {
          subjectResponse = await axios.post(`${serverRoute}/subject`, values, {
            headers: {
              authorization: token, // Replace with the actual token source
            },
          });
        }
      } catch (err) {
        //Error Part console.log here while testing
        subjectResponse = err;
      } finally {
        setSubmitLoading(false);
      }

      //Check the post reponse
      if (subjectResponse && subjectResponse.data) {
        onResponse({ type: true, success: true, message: "" });
        form.resetFields();
      } else {
        try {
          onResponse({
            type: true,
            success: false,
            message: subjectResponse.response.data.message,
          });
        } catch (err) {
          onResponse({ type: true, success: false, message: "" });
        }
      }
    });
  };

  //Fetch Subject Tags for the Subjects
  var options = [];

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

  if (subjectTagsQuery.isError) {
    setLoading(false);
  } else if (subjectTagsQuery.isSuccess) {
    if (
      subjectTagsQuery.data &&
      subjectTagsQuery.data.data &&
      subjectTagsQuery.data.data.success &&
      subjectTagsQuery.data.data.data.length > 0
    ) {
      subjectTagsQuery.data.data.data.forEach((item, index) => {
        options.push({ label: item.subjectTagName, value: item.subjectTagId });
      });
    }
  }

  const handleReset = () => {
    form.setFieldsValue({});
    form.resetFields();
    onResponse({ type: false, success: false });
  };

  return (
    <div className="SUBJECTSFORM">
      <h3 style={{ marginLeft: "10px", fontWeight: 700 }}>
        {editMode ? "Edit Subject" : "Add Subject"}
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
            name="subjectName"
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
            name="subjectTag"
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

const ChaptersTable = ({ token, serverRoute, refetch, onRefetch, onEdit }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";
  const chaptersQuery = useQuery({
    queryKey: ["chapters"],
    queryFn: () => {
      return axios.get(`${serverRoute}/chapters`, {
        headers: {
          authorization: token, // Replace with the actual token source
        },
      });
    },
  });

  useEffect(() => {
    if (refetch) {
      chaptersQuery.refetch();
      onRefetch(true);
    }
  }, [refetch, onRefetch, chaptersQuery]);

  if (chaptersQuery.isLoading) {
    return <Skeleton active />;
  }
  if (chaptersQuery.isError) {
    return (
      <div className="CHAPTERSTABLE">
        {message.error("Failed to fetch chapters")}
        <Empty />
      </div>
    );
  }

  if (chaptersQuery.isSuccess) {
    const columns = [
      {
        title: "S.No.",
        dataIndex: "key",
        key: "key",
      },
      {
        title: "Chapter Id",
        dataIndex: "chapterId",
        key: "chapterId",
      },
      {
        title: "Chapter Name",
        dataIndex: "chapterName",
        key: "chapterName",
        sorter: (a, b) =>
          a.chapterName
            .toLowerCase()
            .localeCompare(b.chapterName.toLowerCase()),
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
        title: "Subject Name",
        dataIndex: "subjectName",
        key: "subjectName",
        sorter: (a, b) =>
          a.subjectName
            .toLowerCase()
            .localeCompare(b.subjectName.toLowerCase()),
      },
      {
        title: "Questions Count",
        dataIndex: "questionsCount",
        key: "questionsCount",
        sorter: (a, b) => {
          return Number(a.questionsCount) > Number(b.questionsCount);
        },
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) =>
          chaptersQuery.data.data.data.length > 0 ? (
            <Space size="middle">
              <a onClick={() => handleChapterEdit(record)}>Edit</a>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() =>
                  handleChapterDelete(record.chapterId, record.key)
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

    const handleChapterEdit = (record) => {
      onEdit(record); //Callback to Chapter Form
    };

    const handleChapterDelete = async (chapterId, key) => {
      try {
        const deleteResponse = await axios.delete(
          `${serverRoute}/chapter/${chapterId}`,
          {
            headers: {
              authorization: token, // Replace with the actual token source
            },
          }
        );
        console.log(deleteResponse.data);
        if (deleteResponse.data) {
          openMessage("success", "Chapter Deleted");
          chaptersQuery.refetch();
        } else {
          openMessage("error", "Deletion Failed");
        }
      } catch (error) {
        openMessage("error", "Deletion Failed");
      }
    };

    if (
      chaptersQuery &&
      chaptersQuery.data &&
      chaptersQuery.data.data &&
      chaptersQuery.data.data.data
    ) {
      chaptersQuery.data.data.data.forEach((item, index) => {
        item.key = index + 1;
      });
    }

    return (
      <div className="CHAPTERSTABLE">
        {contextHolder}
        <h3 style={{ marginLeft: "10px", fontWeight: 700 }}>All Chapters</h3>
        <Table columns={columns} dataSource={chaptersQuery.data.data.data} />
      </div>
    );
  }
};

const ChapterForm = ({
  token,
  serverRoute,
  onResponse,
  editMode,
  defaultValues,
  subjectsData,
}) => {
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";
  const [form] = Form.useForm();

  useEffect(() => {
    if (editMode) {
      form.setFieldsValue(defaultValues);
    }
  }, [defaultValues, form]);

  useEffect(() => {
    if (subjectsData.length > 0) {
      let temp = [];
      subjectsData.forEach((subject) => {
        temp.push({
          label: subject.subjectName,
          value: subject.subjectId,
        });
      });

      setSubjectOptions(temp);
    }
  }, [subjectsData.length]);

  const handleFormSubmit = async () => {
    form.validateFields().then(async (values) => {
      values.chapterTagId = values.chapterTag;
      values.subjectId = values.subjectName;
      if (subjectOptions.length) {
        subjectOptions.forEach((option) => {
          if (option.value === values.subjectId) {
            values.subjectName = option.label;
            return;
          }
        });
      }

      //Post the Data
      var chapterResponse;
      try {
        setSubmitLoading(true);
        if (editMode) {
          chapterResponse = await axios.put(
            `${serverRoute}/chapter/${defaultValues.chapterId}`,
            values,
            {
              headers: {
                authorization: token, // Replace with the actual token source
              },
            }
          );
        } else {
          chapterResponse = await axios.post(`${serverRoute}/chapter`, values, {
            headers: {
              authorization: token, // Replace with the actual token source
            },
          });
        }
      } catch (err) {
        //Error Part console.log here while testing
        chapterResponse = err;
      } finally {
        setSubmitLoading(false);
      }

      //Check the post reponse
      if (chapterResponse && chapterResponse.data) {
        onResponse({ type: true, success: true, message: "" });
        form.resetFields();
      } else {
        try {
          onResponse({
            type: true,
            success: false,
            message: chapterResponse.response.data.message,
          });
        } catch (err) {
          onResponse({ type: true, success: false, message: "" });
        }
      }
    });
  };

  const openMessage = (type, content) => {
    messageApi.open({
      key,
      type: type,
      content: content,
      duration: 2,
    });
  };

  const handleReset = () => {
    form.setFieldsValue({});
    form.resetFields();

    //Clear the edit mode by sending a false response
    onResponse({ type: false, success: false });
  };

  //Fetch Chapter Tags for the Chapters
  var options = [];

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

  if (chapterTagsQuery.isError) {
    openMessage(false, "Failed to fetch chapter tags");
  } else if (chapterTagsQuery.isLoading) {
    return (
      <span className="AllInputs" style={{ alignItems: "flex-end" }}>
        <Skeleton.Input active={true} size={"default"} />
        <Skeleton.Input active={true} size={"default"} />
      </span>
    );
  } else if (chapterTagsQuery.isSuccess) {
    if (
      chapterTagsQuery.data &&
      chapterTagsQuery.data.data &&
      chapterTagsQuery.data.data.success &&
      chapterTagsQuery.data.data.data.length > 0
    ) {
      chapterTagsQuery.data.data.data.forEach((item, index) => {
        options.push({ label: item.chapterTagName, value: item.chapterTagId });
      });
    }

    return (
      <div className="SUBJECTSFORM">
        <h3 style={{ marginLeft: "10px", fontWeight: 700 }}>
          {editMode
            ? "Edit Subject " + defaultValues.Subject_Id
            : "Add Subject"}
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
              name="chapterName"
              label="Chapter Name"
              rules={[
                {
                  required: true,
                },
              ]}
              className="vsmall"
            >
              <Input placeholder="Chapter Name" />
            </Form.Item>

            <Form.Item
              name="chapterTag"
              label="Chapter Tag"
              rules={[
                {
                  required: true,
                },
              ]}
              className="vvsmall"
            >
              <Select
                allowClear
                placeholder="Please select"
                options={options}
              />
            </Form.Item>

            <Form.Item
              name="subjectName"
              label="Subject Name"
              rules={[
                {
                  required: true,
                },
              ]}
              className="vvsmall"
            >
              <Select
                allowClear
                placeholder="Please select"
                options={subjectOptions}
              />
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
  }
};

const SubjectsChapters = ({ serverRoute, clientRoute }) => {
  const token = Cookies.get("token");
  const [refetchSubject, setRefetchSubject] = useState(false);
  const [refetchChapter, setRefetchChapter] = useState(false);
  const [subjectEditMode, setSubjectEditMode] = useState(false); //By default edit mode is Off
  const [defaultSubjectEditValue, setDefaultSubjectEditValue] = useState({}); // There are no default values for editing until edit is clicked in subjects table
  const [chapterEditMode, setChapterEditMode] = useState(false); //By default edit mode is Off
  const [defaultChapterEditValue, setDefaultChapterEditValue] = useState({}); // There are no default values for editing until edit is clicked in subjects table
  const [subjectsData, setSubjectsData] = useState([]); //data of all subjects recieved from the subjects table using onData callback function, to use it in chapters form
  const [popup, setPopup] = useState({
    state: false,
    type: false,
    message: "",
  });
  const [subjectsToggle, setSubjectsToggle] = useState(true); //Detects toggle between subjects and chapters section

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
        //check if any default message is available from server if not provide default message based on edit mode
        setPopup({
          state: true,
          type: false,
          message: response.message.length
            ? response.message
            : subjectEditMode
            ? "Failed to edit subject"
            : "Failed to create subject",
        });
      }
    }
    if (subjectEditMode) {
      setSubjectEditMode(false);
      setDefaultSubjectEditValue({});
    }
  };

  const handleChapterSubmitResponse = (response) => {
    if (response.type) {
      if (response.success) {
        setRefetchChapter(true);
        setPopup({
          state: true,
          type: true,
          message: chapterEditMode
            ? "Chapter Edited Successfully"
            : "Chapter Created Successfully",
        });
      } else {
        setPopup({
          state: true,
          type: false,
          message: response.message.length
            ? response.message
            : chapterEditMode
            ? "Failed to edit chapter"
            : "Failed to create chapter",
        });
      }
    }

    if (chapterEditMode) {
      setChapterEditMode(false);
      setDefaultChapterEditValue({});
    }
  };

  //refetch logic to useEffect to avoid updating state during render
  useEffect(() => {
    if (refetchSubject) {
      setRefetchSubject(false);
    }
  }, [refetchSubject]);

  useEffect(() => {
    if (refetchChapter) {
      setRefetchChapter(false);
    }
  }, [refetchChapter]);

  //Recieve the callback from subject table when edit is clicked
  const handleSubjectEdit = (editSubjectRecord) => {
    setSubjectEditMode(true);
    //In the Subject Form Subject Tag Name is mentioned as Subject Tag
    editSubjectRecord.subjectTag = editSubjectRecord.subjectTagId;
    setDefaultSubjectEditValue(editSubjectRecord);
  };

  const handleChapterEdit = (editChapterRecord) => {
    setChapterEditMode(true);
    //In the Subject Form Chapter Tag Name is mentioned as Chapter Tag
    editChapterRecord.chapterTag = editChapterRecord.chapterTagId;
    setDefaultChapterEditValue(editChapterRecord);
  };

  const handleSubjectData = (subjectData) => {
    if (subjectData.length > 0) {
      setSubjectsData(subjectData);
    }
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
                Subjects
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setSubjectsToggle(false)}
              >
                Chapters
              </button>
            </div>
          </div>
          {subjectsToggle ? (
            <>
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
                onData={handleSubjectData}
              />
            </>
          ) : (
            <>
              <ChapterForm
                token={token}
                serverRoute={serverRoute}
                subjectsData={subjectsData}
                onResponse={handleChapterSubmitResponse}
                editMode={chapterEditMode}
                defaultValues={defaultChapterEditValue}
              />
              <ChaptersTable
                token={token}
                serverRoute={serverRoute}
                refetch={refetchChapter}
                onRefetch={() => setRefetchChapter(true)}
                onEdit={handleChapterEdit}
              />
            </>
          )}
        </div>
      </AdminLayout>
    </div>
  );
};

export default SubjectsChapters;
