const express = require("express");
const router = express.Router();
const {
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require("./controllers/goalController.js");

router.route("/getAdmin").get(getAdmin);
router.route("/createAdmin").post(createAdmin);
router.route("/updateAdmin/:id").post(updateAdmin);
router.route("/deleteAdmin/:id").post(deleteAdmin);

module.exports = router;
