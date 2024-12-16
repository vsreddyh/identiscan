const {students}=require("../Schema.js");
const moment = require('moment'); // To handle date calculations, if needed for active days

const getStudents = async (req, res) => {
    try {
    // Destructure the request body for filter criteria and sorting
    const { batch_id, class_id, sorting, count } = req.query;

    // Build the filter query object dynamically
    let filter = {};

    if (batch_id) {
      filter.batch = batch_id;
    }
    if (class_id) {
      filter.class = class_id;
    }
    const sortOptions = sorting
    ? { [sorting.column]: sorting.order === "1" ? 1 : sorting.order === "-1" ? -1 : 0 }
    : {};

    // Set default count (limit) if no count is provided
    const limit = count ? parseInt(count) : 10; // default to 10 students if no count specified
    // Query the students collection based on filters, sorting, and pagination (limit)
    const studentList = await students
    .find(filter)
    .sort(sortOptions)
    .limit(limit)
    .select("studentName rollNumber percentage");

    if (studentList.length === 0) {
        return res.status(404).json({ message: "No students found matching the criteria." });
    }
    // Map the result to only include the necessary fields (id, name, roll number, percentage)
    const result = studentList.map(student => ({
        student_id: student._id,
        studentName: student.studentName,
        rollNumber: student.rollNumber,
        percentage: student.percentage,
    }));

    // Return the result
    res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to fetch student data." });
    }
};

const addStudent = async (req, res) => {
    // Destructure the request body to get the necessary information
    const { classId, rollNumber, studentName, photo } = req.body;
    // Validate the required fields
    if (!classId || !rollNumber || !studentName || !photo) {
        return res.status(400).json({
        message: "class _id, roll number, student name, and photo are required",
        });
    }  
    try {
        // Create a new student document
        const newStudent = new Student({
          class: classId,
          rollNumber,
          studentName,
          photo,
          percentage: 0, // You can set the percentage to 0 or calculate it based on other data
          noOfPresentDays: 0, // Initialize noOfPresentDays or set as needed
        });
    
        // Save the new student to the database
        const savedStudent = await newStudent.save();
        // Respond with the saved student data (excluding sensitive fields)
        res.status(201).json({
            message: "Student added successfully",
            student: savedStudent,
        });
    } catch (error) {
        // Handle errors that might occur during the save process
        res.status(500).json({
          message: "Error adding student",
          error: error.message,
        });
    }
};



const getStudentInfo = async (req, res) => {
  const { rollNumber, studentId } = req.query;  // Get the rollNumber or studentId from query parameters

  // Validate that either rollNumber or studentId is provided
  if (!rollNumber && !studentId) {
    return res.status(400).json({
      message: "Either rollNumber or studentId must be provided",
    });
  }

  try {
    // Find student based on either rollNumber or studentId
    let student;
    if (rollNumber) {
      student = await Student.findOne({ rollNumber }).populate('class batch');
    } else if (studentId) {
      student = await Student.findById(studentId).populate('class batch');
    }

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Calculate total days (for example, based on the current date and attendance records)
    const totalDays = 180;  // Assuming 180 days in a semester, replace with actual logic

    // Calculate the last 14 days active status (could depend on attendance or activity logs)
    const last14ActiveDays = []; // Assume we fetch activity logs or attendance records to determine this

    // Example of populating last14ActiveDays based on attendance records (you should adapt this logic)
    const attendanceRecords = await Attendance.find({
      student: student._id,
      date: { $gte: moment().subtract(14, 'days').toDate() },
    });

    // Iterate through the attendance records to get the active status for the last 14 days
    attendanceRecords.forEach(record => {
      if (moment(record.date).isBetween(moment().subtract(14, 'days'), moment())) {
        last14ActiveDays.push(record.isPresent); // Assuming `isPresent` is a boolean
      }
    });

    // Return the student info
    res.status(200).json({
      studentName: student.studentName,
      class: student.class ? student.class.className : "N/A",  // Assuming the class has a className field
      batch: student.batch ? student.batch.batch : "N/A",  // Assuming the batch has a batch field
      rollNumber: student.rollNumber,
      percentage: student.percentage,
      noOfPresentDays: student.noOfPresentDays,
      totalDays: totalDays,
      last14ActiveDays: last14ActiveDays,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching student info",
      error: error.message,
    });
  }
};
module.exports={
    getStudents,
    addStudent,
    getStudentInfo
}