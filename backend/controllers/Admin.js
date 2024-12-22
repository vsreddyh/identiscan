const bcrypt = require("bcryptjs");
const { admins } = require("../Schema.js");

const getAdmin = async (req, res) => {
  try {
    const search = req.params.username || "";
    const filter = search
      ? { username: { $regex: search, $options: "i" }, master: false }
      : { master: false };

    const model = await admins.find(filter, { username: 1, _id: 1 }); // Apply filter
    res.status(200).json(model);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Failed to fetch admins" });
  }
};

const createAdmin = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(500).json({
      message: "username and password are required to create an admin",
    });
  }
  const hash = await bcrypt.hash(req.body.password, 10);
  try {
    await admins.create({
      username: req.body.username,
      password: hash,
      master: false,
    });

    const adminList = await admins.find(
      { master: false },
      { username: 1, _id: 1 },
    );
    res.status(200).json(adminList);
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Failed to create the admin" });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const adminToUpdate = await admins.findById(req.params.id);
    if (!adminToUpdate) {
      return res.status(504).send("unable to find admin by given id");
    }
    adminToUpdate.password = hash || adminToUpdate.password;
    const updatedAdmin = await adminToUpdate.save();
    res.status(200).json(1);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "unable to update" });
  }
};

const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the admin to delete
    const adminToDelete = await admins.findById(id);
    if (!adminToDelete) {
      return res.status(504).json({ message: "Admin not found" });
    }

    // Delete the admin
    await admins.deleteOne({ _id: id });

    // Fetch updated list of admins
    const adminList = await admins.find(
      { master: false },
      { username: 1, _id: 1 },
    );

    res.status(200).json({
      admins: adminList,
    });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Unable to delete admin" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await admins.findOne({ username: username });
    if (!admin) {
      return res.status(504).json("Username not found");
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(500).json("Wrong password");
    }
    req.session.username = username;
    res.status(200).json({ message: "Login successful", admin: admin });
  } catch (err) {
    res.status(500).json("Unable to login. Contact Tech Support");
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to logout. Contact Tech Support" });
  }
};

module.exports = {
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  login,
  logout,
};
