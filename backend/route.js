const express = require("express");
const router = express.Router();
const {
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  login,
  logout,
} = require("./controllers/Admin.js");

const {
  getBatch,
  getActiveBatch,
  addBatch,
  deleteBatch,
  deactivateBatch,
  promoteBatch,
} = require("./controllers/Batches.js");

const {
  getClass,
  addClass,
  deleteClass,
  activateToday,
} = require("./controllers/Classes.js");

const {
  getStudents,
  addStudent,
  getStudentPhoto,
  getStudentInfo,
} = require("./controllers/Students.js");

const { compareStudentPhoto, checkRoll } = require("./controllers/mark.js");

router.route("/getAdmins").get(getAdmin);
router.route("/getAdmins/:username").get(getAdmin);
router.route("/createAdmin").post(createAdmin);
router.route("/updateAdmin/:id").post(updateAdmin);
router.route("/deleteAdmin/:id").post(deleteAdmin);
router.route("/login").post(login);
router.route("/logout").post(logout);

router.route("/getBatch").get(getBatch);
router.route("/getActiveBatch").get(getActiveBatch);
router.route("/getBatch/:batch").get(getBatch);
router.route("/addBatch").post(addBatch);
router.route("/deleteBatch/:id").post(deleteBatch);
router.route("/deactivateBatch/:id").post(deactivateBatch);
router.route("/promoteBatch/:id").post(promoteBatch);

router.route("/getClass/:id").get(getClass);
router.route("/addClass").post(addClass);
router.route("/deleteClass/:id").post(deleteClass);
router.route("/activateToday").post(activateToday);

router.route("/getStudents").get(getStudents);
router.route("/addStudent").post(addStudent);
router.get("/students/photo/:photoId", getStudentPhoto);
router.route("/getStudentInfo").get(getStudentInfo);

router.route("/compare").post(compareStudentPhoto);
router.route("/checkRoll").get(checkRoll);

module.exports = router;
