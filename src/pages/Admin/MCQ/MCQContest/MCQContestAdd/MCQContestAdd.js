import React, { useEffect, useState } from "react";
import AdminLayout from "../../../../../components/layout/adminLayout/AdminLayout";
import "./MCQContestAdd.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../../components/loading/Loading";
import TypeMCQContestAdd from "../TypeMCQContestAdd/TypeMCQContestAdd";

const MCQContestAdd = ({ serverRoute, clientRoute }) => {
  useEffect(() => {
    document.title = "Add MCQ Contest | KLHCode";
  }, []);

  const token = Cookies.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mcqSchema, setMcqSchema] = useState({});

  //Fetch Schema for MCQ Creation
  const fetchSchema = async () => {
    try {
      const schemaResponse = await axios.get(serverRoute + "/counters", {
        headers: {
          authorization: token, // Replace with the actual token source
        },
      });
      console.log(schemaResponse.data);
      if (schemaResponse.data.success) {
        setMcqSchema(schemaResponse.data.data.subjectCount);
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
    <div className="ADMINMCQCONTESTADD">
      {!loading ? (
        <AdminLayout
          serverRoute={serverRoute}
          clientRoute={clientRoute}
          heading={"Add MCQ Contest"}
          defaultKey={"/admin/add/mcqContest"}
        >
          <TypeMCQContestAdd
            schema={mcqSchema}
            route={serverRoute + "/contest"}
          />
        </AdminLayout>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default MCQContestAdd;
