import React, { useState } from "react";
import AddStudentModal from "../components/AddStudentModal";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const [rows, setRows] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Student ${i + 1}`,
      roll: `Roll ${i + 1}`,
      percentage: `${Math.floor(Math.random() * 101)}%`,
    })),
  );
  const [nextRowStart, setNextRowStart] = useState(11);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowMore = () => {
    const newRows = Array.from({ length: 10 }, (_, i) => ({
      id: nextRowStart + i,
      name: `Student ${nextRowStart + i}`,
      roll: `Roll ${nextRowStart + i}`,
      percentage: `${Math.floor(Math.random() * 101)}%`,
    }));
    setRows((prev) => [...prev, ...newRows]);
    setNextRowStart(nextRowStart + 10);
  };

  const handleAddStudent = (newStudent) => {
    const newStudentWithId = {
      ...newStudent,
      id: rows.length + 1,
    };
    setRows((prev) => [...prev, newStudentWithId]);
  };

  return (
    <div className="p-6 font-sans bg-gray-100 min-h-screen">
      {/* Logout Button at the Top */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => console.log("Logging out...")}
          className="bg-red-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Top Row Containers */}
      <div className="flex gap-8 mb-6">
        <div className="flex-1 bg-gray-200 p-6 text-center font-semibold rounded-lg shadow-md">
          Manage Batches
        </div>
        <div className="flex-1 bg-gray-200 p-6 text-center font-semibold rounded-lg shadow-md">
          Manage Classes
        </div>
      </div>

      {/* Dropdowns and Add Day Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <select className="p-2 rounded-md border border-gray-300 shadow-md focus:ring-2 focus:ring-blue-500">
            <option>Select Option 1</option>
          </select>
          <select className="p-2 rounded-md border border-gray-300 shadow-md focus:ring-2 focus:ring-blue-500">
            <option>Select Option 2</option>
          </select>
        </div>
        <button className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition">
          Add Day
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex gap-4 mb-6 items-center">
        <select className="p-2 rounded-md border border-gray-300 shadow-md focus:ring-2 focus:ring-green-500">
          <option>Filter 1</option>
        </select>
        <select className="p-2 rounded-md border border-gray-300 shadow-md focus:ring-2 focus:ring-green-500">
          <option>Filter 2</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          className="p-2 flex-1 rounded-md border border-gray-300 shadow-md focus:ring-2 focus:ring-gray-500"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition flex items-center gap-2"
        >
          <Plus size={20} />
          Add Student
        </button>
      </div>

      {/* Rows of Data */}
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0"
          >
            <span className="text-gray-700">{row.name}</span>
            <span className="text-gray-500">{row.roll}</span>
            <span className="text-green-600">{row.percentage}</span>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition">
              Show More
            </button>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {rows.length < nextRowStart && (
        <div className="text-center mt-6">
          <button
            onClick={handleShowMore}
            className="bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-700 transition"
          >
            Show More
          </button>
        </div>
      )}

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddStudent={handleAddStudent}
      />
    </div>
  );
};

export default Dashboard;
