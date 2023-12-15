import React from "react";
import { useLocation } from "react-router-dom";

const SearchBar = ({ setSearchWord, setActive }) => {
  const location = useLocation();

  return (
    // <div className='searchDiv'>
    <label className="flex w-full mx-auto justify-end items-center gap-4">
      <div className="flex w-full mx-auto justify-end items-center">
        <input
          onChange={(e) => setSearchWord(e.target.value)}
          type="text"
          placeholder="Search for a client"
          className="focus:outline-none border-gray-800 rounded-l-[4px] border-r-0 border-[1px] pl-3 py-2 sm:w-[32%] w-[100%] bg-[#141625]"
        />
        <i className="ri-search-line bg-[#1F213A] py-[10px] px-3 rounded-r-[4px]"></i>
      </div>
      <button
        className={`${
          location.pathname === "/home"
            ? "hidden"
            : "bg-[#7B5EF8] rounded-lg w-[150px] p-2 flex items-center justify-center cursor-pointer"
        }`}
        onClick={() => setActive(true)}
      >
        Add Client
      </button>
    </label>
    // </div>
  );
};

export default SearchBar;
