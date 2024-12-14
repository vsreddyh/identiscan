const {Batches} = require("../Schema.js");
const getBatch = async (req, res) => {
  try {
    // Fetch current year
    const currentYear = new Date().getFullYear();

    // Fetch all batches from the database
    const allBatches = await Batches.find({}, { batch: 1, year: 1, _id: 1 });

    // Map batches to include their status
    const response = allBatches.map((b) => ({
      _id: b._id,
      batch: b.batch,
      year: b.year,
      status: b.year === currentYear ? "current" : "past",
    }));

    // Respond with the array of batches and current year
    res.status(200).json({
      currentYear,
      batches: response,
    });
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({
      message: "Failed to retrieve batches",
    });
  }
};




const addBatch=async (req,res)=>{
    const { batch, year } = req.body;
    if (!batch || !year) {
        return res.status(400).json({
          message: "Batch name and year are required to add a new batch.",
        });
    }
    try {
        // Add the new batch to the database
        const newBatch = await Batches.create({ batch, year });

        // Fetch the current year
        const currentYear = new Date().getFullYear();

        // Fetch all batches
        const batches = await Batches.find({}, { batch: 1, year: 1, _id: 1 });
        // Map batches to include their status
        const response = batches.map((b) => {
            return {
            _id: b._id,
            batch: b.batch,
            year: b.year,
            status: b.year === currentYear ? "current" : "past",
            };
        });
        // Respond with the array of batches
        res.status(200).json({
            currentYear,
            batches: response,
        });
    }catch (error) {
        console.error("Error adding batch:", error);
        res.status(500).json({
          message: "Failed to add batch",
        });
    }
}

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
    await Batches.deleteOne({ _id: id });

    // Get the updated list of batches
    const batches = await Batches.find({}, { batch: 1, year: 1, _id: 1, status: 1 });

    // Return the updated array of batches
    res.status(200).json({
        message: `Batch with id ${id} deleted successfully.`,
        batches: batches.map(batch => ({
          _id: batch._id,
          batch: batch.batch,
          year: batch.year,
          status: batch.status || "current"  // assuming the status is "current" if not specified
        })),
      });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete the batch." });
  }
};

const deactivateBatch = async (req, res) => {
  try {
    // Extract batch _id from request parameters
    const { id } = req.params;

    // Find the batch by its _id
    const batchToDeactivate = await Batches.findById(id);

    // If batch doesn't exist, send a 404 error
    if (!batchToDeactivate) {
      return res.status(404).json({ message: "Batch not found." });
    }

    // Update the status of the batch to "inactive"
    batchToDeactivate.status = "inactive";
    await batchToDeactivate.save();

    // Get the updated list of batches, including the status field
    const batches = await Batches.find({}, { batch: 1, year: 1, _id: 1, status: 1 });

    // Respond with a success message and the updated list of batches
    res.status(200).json({
      message: `Batch with id ${id} deactivated successfully.`,
      batches: batches.map(batch => ({
        _id: batch._id,
        batch: batch.batch,
        year: batch.year,
        status: batch.status || "current"  // assuming the status is "current" if not specified
      })),
    });
  } catch (error) {
    // Internal server error if deactivation fails
    res.status(500).json({ message: "Unable to deactivate the batch." });
  }
};


const promoteBatch = async (req, res) => {
  try {
    // Extract batch _id from request parameters
    const { id } = req.params;

    // Find the batch by its _id
    const batchToPromote = await Batches.findById(id);

    // If batch doesn't exist, send a 404 error
    if (!batchToPromote) {
      return res.status(404).json({ message: "Batch not found." });
    }

    // Check if the batch is already current
    if (batchToPromote.status === "current") {
      return res.status(400).json({ message: "Batch is already current." });
    }

    // Promote the batch by changing its status to "current"
    batchToPromote.status = "current";
    await batchToPromote.save();

    // Get the updated list of batches
    const batches = await Batches.find({}, { batch: 1, year: 1, _id: 1, status: 1 });

    // Respond with a success message and the updated list of batches
    res.status(200).json({
      message: `Batch with id ${id} promoted successfully.`,
      batches: batches.map(batch => ({
        _id: batch._id,
        batch: batch.batch,
        year: batch.year,
        status: batch.status || "current"  // assuming the status is "current" if not specified
      })),
    });
  } catch (error) {
    // Internal server error if promotion fails
    res.status(500).json({ message: "Unable to promote the batch." });
  }
};



module.exports = { getBatch , addBatch, deleteBatch, deactivateBatch, promoteBatch};