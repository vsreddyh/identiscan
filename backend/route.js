const express = require("express");
const router = express.Router();
const {
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  login
} = require("./controllers/Admin.js");

const {
  getBatch,
  addBatch,
  deleteBatch,
  deactivateBatch,
  promoteBatch
}=require("./controllers/Batches.js");

const { 
  getClass,
  addClass,
  deleteClass,
  activateToday
} = require("./controllers/Classes.js");

const {
  getStudents,
  addStudent,
  // getStudentInfo
}=require("./controllers/Students.js")

router.route("/getAdmin").get(getAdmin);
router.route("/createAdmin").post(createAdmin);
router.route("/updateAdmin/:id").post(updateAdmin);
router.route("/deleteAdmin/:id").post(deleteAdmin);
router.route("/login").post(login);

router.route("/getBatch").get(getBatch);
router.route("/addBatch").post(addBatch);
router.route("/deleteBatch/:id").post(deleteBatch);
router.route("/deactivateBatch/:id").post(deactivateBatch);
router.route("/promoteBatch/:id").post(promoteBatch);

router.route("/getClass/:id").get(getClass);
router.route("/addClass").post(addClass);
router.route("/deleteClass/:id").get(deleteClass);
router.route("/activateToday").post(activateToday);

router.route("/getStudents").post(getStudents);
router.route("/addStudent").post(addStudent);
// router.route("/").get(getStudentInfo);

module.exports = router;
