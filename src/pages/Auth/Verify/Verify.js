import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Verify = ({ serverRoute }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    axios
      .post(`${serverRoute}/verify`, { email, token })
      .then((response) => {
        // Handle the response from the server
        const verificationResult = response.data;

        // Redirect to the 'Message' component with the verification result
        navigate("/message", {
          state: { type: true, message: "Account Verified Successfully" },
        });
      })
      .catch((error) => {
        // Handle any errors
        console.error("Verification failed:", error);
        // Redirect to the 'Message' component with an error message
        navigate("/message", {
          state: {
            type: false,
            message: "Verification failed. Please try again.",
          },
        });
      });
  }, [navigate]);

  return null; // You don't need to return anything since you're redirecting
};

export default Verify;
