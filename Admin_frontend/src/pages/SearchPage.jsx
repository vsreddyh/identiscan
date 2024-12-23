import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const Search = () => {
    axios
      .get(
        `${import.meta.env.VITE_SERVER}/admin/getStudentInfo/?rollNumber=${search}`,
      )
      .then((response) => {
        navigate(`/student/${response.data.id}`);
      })
      .catch((err) => {
        setError(err.response.data.message);
        console.log(err);
      });
  };
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 shadow-md">
        <div className="text-2xl font-bold text-gray-800">
          <img src="Identiscan.png" alt="Logo" className="h-10 w-auto" />
        </div>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
      </header>

      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <div className="w-full px-4 md:px-8 lg:px-16 xl:px-32 flex">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={Search}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
          >
            Search
          </button>
        </div>
        <p className="text-red-600">{error}</p>
      </main>
    </div>
  );
};

export default SearchPage;
