const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const { url } = dotenv.config();
const fileUpload = require("express-fileupload");
// Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;
app.use(fileUpload());
// MongoDB Connection
mongoose
  .connect(process.env.url)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// MongoDB Session Store
const store = new MongoDBStore({
  uri: process.env.url,
  collection: "sessions",
});

store.on("error", (error) => {
  console.error("Session store error:", error);
});

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to the Express Starter App!");
});

app.use("/admin", require("./route.js"));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
