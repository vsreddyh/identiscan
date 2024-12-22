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
