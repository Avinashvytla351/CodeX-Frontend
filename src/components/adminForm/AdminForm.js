import React from "react";

const Small = ({ comments, placeholder, name }) => {
  return (
    <span class="inputf">
      <p class="comments">{comments}</p>
      <input name={name} placeholder={placeholder} className="small" />
    </span>
  );
};
