import React, { useState, useEffect } from "react";
import AddStudentModal from "../components/AddStudentModal";
import axios from "axios";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [nextRowStart, setNextRowStart] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // State for dropdowns
  const [batches1, setBatches1] = useState([]);
  const [batches2, setBatches2] = useState([]);
  const [classes1, setClasses1] = useState([]);
  const [classes2, setClasses2] = useState([]);
  const [selectedBatch1, setSelectedBatch1] = useState(null);
  const [selectedBatch2, setSelectedBatch2] = useState(null);
  const [selectedClass1, setSelectedClass1] = useState(null);
  const [selectedClass2, setSelectedClass2] = useState(null);

  const logout = () => {
    axios
      .post(`${import.meta.env.VITE_SERVER}/admin/logout`)
      .then(() => navigate("/"))
      .catch((err) => {
        console.log(err);
      });
  };
  // Fetch students based on filters
  const fetchStudents = async () => {
    try {
      const params = {
        count: nextRowStart,
        ...(selectedBatch2 && { batch_id: selectedBatch2.id }),
        ...(selectedClass2 && { class_id: selectedClass2.id }),
        ...(searchInput && { search: searchInput }),
      };

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/admin/getStudents`,
        { params },
      );

      const formattedRows = response.data.map((student) => ({
        id: student.student_id,
        name: student.studentName,
        roll: student.rollNumber,
        percentage: `${student.percentage}%`,
      }));

      setRows(formattedRows);
    } catch (error) {
      console.error("Error fetching students:", error);
      setRows([]);
    }
  };

  // Fetch students whenever filters change
  useEffect(() => {
    fetchStudents();
  }, [selectedBatch2, selectedClass2, searchInput, nextRowStart]);

  // Fetch batches
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER}/admin/getActiveBatch`)
      .then((response) => {
        setBatches1(response.data);
        setBatches2(response.data);
      })
      .catch((error) => console.error("Error fetching batches:", error));
  }, []);

  // Fetch classes for first batch
  useEffect(() => {
    if (selectedBatch1) {
      axios
        .get(
          `${import.meta.env.VITE_SERVER}/admin/getClass/${selectedBatch1.id}`,
        )
        .then((response) => setClasses1(response.data))
        .catch((error) =>
          console.error("Error fetching classes for batch 1:", error),
        );
    } else {
      setClasses1([]);
    }
  }, [selectedBatch1]);

  // Fetch classes for second batch
  useEffect(() => {
    if (selectedBatch2) {
      axios
        .get(
          `${import.meta.env.VITE_SERVER}/admin/getClass/${selectedBatch2.id}`,
        )
        .then((response) => setClasses2(response.data))
        .catch((error) =>
          console.error("Error fetching classes for batch 2:", error),
        );
    } else {
      setClasses2([]);
    }
  }, [selectedBatch2]);

  const addDay = () => {
    const body = {
      classId: null,
      batchId: null,
    };
    if (selectedBatch1 != null) {
      body.batchId = selectedBatch1.id;
    }
    if (selectedClass1 != null) {
      body.classId = selectedClass1.id;
    }
    axios
      .post(`${import.meta.env.VITE_SERVER}/admin/activateToday`, body)
      .then(() => alert("Added today"))
      .catch((error) =>
        console.error("Error activating day for class 1:", error),
      );
  };

  const handleShowMore = () => {
    setNextRowStart((prevCount) => prevCount + 10);
  };

  const handleAddStudent = (newStudent) => {
    // Refresh the student list after adding a new student
    fetchStudents();
  };

  return (
    <div className="p-6 font-sans bg-gray-100 min-h-screen">
      {/* Logout Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={logout}
          className="bg-red-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Top Row Containers */}
      <div className="flex gap-8 mb-6">
        <div
          onClick={() => navigate("/manageBatches")}
          className="flex-1 bg-gray-200 p-6 text-center font-semibold rounded-lg shadow-md"
        >
          Manage Batches
        </div>
        <div
          onClick={() => navigate("/manageClasses")}
          className="flex-1 bg-gray-200 p-6 text-center font-semibold rounded-lg shadow-md"
        >
          Manage Classes
        </div>
      </div>

      {/* Dropdowns and Add Day Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <select
            value={selectedBatch1?.id || ""}
            onChange={(e) =>
              setSelectedBatch1(batches1.find((b) => b.id == e.target.value))
            }
            className="p-2 rounded-md border border-gray-300 shadow-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Batches</option>
            {batches1.length > 0 ? (
              batches1.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))
            ) : (
              <option>No Batches Available</option>
            )}
          </select>
          <select
            value={selectedClass1?.id || ""}
            onChange={(e) =>
              setSelectedClass1(classes1.find((c) => c.id == e.target.value))
            }
            disabled={!selectedBatch1}
            className="p-2 rounded-md border border-gray-300 shadow-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Classes</option>
            {classes1.length > 0 ? (
              classes1.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))
            ) : (
              <option>
                {selectedBatch1
                  ? "No Classes Available"
                  : "Select a Batch First"}
              </option>
            )}
          </select>
        </div>
        <button
          onClick={addDay}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Add Day
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <select
            value={selectedBatch2?.id || ""}
            onChange={(e) =>
              setSelectedBatch2(batches2.find((b) => b.id == e.target.value))
            }
            className="p-2 rounded-md border border-gray-300 shadow-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Batches</option>
            {batches2.length > 0 ? (
              batches2.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))
            ) : (
              <option>No Batches Available</option>
            )}
          </select>
          <select
            value={selectedClass2?.id || ""}
            onChange={(e) =>
              setSelectedClass2(classes2.find((c) => c.id == e.target.value))
            }
            disabled={!selectedBatch2}
            className="p-2 rounded-md border border-gray-300 shadow-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Classes</option>
            {classes2.length > 0 ? (
              classes2.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))
            ) : (
              <option>
                {selectedBatch2
                  ? "No Classes Available"
                  : "Select a Batch First"}
              </option>
            )}
          </select>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
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
        {rows.length > 0 ? (
          rows.map((row) => (
            <div
              key={row.id}
              className="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0"
            >
              <span className="text-gray-700">{row.name}</span>
              <span className="text-gray-500">{row.roll}</span>
              <span className="text-green-600">{row.percentage}</span>
              <button
                onClick={() => {
                  navigate(`/student/${row.id}`);
                }}
                className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition"
              >
                Show More
              </button>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No students found matching the criteria
          </div>
        )}
      </div>

      {/* Show More Button */}
      <div className="text-center mt-6">
        <button
          onClick={handleShowMore}
          className="bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-700 transition"
        >
          Show More Students
        </button>
      </div>

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
