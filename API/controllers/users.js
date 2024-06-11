const User = require('../models/users');

// List all users
exports.list = async () => {
  try {
    return await User.find().exec();
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID
exports.findById = async () => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (user) {
      return user;
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new user
exports.create = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    return newUser;
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update user by ID
exports.update = async () => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete user by ID
exports.delete = async () => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id).exec();
    if (deletedUser) {
      res.json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
