import React from "react";
import Header from "../../header/Header";
import Footer from "../../footer/Footer";
import "./MainLayout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="MAINLAYOUT">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
