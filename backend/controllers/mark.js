const { students, records, activeDates } = require("../Schema.js");
const axios = require('axios');
const mongoose = require('mongoose');
mongoose.connection.once("open", () => {
  bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "photos",
  });
});

const checkRoll = async (req, res) => {
  try {
    const { rollNumber } = req.query;

    if (!rollNumber) {
      return res.status(400).json({ error: "rollNumber is required in query." });
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
      year: today.getFullYear(),
      class: student.class,
    });

    if (!activeDate) {
      return res.status(404).json({ error: "No active date found for the student." });
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
    // Get the roll number and uploaded photo from request
    const { rollNumber } = req.body;
    const uploadedPhoto = req.body; // Assuming you're using multer or similar middleware

    if (!rollNumber || !uploadedPhoto) {
      return res.status(400).json({
        message: "Roll number and photo are required"
      });
    }

    // Find student by roll number
    const student = await students.findOne({ rollNumber });
    
    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    // Get the stored photo from GridFS
    const photoId = new mongoose.Types.ObjectId(student.photo);
    const file = await bucket.find({ _id: photoId }).next();
    
    if (!file) {
      return res.status(404).json({
        message: "Stored photo not found"
      });
    }

    // Get stored photo buffer
    const chunks = [];
    const downloadStream = bucket.openDownloadStream(photoId);
    
    await new Promise((resolve, reject) => {
      downloadStream.on('data', chunk => chunks.push(chunk));
      downloadStream.on('error', reject);
      downloadStream.on('end', resolve);
    });

    const storedPhotoBuffer = Buffer.concat(chunks);

    // Prepare form data for Flask endpoint
    const formData = new FormData();
    formData.append('uploaded_photo', uploadedPhoto.buffer, {
      filename: uploadedPhoto.originalname,
      contentType: uploadedPhoto.mimetype
    });
    formData.append('stored_photo', storedPhotoBuffer, {
      filename: file.filename,
      contentType: file.contentType
    });

    // Send both photos to Flask endpoint
    const flaskResponse = await axios.post(
      process.env.flask+ '/compare',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    // Return the comparison result
    return res.json(flaskResponse.data);

  } catch (error) {
    console.error('Error in photo comparison:', error);
    return res.status(500).json({
      message: "Error processing photo comparison",
      error: error.message
    });
  }
};


module.exports={
checkRoll,
compareStudentPhoto
}
