import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

const AddStudentModal = ({ isOpen, onClose, onAddStudent }) => {
  const [studentData, setStudentData] = useState({
    photo: null,
    photoFile: null,
    name: "",
    rollNumber: "",
  });

  // State for batches and classes
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  // Fetch batches when modal opens
  useEffect(() => {
    if (isOpen) {
      axios
        .get(`${import.meta.env.VITE_SERVER}/admin/getActiveBatch`)
        .then((response) => {
          setBatches(response.data);
        })
        .catch((error) => console.error("Error fetching batches:", error));
    }
  }, [isOpen]);

  // Fetch classes when batch is selected
  useEffect(() => {
    if (selectedBatch) {
      axios
        .get(
          `${import.meta.env.VITE_SERVER}/admin/getClass/${selectedBatch.id}`,
        )
        .then((response) => {
          setClasses(response.data);
        })
        .catch((error) => console.error("Error fetching classes:", error));
    } else {
      setClasses([]);
    }
    setSelectedClass(null); // Reset class selection when batch changes
  }, [selectedBatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStudentData((prev) => ({
        ...prev,
        photoFile: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentData((prev) => ({
          ...prev,
          photo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !studentData.name ||
      !studentData.rollNumber ||
      !studentData.photoFile ||
      !selectedClass
    ) {
      alert(
        "Please fill in all required fields, upload a photo, and select a class",
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("photo", studentData.photoFile);
      formData.append("classId", selectedClass.id);
      formData.append("rollNumber", studentData.rollNumber);
      formData.append("studentName", studentData.name);
      formData.append("batchId", selectedBatch.id);

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/admin/addStudent`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      onAddStudent(response.data.student);

      // Reset form and close modal
      setStudentData({
        photo: null,
        photoFile: null,
        name: "",
        rollNumber: "",
      });
      setSelectedBatch(null);
      setSelectedClass(null);
      onClose();
    } catch (error) {
      console.error("Error adding student:", error);
      alert(error.response?.data?.message || "Error adding student");
    }
  };

  const handleModalClose = () => {
    setStudentData({
      photo: null,
      photoFile: null,
      name: "",
      rollNumber: "",
    });
    setSelectedBatch(null);
    setSelectedClass(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Student</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Upload */}
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photoUpload"
            />
            <label
              htmlFor="photoUpload"
              className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition"
            >
              {studentData.photo ? (
                <img
                  src={studentData.photo}
                  alt="Student"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-gray-500">Upload Photo</span>
              )}
            </label>
          </div>

          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={studentData.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter student name"
            />
          </div>

          {/* Roll Number Input */}
          <div>
            <label
              htmlFor="rollNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Roll Number
            </label>
            <input
              type="text"
              id="rollNumber"
              name="rollNumber"
              value={studentData.rollNumber}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter roll number"
            />
          </div>

          {/* Batch Dropdown */}
          <div>
            <label
              htmlFor="batch"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Batch
            </label>
            <select
              id="batch"
              value={selectedBatch?.id || ""}
              onChange={(e) =>
                setSelectedBatch(batches.find((b) => b.id == e.target.value))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Batch</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Class Dropdown */}
          <div>
            <label
              htmlFor="class"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Class
            </label>
            <select
              id="class"
              value={selectedClass?.id || ""}
              onChange={(e) =>
                setSelectedClass(classes.find((c) => c.id == e.target.value))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={!selectedBatch}
              required
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
