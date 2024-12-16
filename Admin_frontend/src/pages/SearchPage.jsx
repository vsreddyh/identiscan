import React from "react";
import { useNavigate } from "react-router";

const SearchPage = () => {
  const navigate = useNavigate();
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
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600">
            Search
          </button>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
