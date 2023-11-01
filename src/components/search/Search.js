// Search.js
import React, { useState } from "react";
import "./Search.css";

function Search({ onSearch }) {
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    onSearch(query); // Call the callback function with the search query
  };

  return (
    <div className="search">
      <input
        type="search"
        name=""
        id="search"
        placeholder="Search Contests"
        value={search}
        onChange={handleSearchChange}
        autoComplete="off"
      />
    </div>
  );
}

export default Search;
