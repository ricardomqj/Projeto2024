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

    console.log(`User found: ${user}`)

    if (user) {
      return user;
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email }).exec();
    if (user) {
      return user;
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    throw new Error(err.message); // You might want to handle this differently depending on your error handling strategy
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
exports.updateByEmail = async (req, res) => {
  const email = req.params.email; 
  const updateData = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Atualize as propriedades do usuário
    Object.assign(user, updateData);
    
    // Salva as mudanças no usuário
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user by email:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.updateCargoByEmail = async (req, res) => {
  const email = req.params.email;
  const newCargo = req.body.cargo;

  if (!email || !newCargo) {
      return res.status(400).json({ error: 'Email and cargo are required' });
  }

  try {
      const updatedUser = await User.findOneAndUpdate(
          { email },
          { cargo: newCargo },
          { new: true } // Return the updated user document
      );

      if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.json(updatedUser);
  } catch (error) {
      console.error('Error updating user cargo:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete user by ID
exports.delete = async (req, res, next) => {
  try {
    console.log(`Deleting user with ID: ${req.params.userId}`);

    const deletedUser = await User.findByIdAndDelete(req.params.userId).exec();

    if (deletedUser) {
      res.json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};
