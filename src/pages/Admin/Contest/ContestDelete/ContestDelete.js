import React, { useEffect, useState } from "react";
import AdminLayout from "../../../../components/layout/adminLayout/AdminLayout";
import axios from "axios";
import Cookies from "js-cookie";
import ContestFetch from "../ContestFetch/ContestFetch";
import Popup from "../../../../components/popUp/Popup";

const ContestDelete = ({ serverRoute, clientRoute }) => {
  useEffect(() => {
    document.title = "Delete Contest | KLHCode";
  }, []);
  const token = Cookies.get("token");
  const [popup, setPopup] = useState({
    state: false,
    type: false,
    message: "",
  });
  const [deleteList, setDeleteList] = useState([]);
  const handleContestFetch = async (event) => {
    try {
      const contestsResponse = await axios.delete(
        serverRoute + "/contest/" + event.contestId,
        {
          headers: {
            authorization: token, // Replace with the actual token source
          },
        }
      );
      if (contestsResponse.data.success) {
        setPopup({
          state: true,
          type: true,
          message: "Contest Deleted Successfully",
        });
        setDeleteList([
          ...deleteList,
          event.contestId + " - " + event.contestName,
        ]);
      } else {
        setPopup({
          state: true,
          type: false,
          message: "Contest Deletion Failed",
        });
      }
    } catch (error) {
      let message = "Contest Deletion Failed";
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
    <div className="ADMINCONTESTDELETE">
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
        heading={"Delete Contest"}
        defaultKey={"/admin/delete/contest"}
      >
        <ContestFetch
          serverRoute={serverRoute}
          onContestFetch={handleContestFetch}
          deleteList={deleteList}
        />
      </AdminLayout>
    </div>
  );
};

export default ContestDelete;
