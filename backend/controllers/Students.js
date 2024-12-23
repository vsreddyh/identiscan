const { students } = require("../Schema.js");
const mongoose = require("mongoose");
const moment = require("moment"); // To handle date calculations, if needed for active days
let bucket;
mongoose.connection.once("open", () => {
  bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "photos",
  });
});

const getStudents = async (req, res) => {
  try {
    // Destructure the query parameters for search criteria and count
    const { batch_id, class_id, count, search } = req.query;

    // Build the filter query dynamically
    let filter = {};

    if (batch_id) {
      filter.batch = batch_id;
    }
    if (class_id) {
      filter.class = class_id;
    }

    // Add search criteria for studentName or rollNumber
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: "i" } }, // Case-insensitive search in studentName
        { rollNumber: { $regex: search, $options: "i" } }, // Case-insensitive search in rollNumber
      ];
    }

    // Set default count (limit) if no count is provided
    const limit = count ? parseInt(count) : 10; // default to 10 students if no count specified

    // Query the students collection based on filters and pagination (limit)
    const studentList = await students
      .find(filter)
      .limit(limit)
      .select("studentName rollNumber percentage");

    // Handle case when no students are found
    if (studentList.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found matching the criteria." });
    }

    // Map the result to only include the necessary fields
    const result = studentList.map((student) => ({
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
  const { classId, rollNumber, studentName } = req.body;

  if (!classId || !rollNumber || !studentName) {
    return res.status(400).json({
      message: "class _id, roll number, and student name are required",
    });
  }

  if (!req.files || !req.files.photo) {
    return res.status(400).json({
      message: "Photo is required",
    });
  }

  let uploadedFileId = null;

  try {
    // Create a unique filename using rollNumber and timestamp
    const filename = `${rollNumber}-${Date.now()}`;

    // Create upload stream
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.files.photo.mimetype,
    });

    // Get the file id
    uploadedFileId = uploadStream.id;

    // Convert buffer to stream and pipe to GridFS
    const bufferStream = require("stream").Readable.from(req.files.photo.data);

    // Wait for the upload to complete
    await new Promise((resolve, reject) => {
      bufferStream.pipe(uploadStream).on("error", reject).on("finish", resolve);
    });

    // Create new student with the file ID
    const newStudent = new students({
      class: classId,
      rollNumber,
      studentName,
      photo: uploadedFileId,
      percentage: 0,
      noOfPresentDays: 0,
    });

    // Save the student
    const savedStudent = await newStudent.save();

    res.status(201).json({
      message: "Student added successfully",
      student: savedStudent,
    });
  } catch (error) {
    // If an error occurs and we have already started uploading the file,
    // clean it up
    if (uploadedFileId) {
      try {
        await bucket.delete(uploadedFileId);
      } catch (deleteError) {
        console.error("Error deleting file:", deleteError);
      }
    }
    console.log(error);

    res.status(500).json({
      message: "Error adding student",
      error: error.message,
    });
  }
};

// Helper function to get photo
const getStudentPhoto = async (req, res) => {
  try {
    const photoId = new mongoose.Types.ObjectId(req.params.photoId);

    // Create download stream
    const downloadStream = bucket.openDownloadStream(photoId);

    // Set proper content type header
    const file = await bucket.find({ _id: photoId }).next();
    if (!file) {
      return res.status(404).json({ message: "Photo not found" });
    }

    res.set("Content-Type", file.contentType);

    // Pipe the file to response
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving photo",
      error: error.message,
    });
  }
};

const getStudentInfo = async (req, res) => {
  const { rollNumber, studentId } = req.query; // Get the rollNumber or studentId from query parameters

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
      student = await Student.findOne({ rollNumber }).populate("class batch");
    } else if (studentId) {
      student = await Student.findById(studentId).populate("class batch");
    }

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Calculate total days (for example, based on the current date and attendance records)
    const totalDays = 180; // Assuming 180 days in a semester, replace with actual logic

    // Calculate the last 14 days active status (could depend on attendance or activity logs)
    const last14ActiveDays = []; // Assume we fetch activity logs or attendance records to determine this

    // Example of populating last14ActiveDays based on attendance records (you should adapt this logic)
    const attendanceRecords = await Attendance.find({
      student: student._id,
      date: { $gte: moment().subtract(14, "days").toDate() },
    });

    // Iterate through the attendance records to get the active status for the last 14 days
    attendanceRecords.forEach((record) => {
      if (
        moment(record.date).isBetween(moment().subtract(14, "days"), moment())
      ) {
        last14ActiveDays.push(record.isPresent); // Assuming `isPresent` is a boolean
      }
    });

    // Return the student info
    res.status(200).json({
      studentName: student.studentName,
      class: student.class ? student.class.className : "N/A", // Assuming the class has a className field
      batch: student.batch ? student.batch.batch : "N/A", // Assuming the batch has a batch field
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
module.exports = {
  getStudents,
  addStudent,
  getStudentInfo,
  getStudentPhoto,
};
