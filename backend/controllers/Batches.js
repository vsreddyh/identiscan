const { Batches, students, activeDates, records } = require("../Schema.js");

const getBatch = async (req, res) => {
  try {
    const search = req.params.batch || "";
    const filter = search ? { batch: { $regex: search, $options: "i" } } : {};

    // Fetch current year
    const currentYear = new Date().getFullYear();

    // Fetch all batches from the database
    const allBatches = await Batches.find(filter);

    // Map batches to include their status
    const response = allBatches.map((b) => ({
      id: b._id,
      name: b.batch,
      year: b.year,
      status: b.status ? "Active" : "Inactive",
    }));

    // Respond with the array of batches and current year
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({
      message: "Failed to retrieve batches",
    });
  }
};

const getActiveBatch = async (req, res) => {
  try {
    // Fetch all batches from the database
    const allBatches = await Batches.find({ status: true });

    // Map batches to include their status
    const response = allBatches.map((b) => ({
      id: b._id,
      name: b.batch,
      year: b.year,
      status: b.status ? "Active" : "Inactive",
    }));

    // Respond with the array of batches and current year
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({
      message: "Failed to retrieve batches",
    });
  }
};

const addBatch = async (req, res) => {
  const { batch, year } = req.body;
  if (!batch || !year) {
    return res.status(400).json({
      message: "Batch name and year are required to add a new batch.",
    });
  }
  try {
    // Add the new batch to the database
    const newBatch = await Batches.create({ batch, year, status: true });

    // Fetch all batches
    const batches = await Batches.find({});
    // Map batches to include their status
    const response = batches.map((b) => ({
      id: b._id,
      name: b.batch,
      year: b.year,
      status: b.status ? "Active" : "Inactive",
    }));
    // Respond with the array of batches
    res.status(200).json(response);
  } catch (error) {
    console.error("Error adding batch:", error);
    res.status(500).json({
      message: "Failed to add batch",
    });
  }
};

const deleteBatch = async (req, res) => {
  try {
    // Extract batch _id from request params
    const { id } = req.params;

    // Find the batch by its _id
    const batchToDelete = await Batches.findById(id);

    // If batch doesn't exist, send a 404 error
    if (!batchToDelete) {
      return res.status(404).json({ message: "Batch not found." });
    }

    // Delete the batch by _id
    // await Batches.deleteOne({ _id: id });
    await batchToDelete.deleteOne();

    // Get the updated list of batches
    const batches = await Batches.find({});
    const response = batches.map((b) => ({
      id: b._id,
      name: b.batch,
      year: b.year,
      status: b.status ? "Active" : "Inactive",
    }));
    // Return the updated array of batches
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Unable to delete the batch." });
  }
};

const deactivateBatch = async (req, res) => {
  try {
    const { id } = req.params;

    const batchToDeactivate = await Batches.findById(id);

    if (!batchToDeactivate) {
      return res.status(404).json("Batch not found.");
    }

    batchToDeactivate.status = false;
    await batchToDeactivate.save();

    const batches = await Batches.find({});
    const response = batches.map((b) => ({
      id: b._id,
      name: b.batch,
      year: b.year,
      status: b.status ? "Active" : "Inactive",
    }));
    res.status(200).json(response);
  } catch (error) {
    // Internal server error if deactivation fails
    res.status(500).json("Unable to deactivate the batch.");
  }
};

const promoteBatch = async (req, res) => {
  try {
    const { id } = req.params;

    const batchToPromote = await Batches.findById(id);

    if (!batchToPromote) {
      return res.status(404).json("Batch not found.");
    }

    if (batchToPromote.status == false) {
      return res.status(400).json("Batch is Inactive.");
    }

    batchToPromote.year = batchToPromote.year + 1;
    await batchToPromote.save();
    await activeDates.deleteMany({ batch: id });
    await records.deleteMany({ batch: id });
    await students.updateMany(
      { batch: id },
      { $set: { noOfPresentDays: 0, percentage: 0 } },
    );

    // Get the updated list of batches
    const batches = await Batches.find({});
    const response = batches.map((b) => ({
      id: b._id,
      name: b.batch,
      year: b.year,
      status: b.status ? "Active" : "Inactive",
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in promoteBatch:", error);
    res.status(500).json("Unable to promote the batch.");
  }
};

module.exports = {
  getBatch,
  addBatch,
  deleteBatch,
  deactivateBatch,
  promoteBatch,
  getActiveBatch,
};
