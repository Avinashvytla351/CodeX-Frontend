import React, { useEffect, useState } from "react";
import AdminLayout from "../../../../components/layout/adminLayout/AdminLayout";
import axios from "axios";
import Cookies from "js-cookie";
import QuestionFetch from "../QuestionFetch/QuestionFetch";
import Popup from "../../../../components/popUp/Popup";

const QuestionDelete = ({ serverRoute, clientRoute }) => {
  useEffect(() => {
    document.title = "Delete Question | KLHCode";
  }, []);
  const token = Cookies.get("token");
  const [popup, setPopup] = useState({
    state: false,
    type: false,
    message: "",
  });
  const [deleteList, setDeleteList] = useState([]);

  const handleQuestionFetch = async (event) => {
    try {
      let questionIds = [];
      event.forEach((question) => {
        questionIds.push(question.questionId);
      });
      const questionResponse = await axios.post(
        serverRoute + "/questions/delete",
        {
          questionIds: questionIds,
        },
        {
          headers: {
            authorization: token, // Replace with the actual token source
          },
        }
      );
      if (questionResponse.data.success) {
        setPopup({
          state: true,
          type: true,
          message: "Question Deleted Successfully",
        });
        let tempList = deleteList;
        event.forEach((question) => {
          tempList.push(question.questionId + " - " + question.questionName);
        });
        setDeleteList(tempList);
      } else {
        setPopup({
          state: true,
          type: false,
          message: "Question Deletion Failed",
        });
      }
    } catch (error) {
      let message = "Question Deletion Failed";
      if (error.response && error.response.data.message) {
        message = error.response.data.message;
      }
      setPopup({
        state: true,
        type: false,
        message: message,
      });
    }
  };
  const handlePopupClose = () => {
    setPopup({
      ...popup,
      state: false,
    });
  };
  return (
    <div className="ADMINQUESTIONEDELETE">
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
        heading={"Delete Question"}
        defaultKey={"/admin/delete/question"}
      >
        <QuestionFetch
          serverRoute={serverRoute}
          onQuestionFetch={handleQuestionFetch}
          deleteList={deleteList}
          multiple={true}
        />
      </AdminLayout>
    </div>
  );
};

export default QuestionDelete;
