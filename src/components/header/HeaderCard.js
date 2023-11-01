import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const HeaderCard = (data) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear cookies
    Cookies.remove("token");
    Cookies.remove("username");
    Cookies.remove("contestId");
    Cookies.remove("courseId");
    Cookies.remove("branch");
    Cookies.remove("user");
    navigate("/");
  };

  const [dotsMenuVisible, setDotsMenuVisible] = useState(false);
  const handleThreeDotsClick = () => {
    setDotsMenuVisible(!dotsMenuVisible); // Toggle menu visibility
  };

  const handleDocumentClick = (e) => {
    if (dotsMenuVisible && !e.target.closest(".nav-dots")) {
      // If the menu is open and click is outside the menu
      setDotsMenuVisible(false); // Close the menu
    }
  };

  useEffect(() => {
    // Add an event listener to the document for handling clicks outside the menu
    document.addEventListener("click", handleDocumentClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [dotsMenuVisible]);
  const keys = Object.keys(data.data);
  return (
    <div className="nav-dots">
      <button
        type="button"
        className="threedots"
        onClick={handleThreeDotsClick}
      >
        <span className="material-icons">more_vert</span>
      </button>
      {dotsMenuVisible && (
        <div className="dots-nav">
          {keys.map((key) => (
            <button
              onClick={() => navigate(data.data[key])}
              className="nav-btn"
              key={key}
            >
              {key}
            </button>
          ))}

          {data.imgUsername && data.logout && (
            <button className="nav-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderCard;
