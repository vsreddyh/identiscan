const { students, records, activeDates, Batches } = require("../Schema.js");
const axios = require("axios");
const mongoose = require("mongoose");
const FormData = require("form-data");

const checkRoll = async (req, res) => {
  try {
    const { rollNumber } = req.query;
    console.log(rollNumber);
    if (!rollNumber) {
      return res
        .status(400)
        .json({ error: "rollNumber is required in query." });
    }

    // Find the student with the given roll number
    const student = await students.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeDate = await activeDates.findOne({
      date: today,
      batch: student.batch,
      class: student.class,
    });

    if (!activeDate) {
      return res
        .status(404)
        .json({ error: "No active date found for the student." });
    }

    // Return success if all checks pass
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

const compareStudentPhoto = async (req, res) => {
  try {
    // Get the roll number and uploaded photo
    const { rollNumber } = req.body;
    const image1 = req.files?.photo; // express-fileupload provides this

    if (!rollNumber || !image1) {
      return res.status(400).json({
        message: "Roll number and photo are required",
      });
    }

    // Find student by roll number
    const student = await students.findOne({ rollNumber });
    if (!student || !student.photo) {
      return res.status(404).json({
        message: "Student or student photo not found",
      });
    }

    // Get the stored photo as a buffer
    const image2Response = await axios.get(
      `http://localhost:5000/admin/students/photo/${student.photo}`,
      { responseType: "arraybuffer" },
    );

    // Create FormData instance
    const formData = new FormData();

    // Append image1 (the uploaded file)
    formData.append("image1", image1.data, {
      filename: image1.name,
      contentType: image1.mimetype,
    });

    // Append image2 (the retrieved photo)
    formData.append("image2", Buffer.from(image2Response.data), {
      filename: "stored-photo.jpg",
      contentType: image2Response.headers["content-type"],
    });

    // Send both photos to Flask endpoint
    const flaskResponse = await axios.post(
      `https://5105-2409-40f0-103b-db44-14a9-8712-b489-bcf0.ngrok-free.app/compare`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      },
    );

    if (!flaskResponse.data.face_recognition.success) {
      console.log(flaskResponse.data);
      return res
        .status(400)
        .json({ message: flaskResponse.data.face_recognition.error });
    }
    if (flaskResponse.data.face_recognition.result == "DIFFERENT PEOPLE") {
      console.log(flaskResponse.data);
      return res.status(400).json({ message: "Face didn't match. Try Again" });
    }
    console.log(flaskResponse.data);

    // Get current date and time
    let now = new Date();
    const currentHour = now.getHours();
    const currentDate = new Date(now.setHours(0, 0, 0, 0));
    now = new Date();

    // Check for existing record for today
    const existingRecord = await records.findOne({
      student: student._id,
      date: currentDate,
    });

    // Check if it's before or after 12:00
    if (currentHour < 12) {
      // Check for duplicate check-in
      if (existingRecord && existingRecord.inTime) {
        return res.status(400).json({
          message: "Already checked in for today",
          inTime: existingRecord.inTime,
        });
      }

      // Create new attendance record
      const newRecord = new records({
        student: student._id,
        batch: student.batch,
        date: currentDate,
        inTime: now,
      });
      await newRecord.save();

      return res.json({
        ...flaskResponse.data,
        message: "Attendance marked successfully",
        inTime: now,
      });
    } else {
      // Check if record exists
      if (!existingRecord) {
        return res.status(400).json({
          message: "No check-in record found for today",
        });
      }

      // Check for duplicate check-out
      if (existingRecord.outTime) {
        return res.status(400).json({
          message: "Already checked out for today",
          outTime: existingRecord.outTime,
        });
      }

      // Calculate hours difference
      const hoursDiff = (now - existingRecord.inTime) / (1000 * 60 * 60);

      if (hoursDiff < 6) {
        const remainingHours = Math.ceil(6 - hoursDiff);
        const remainingMinutes = Math.ceil((6 - hoursDiff) * 60);
        return res.status(400).json({
          message: `Wait for another ${remainingHours} hours and ${remainingMinutes % 60} minutes before checking out`,
        });
      }

      // Update record with out time
      existingRecord.outTime = now;
      await existingRecord.save();

      // Increment present days and update percentage
      const batch = await Batches.findById(student.batch);

      // Get total active days
      const totalActiveDays = await activeDates.countDocuments({
        batch: student.batch,
        year: batch.year,
        class: student.class,
      });

      // Update student record
      const updatedStudent = await students.findByIdAndUpdate(
        student._id,
        {
          $inc: { noOfPresentDays: 1 },
          $set: {
            percentage: ((student.noOfPresentDays + 1) / totalActiveDays) * 100,
          },
        },
        { new: true },
      );

      return res.json({
        ...flaskResponse.data,
        message: "Checkout successful",
        attendance: updatedStudent.percentage,
        outTime: now,
      });
    }
  } catch (error) {
    console.error("Error in photo comparison:", error);
    return res.status(500).json({
      message: "Error processing photo comparison",
      error: error.message,
    });
  }
};

module.exports = {
  checkRoll,
  compareStudentPhoto,
};
