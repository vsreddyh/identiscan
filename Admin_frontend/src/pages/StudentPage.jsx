import React from "react";
import { UserCircle2, CalendarDays, Trophy, Award } from "lucide-react";

const StudentPage = () => {
  // Sample Student Data
  const studentData = {
    photoUrl: "/api/placeholder/300/300",
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
        {/* Profile Section */}
        <div className="bg-blue-600 text-white p-6 flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full border-4 border-white mb-4 overflow-hidden shadow-lg">
            <img
              src="Identiscan.png"
              alt={`${studentData.name}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold">{studentData.name}</h2>
          <div className="text-sm opacity-80 space-y-1 mt-2">
            <p>Roll No: {studentData.rollNo}</p>
            <p>Class: {studentData.studentClass}</p>
            <p>Batch: {studentData.batch}</p>
          </div>
        </div>

        {/* Performance Section */}
        <div className="p-6 space-y-6">
          {/* Attendance Percentage */}
          <div className="bg-blue-50 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Trophy className="text-blue-600" size={24} />
                <span className="font-semibold text-gray-700">Attendance</span>
              </div>
              <span className="text-xl font-bold text-blue-600">
                {studentData.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${studentData.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Attendance Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4 shadow-md flex items-center space-x-3">
              <CalendarDays className="text-green-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Present Days</p>
                <p className="font-bold text-green-600">
                  {studentData.presentDays}
                </p>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 shadow-md flex items-center space-x-3">
              <CalendarDays className="text-red-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Total Days</p>
                <p className="font-bold text-red-600">
                  {studentData.totalDays}
                </p>
              </div>
            </div>
          </div>

          {/* Attendance History */}
          <div className="bg-gray-50 rounded-xl p-4 shadow-md">
            <div className="flex items-center space-x-2 mb-3">
              <Award className="text-purple-600" size={24} />
              <h3 className="font-semibold text-gray-700">
                14 Days Attendance
              </h3>
            </div>
            <div className="flex space-x-2 justify-center">
              {studentData.attendanceHistory.map((isPresent, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full 
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
  );
};

export default StudentPage;
