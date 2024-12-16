import React, { useState } from "react";

const Dashboard = () => {
  const [visibleRows, setVisibleRows] = useState(10);

  // Mock data for the table
  const data = Array.from({ length: 50 }, (_, index) => ({
    name: `Student ${index + 1}`,
    rollNo: index + 1,
    percentage: `${(Math.random() * 50 + 50).toFixed(2)}%`,
  }));

  const showMoreRows = () => {
    setVisibleRows((prev) => prev + 10);
  };

  return (
    <div className="w-full mx-auto p-4">
      {/* First Row: Boxes */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-400 text-black p-6 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-bold">Manage Batches</h2>
        </div>
        <div className="bg-gray-400 text-black p-6 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-bold">Manage Classes</h2>
        </div>
      </div>

      {/* Second Row: 2 Dropdowns + 1 Button */}
      <div className="flex justify-between items-center gap-4 mb-6">
        <select className="p-2 border rounded-md w-1/3">
          <option>Select Batch</option>
        </select>
        <select className="p-2 border rounded-md w-1/3">
          <option>Select Class</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md w-1/3">
          Search
        </button>
      </div>

      {/* Third Row: 2 Dropdowns + Search Bar + Add Buttons */}
      <div className="flex justify-between items-center gap-4 mb-6">
        <select className="p-2 border rounded-md w-1/4">
          <option>Select Section</option>
        </select>
        <select className="p-2 border rounded-md w-1/4">
          <option>Select Subject</option>
        </select>
        <input
          type="text"
          placeholder="Search Student"
          className="p-2 border rounded-md w-1/4"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md w-1/4">
          Add Student
        </button>
      </div>

      {/* Fourth Row: Add Day Button */}
      <div className="flex justify-end mb-6">
        <button className="bg-green-600 text-white px-4 py-2 rounded-md">
          Add Day
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Roll No</th>
              <th className="text-left p-2">Percentage</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, visibleRows).map((row, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="p-2 border-t">{row.name}</td>
                <td className="p-2 border-t">{row.rollNo}</td>
                <td className="p-2 border-t">{row.percentage}</td>
                <td className="p-2 border-t">
                  <button className="text-blue-500 underline">Show More</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show More Button */}
      {visibleRows < data.length && (
        <div className="text-center mt-4">
          <button
            onClick={showMoreRows}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
