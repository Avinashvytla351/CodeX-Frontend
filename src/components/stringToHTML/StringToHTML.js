import React from "react";

const StringToHTML = ({ htmlString }) => {
  const createMarkup = (htmlString) => {
    return { __html: htmlString };
  };

  return <div dangerouslySetInnerHTML={createMarkup(htmlString)} />;
};

export default StringToHTML;
