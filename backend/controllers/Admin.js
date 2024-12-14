const { admins } = require("../Schema.js");
const getAdmin = async (req, res) => {
  const model = await admin.find();
  res.status(200).json(model);
};

const createAdmin = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: "username and password are required to create an admin",
    });
  }

  try {
    const newAdmin = await admin.create({
      username: req.body.username,
      password: req.body.password,
      master: req.body.master || false,
    });
    res.status(200).json(newAdmin);
  } catch (error) {
    res.status(400).json({ message: "failed to create the admin" });
  }
};

const updateAdmin = async (req, res) => {
  try {
    //TODO
    //req.body.newpassword= new password
    const adminToUpdate = await admin.findById(req.params.id);
    if (!adminToUpdate) {
      return res.status(404).send("unable to find admin by given id");
    }
    adminToUpdate.password = req.body.password || adminToUpdate.password;
    const updatedAdmin = await adminToUpdate.save();
    res.status(200).json(1);
  } catch (error) {
    res.status(400).json({ message: "unable to update" });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const adminTodelete = await admin.findById(req.params.id);
    if (!adminTodelete) {
      return res.status(404).send("admin not found");
    }
    await admin.deleteOne({ _id: req.params.id });
    res.status(200).json({
      //TODO
      //array of admins
      message: `the admin with id ${req.params.id} and username ${adminTodelete.username} deleted succesfully`,
    });
  } catch (error) {
    res.status(400).json({ message: "unable to delete" });
  }
};

module.exports = { getAdmin, createAdmin, updateAdmin, deleteAdmin };
