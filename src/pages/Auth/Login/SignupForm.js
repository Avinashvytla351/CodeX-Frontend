import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const SignupForm = (data) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    branch: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if password and confirmPassword match
    if (formData.password !== formData.confirmPassword) {
      navigate("/message", {
        state: { type: false, message: "Passwords do not match" },
      });
      return;
    }

    try {
      const response = await axios.post(`${data.serverRoute}/signup`, formData);
      // Handle the response as needed, e.g., show a success message or redirect
      if (response.data.success) {
        navigate("/message", {
          state: {
            type: true,
            message:
              "Account Created Successfully, verification mail has been sent to " +
              response.data.data.email +
              ", Please verfiy your account",
          },
        });
      } else {
        navigate("/message", {
          state: { type: false, message: response.data.message },
        });
      }
    } catch (error) {
      let message = error.message;
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message = error.response.data.message;
      }
      // Handle errors, e.g., display an error message
      navigate("/message", {
        state: { type: false, message: message },
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 style={{ padding: "8px" }}>Create Account</h1>
      <input
        required
        name="name"
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={handleInputChange}
      />
      <input
        required
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
      />
      <input
        required
        name="username"
        type="text"
        placeholder="Roll No"
        value={formData.username}
        onChange={handleInputChange}
      />
      <input
        required
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
      />
      <input
        required
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
      />
      <select
        className="custom-select"
        required
        name="branch"
        value={formData.branch}
        onChange={handleInputChange}
      >
        <option disabled selected value="">
          Select your Branch
        </option>
        <option value="cse">CSE</option>
        <option value="cs-it">CS & IT</option>
        <option value="ece">ECE</option>
      </select>
      <button>Sign Up</button>
    </form>
  );
};

export default SignupForm;
