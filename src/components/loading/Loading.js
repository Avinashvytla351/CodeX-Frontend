import React from "react";
import { Oval } from "react-loader-spinner";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="LOADING">
      <Oval
        height={80}
        width={80}
        color="rgb(0,157,225)"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="rgb(0,157,225)"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};

export default Loading;
