import React from "react";
import HeaderBig from "./HeaderBig";

import "./Header.css";
import { cookies } from "../cookieFetch/CookieFetch";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const imgUsername = Cookies.get("username");
  const cookieValues = cookies();
  if (cookieValues.valid === false) {
    Cookies.remove("token");
    Cookies.remove("username");
    Cookies.remove("branch");
    Cookies.remove("user");
    navigate("/");
  }
  return (
    <div className="HEADER">
      <HeaderBig imgUsername={imgUsername} />
    </div>
  );
};

export default Header;
