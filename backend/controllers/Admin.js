const { admins } = require("../Schema.js");
const getAdmin = async (req, res) => {
  const model = await admins.find({},{username:1,_id:1});
  res.status(200).json(model);
};

const createAdmin = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: "username and password are required to create an admin",
    });
  }
  try {
    await admins.create({
      username: req.body.username,
      password: req.body.password,
      master: req.body.master || false,
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
    //TODO
    //req.body.newpassword= new password
    const {passowrd}=req.body.passowrd;
    const adminToUpdate = await admins.findById(req.params.id);
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
  const { id } = req.params;
  const { rootPassword } = req.body;

  // Verify root password
  //make your root password
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


module.exports = { getAdmin, createAdmin, updateAdmin, deleteAdmin };
