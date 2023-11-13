import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const LoginForm = (data) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${data.serverRoute}/login`, formData);

      // Handle the response as needed, e.g., show a success message or redirect
      // Using js-cookie library
      if (response.data.success) {
        Cookies.set("token", response.data.token, { expires: 2 });
        Cookies.set("username", response.data.username, { expires: 2 });
        if (!response.data.admin) {
          Cookies.set("branch", response.data.branch, { expires: 2 });
        }
        // 'expires' is the number of days until the cookie expires
        navigate("/");
      } else {
        navigate("/message", {
          state: { type: false, message: response.data.message },
        });
      }
      // Redirect to a Home page upon successful login
    } catch (error) {
      // Handle errors, e.g., display an error message
      let message = error.message;
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message = error.response.data.message;
      }
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
      <h1>Sign In</h1>
      <p></p>
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
      <button type="submit">Sign In</button>
      <a align="center" href="/forgotpassword_">
        Forgot Password?
      </a>
    </form>
  );
};

export default LoginForm;
