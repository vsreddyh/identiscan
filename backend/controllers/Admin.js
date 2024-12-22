const bcrypt = require("bcryptjs");
const { admins } = require("../Schema.js");

const getAdmin = async (req, res) => {
  const model = await admins.find({}, { username: 1, _id: 1 });
  res.status(200).json(model);
};

const createAdmin = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: "username and password are required to create an admin",
    });
  }
  const hash = bcrypt.hash(req.body.password, 10);
  try {
    await admins.create({
      username: req.body.username,
      password: hash,
      master: false,
    });

    const adminList = await admins.find({}, { username: 1, _id: 1 });
    res.status(200).json(adminList);
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(400).json({ message: "Failed to create the admin" });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const hash = bcrypt.hash(req.body.password, 10);
    const adminToUpdate = await admins.findById(req.params.id);
    if (!adminToUpdate) {
      return res.status(404).send("unable to find admin by given id");
    }
    adminToUpdate.password = hash || adminToUpdate.password;
    const updatedAdmin = await adminToUpdate.save();
    res.status(200).json(1);
  } catch (error) {
    res.status(400).json({ message: "unable to update" });
  }
};

const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  const { rootPassword } = req.body;

  if (rootPassword !== "yourrootpassword") {
    return res.status(403).json({ message: "Invalid root password" });
  }

  try {
    // Find the admin to delete
    const adminToDelete = await admins.findById(id);
    if (!adminToDelete) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Delete the admin
    await admins.deleteOne({ _id: id });

    // Fetch updated list of admins
    const adminList = await admins.find({}, { username: 1, _id: 1 });

    res.status(200).json({
      //  message: `Admin with id ${id} and username ${adminToDelete.username} deleted successfully`,
      admins: adminList,
    });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(400).json({ message: "Unable to delete admin" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await admins.findOne({ username: username });
    if (!admin) {
      return res.status(200).json({ message: "Username not found" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(200).json({ message: "Wrong password" });
    }
    res.status(200).json({ message: "Login successful", admin: admin });
  } catch (err) {
    res.status(200).json({ message: "Unable to login. Contact Tech Support" });
  }
};

module.exports = { getAdmin, createAdmin, updateAdmin, deleteAdmin, login };
