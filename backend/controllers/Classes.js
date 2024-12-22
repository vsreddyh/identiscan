const { classes, Batches } = require("../Schema.js");

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
    await classes.deleteOne({ _id: classId });

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
    const { classIds, batchIds } = req.body;

    // Validate that both classIds and batchIds are provided
    if (!Array.isArray(classIds) || !Array.isArray(batchIds)) {
      return res
        .status(400)
        .json({ message: "classIds and batchIds should be arrays." });
    }

    // Update classes to mark them as 'today' (active) if class_id is in classIds and batch_id is in batchIds
    const updatedClasses = await classes.updateMany(
      {
        _id: { $in: classIds },
        batch: { $in: batchIds },
      },
      { $set: { status: "today" } },
    );

    // Check if any classes were updated
    if (updatedClasses.modifiedCount === 0) {
      return res.status(400).json({ message: "No classes were activated." });
    }

    // Return success status
    res.status(200).json({ status: 1 });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Unable to activate classes today." });
  }
};

module.exports = { getClass, addClass, deleteClass, activateToday };
