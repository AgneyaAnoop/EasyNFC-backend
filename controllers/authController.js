const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateUniqueSlug } = require('../utils/slugGenerator');

exports.register = async (req, res) => {
  try {
    const { email, password, name, phoneNo, about, links } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const urlSlug = await generateUniqueSlug(name);
    
    const user = new User({
      email,
      password,
      profiles: [{
        name,
        phoneNo,
        about,
        links,
        urlSlug
      }]
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      profileUrl: `${process.env.BASE_URL}/${urlSlug}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
  
      // Find and delete the user
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Optional: Add authentication check to ensure only the user can delete their account
      // if (user._id.toString() !== req.userId) {
      //   return res.status(403).json({ message: 'Not authorized to delete this account' });
      // }
  
      // Delete the user
      await User.findByIdAndDelete(user._id);
  
      res.json({ 
        message: 'User account deleted successfully',
        deletedEmail: email
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ 
        message: 'Error deleting user account', 
        error: error.message 
      });
    }
  };
  
  // If you want to add additional security by requiring password confirmation
  exports.deleteUserWithPassword = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          message: 'Email and password are required' 
        });
      }
  
      // Find the user
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // Delete the user
      await User.findByIdAndDelete(user._id);
  
      res.json({ 
        message: 'User account deleted successfully',
        deletedEmail: email
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ 
        message: 'Error deleting user account', 
        error: error.message 
      });
    }
  };