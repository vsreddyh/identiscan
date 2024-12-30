const { classes, Batches, activeDates } = require("../Schema.js");

const getClass = async (req, res) => {
  try {
    // Extract batch _id from request parameters
    const batchId = req.params.id;

    // Find all classes associated with the given batch _id
    const classList = await classes.find(
      { batch: batchId },
      { className: 1, _id: 1 },
    );

    // Respond with the list of classes
    res.status(200).json(
      classList.map((classItem) => ({
        id: classItem._id,
        name: classItem.className,
      })),
    );
  } catch (error) {
    // Internal server error
    res.status(500).json({ message: "Unable to retrieve classes." });
  }
};

const addClass = async (req, res) => {
  try {
    // Extract batch _id and className from request body
    const { batchId, className } = req.body;

    // Validate that both batchId and className are provided
    if (!batchId || !className) {
      return res
        .status(400)
        .json({ message: "Batch ID and class name are required." });
    }

    // Create a new class associated with the batchId
    const newClass = new classes({
      batch: batchId,
      className: className,
    });

    // Save the new class to the database
    await newClass.save();

    // Fetch all classes for the given batchId
    const classList = await classes.find(
      { batch: batchId },
      { className: 1, _id: 1 },
    );

    // Return the updated list of classes
    res.status(201).json(
      classList.map((classItem) => ({
        id: classItem._id,
        name: classItem.className,
      })),
    );
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Unable to add class." });
  }
};

const deleteClass = async (req, res) => {
  try {
    // Extract class _id from request parameters
    const classId = req.params.id;

    // Validate that classId is provided
    if (!classId) {
      return res.status(400).json({ message: "Class ID is required." });
    }

    // Find the class to delete by _id
    const classToDelete = await classes.findById(classId);
    if (!classToDelete) {
      return res.status(404).json({ message: "Class not found." });
    }

    // Delete the class from the database
    // await classes.deleteOne({ _id: classId });
    await classToDelete.deleteOne();

    // Fetch all remaining classes associated with the batch
    const updatedClasses = await classes.find(
      { batch: classToDelete.batch },
      { className: 1, _id: 1 },
    );

    // Return the updated list of classes
    res.status(200).json(
      updatedClasses.map((classItem) => ({
        id: classItem._id,
        name: classItem.className,
      })),
    );
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Unable to delete the class." });
  }
};

const activateToday = async (req, res) => {
  try {
    const { classId, batchId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize the date to midnight
    let newActiveDates = [];

    if (!batchId) {
      // Case: Add all batches and classes to activeDates
      const batches = await Batches.find();
      // Use Promise.all to wait for all async operations
      await Promise.all(
        batches.map(async (batch) => {
          const loc = await classes.find({ batch: batch._id });
          const batchActiveDates = loc.map((cls) => ({
            date: today,
            batch: batch._id,
            year: batch.year,
            class: cls._id,
          }));
          newActiveDates = newActiveDates.concat(batchActiveDates);
        }),
      );

      // Delete all existing documents for today
      await activeDates.deleteMany({
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      });
    } else if (!classId) {
      // Case: Add all classes of the given batch to activeDates
      const batch = await Batches.findById(batchId);
      if (!batch) {
        throw new Error("Batch not found");
      }
      const loc = await classes.find({ batch: batch._id });
      newActiveDates = loc.map((cls) => ({
        date: today,
        batch: batch._id,
        year: batch.year,
        class: cls._id,
      }));

      // Delete existing documents for this batch and date
      await activeDates.deleteMany({
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
        batch: batch._id,
      });
    } else {
      // Case: Add the specific class and batch to activeDates
      const batch = await Batches.findById(batchId);
      if (!batch) {
        throw new Error("Batch not found");
      }
      newActiveDates = [
        {
          date: today,
          batch: batch._id,
          year: batch.year,
          class: classId,
        },
      ];

      // Delete existing document for this specific class, batch, and date
      await activeDates.deleteMany({
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
        batch: batch._id,
        class: classId,
      });
    }

    // Insert the new active dates into the database
    if (newActiveDates.length > 0) {
      await activeDates.insertMany(newActiveDates);
    }

    res.status(200).json({
      success: true,
      message: "Active dates updated successfully.",
      count: newActiveDates.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getClass, addClass, deleteClass, activateToday };
