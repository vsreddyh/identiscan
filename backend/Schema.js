const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
url = process.env.url;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

const studentSchema = new mongoose.Schema(
  {
    studentName: String,
    rollNumber: String,
    class: ObjectId,
    batch: ObjectId,
    percentage: Number,
    noOfPresentDays: Number,
    photo: ObjectId,
  },
  { versionKey: false },
);

const adminSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    master: Boolean, //If true can create admins
    loggedIn: Boolean,
  },
  { versionKey: false },
);

const recordSchema = new mongoose.Schema(
  {
    student: ObjectId,
    batch: ObjectId,
    date: Date,
    inTime: Date,
    outTime: Date,
  },
  { versionKey: false },
);

const dateSchema = new mongoose.Schema(
  {
    date: Date,
    batch: ObjectId,
    year: Number,
    class: ObjectId,
  },
  { versionKey: false },
);

const batchSchema = new mongoose.Schema(
  {
    batch: String,
    year: Number,
    status: Boolean,
  },
  { versionKey: false },
);

batchSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    const batchId = this._id; // Access the current batch's ID

    // Find and delete all classes associated with the batch
    await mongoose.model("Classes").deleteMany({ batch: batchId });
    console.log(`Classes associated with batch ${batchId} have been deleted.`);
    next(); // Proceed with deleting the batch
  } catch (err) {
    console.error("Error while deleting associated classes:", err);
    next(err); // Pass the error to the next middleware
  }
});

const classSchema = new mongoose.Schema(
  {
    className: String,
    batch: ObjectId,
  },
  { versionKey: false },
);

const students = mongoose.model("students", studentSchema);
const admins = mongoose.model("admins", adminSchema);
const records = mongoose.model("records", recordSchema);
const activeDates = mongoose.model("dates", dateSchema);
const Batches = mongoose.model("Batches", batchSchema);
const classes = mongoose.model("Classes", classSchema);

module.exports = {
  EMAIL: process.env.EMAIL,
  PASSWORD: process.env.PASSWORD,
  JWT_SECRET: process.env.JWT_SECRET,
  SESSION_KEY: process.env.SESSION_KEY,
  students: students,
  admins: admins,
  records: records,
  activeDates: activeDates,
  Batches: Batches,
  classes: classes,
};
