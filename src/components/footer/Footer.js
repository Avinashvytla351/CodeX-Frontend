import React from "react";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <div className="footer-left">
        <div className="logo">KLHCode</div>
        <div className="small-text">Contact</div>
        <div className="small-text">About</div>
        <div className="small-text">Privacy</div>
        <div className="small-text">Terms</div>
      </div>
      <div className="footer-right">
        <div className="copy">Copyright ©{currentYear}</div>
      </div>
    </footer>
  );
};

export default Footer;
