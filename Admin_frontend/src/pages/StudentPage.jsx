import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Award, Calendar, Trophy } from "lucide-react";

const StudentPage = () => {
  // Sample Student Data
  const { id } = useParams();
  const [studentData, setStudentData] = useState({
    photo: "Person.jpg",
    name: "Emma Rodriguez",
    rollNo: "ST-2024-0567",
    studentClass: "12th Science",
    batch: "2023-2024",
    percentage: 87.5,
    presentDays: 175,
    totalDays: 200,
    attendanceHistory: [
      true,
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      true,
      true,
    ],
  });
  const navigate = useNavigate();
  const getStudent = (id) => {
    id = id || "";
    axios
      .get(
        `${import.meta.env.VITE_SERVER}/admin/getStudentInfo/?studentId=${id}`,
      )
      .then((response) => {
        setStudentData(response.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getStudent(id);
  }, []);
  return (
    <div className="min-h-screen bg-slate-100 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm 
        rounded-full p-2 shadow-md hover:bg-white transition-all 
        hover:shadow-lg group"
      >
        <ArrowLeft
          className="text-slate-700 group-hover:text-blue-600 
          transition-colors"
          size={24}
        />
      </button>

      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Profile Card */}
        <div
          className="bg-white rounded-2xl shadow-2xl overflow-hidden 
        ring-4 ring-white/50 transform transition-all duration-300 
        hover:scale-[1.02]"
        >
          {/* Header with Profile Photo */}
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-400 
          text-white p-6 flex flex-col items-center relative"
          >
            <div
              className="w-32 h-32 rounded-full border-4 border-white 
            shadow-xl overflow-hidden mb-4"
            >
              <img
                src={`${import.meta.env.VITE_SERVER}/admin/students/photo/${studentData.photo}`}
                alt={`${studentData.name}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-center">
              {studentData.name}
            </h2>
            <div className="text-sm opacity-80 text-center mt-2 space-y-1">
              <p>Roll No: {studentData.rollNo}</p>
              <p>Class: {studentData.StudentClass}</p>
              <p>Batch: {studentData.batch}</p>
            </div>
          </div>

          {/* Performance Sections */}
          <div className="p-6 space-y-5">
            {/* Attendance Percentage */}
            <div className="bg-slate-50 rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Trophy className="text-blue-600" size={24} />
                  <span className="font-semibold text-slate-700">
                    Attendance
                  </span>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  {studentData.percentage}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${studentData.percentage}%` }}
                />
              </div>
            </div>

            {/* Attendance Details */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className="bg-green-50 rounded-xl p-4 shadow-md 
              flex items-center space-x-3"
              >
                <Calendar className="text-green-600" size={24} />
                <div>
                  <p className="text-sm text-slate-600">Present Days</p>
                  <p className="font-bold text-green-600">
                    {studentData.presentDays}
                  </p>
                </div>
              </div>
              <div
                className="bg-red-50 rounded-xl p-4 shadow-md 
              flex items-center space-x-3"
              >
                <Calendar className="text-red-600" size={24} />
                <div>
                  <p className="text-sm text-slate-600">Total Days</p>
                  <p className="font-bold text-red-600">
                    {studentData.totalDays}
                  </p>
                </div>
              </div>
            </div>

            {/* Attendance History */}
            <div className="bg-slate-50 rounded-xl p-4 shadow-md">
              <div className="flex items-center space-x-2 mb-3">
                <Award className="text-purple-600" size={24} />
                <h3 className="font-semibold text-slate-700">
                  Last 14 Days Attendance
                </h3>
              </div>
              <div className="flex space-x-2 justify-center">
                {studentData.attendanceHistory.map((isPresent, index) => (
                  <div
                    key={index}
                    className={`w-5 h-5 rounded-full 
                      ${
                        isPresent
                          ? "bg-green-500 border-2 border-green-600"
                          : "bg-red-500 border-2 border-red-600"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
