import React from "react";
import "./Popup.css";

const Popup = ({ type, content, onClose }) => {
  const handleClose = () => {
    onClose(true);
  };
  return (
    <div className="POPUP">
      <div className="modal">
        <div className="top">
          {type ? (
            <span
              className="material-icons-round"
              style={{ color: "rgb(20,156,255)" }}
            >
              check_circle
            </span>
          ) : (
            <span
              className="material-icons-round"
              style={{ color: "rgb(251,188,4)" }}
            >
              error
            </span>
          )}
          <p>{content}</p>
        </div>
        <button type="button" className="btn-pop" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
