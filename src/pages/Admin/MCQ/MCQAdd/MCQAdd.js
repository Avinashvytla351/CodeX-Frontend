import React, { useEffect, useState } from "react";
import AdminLayout from "../../../../components/layout/adminLayout/AdminLayout";
import "./MCQAdd.css";
import MCQAddForm from "../MCQAddForm/MCQAddForm";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../components/loading/Loading";
import MCQAddFormExcel from "../MCQAddFormExcel/MCQAddFormExcel";

const MCQAdd = ({ serverRoute, clientRoute }) => {
  useEffect(() => {
    document.title = "Add MCQ Question | KLHCode";
  }, []);
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mcqSchema, setMcqSchema] = useState({});
  const [manual, setManual] = useState(true);

  //Fetch Schema for MCQ Creation
  const fetchSchema = async () => {
    try {
      const schemaResponse = await axios.get(serverRoute + "/tags", {
        headers: {
          authorization: token, // Replace with the actual token source
        },
      });
      console.log(schemaResponse.data);
      if (schemaResponse.data.success) {
        setMcqSchema(schemaResponse.data.data.mcqSubjects);
      } else {
        navigate("/message", {
          state: { type: false, message: "Failed get the subjects and topics" },
        });
      }
      setLoading(false);
    } catch (error) {
      let message = "Failed get the subjects and topics";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message = error.response.data.message;
      }

      setLoading(false);
      navigate("/message", {
        state: { type: false, message: message },
      });
    }
  };
  useEffect(() => {
    fetchSchema();
  }, []);
  return (
    <div className="ADMINMCQADD">
      {!loading ? (
        <AdminLayout
          serverRoute={serverRoute}
          clientRoute={clientRoute}
          heading={"Add MCQ Question"}
          defaultKey={"/admin/add/mcq"}
        >
          <div className="admin-main">
            <div className="admin-main-header">
              <div
                className="main-buttons"
                style={{ "--left": manual ? "50px" : "calc(100% - 210px)" }}
              >
                <button
                  type="button"
                  className="btn"
                  onClick={() => setManual(true)}
                >
                  Add Manually
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setManual(false)}
                >
                  Upload Excel
                </button>
              </div>
            </div>
            {manual ? (
              Object.keys(mcqSchema).length && (
                <MCQAddForm
                  route={`${serverRoute}/mcqQuestion`}
                  schema={mcqSchema}
                />
              )
            ) : (
              <MCQAddFormExcel
                schema={mcqSchema}
                route={`${serverRoute}/mcqQuestion`}
              />
            )}
          </div>
        </AdminLayout>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default MCQAdd;
