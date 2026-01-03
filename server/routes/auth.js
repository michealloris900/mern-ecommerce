const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Debug middleware
router.use((req, res, next) => {
  console.log(`Auth Route: ${req.method} ${req.path}`);
  next();
});

// REGISTER - FIXED VERSION
router.post('/register', async (req, res) => {
  console.log('=== REGISTER REQUEST ===');
  console.log('Body:', req.body);
  
  try {
    const { name, email, password } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
      console.log('Validation failed: Missing fields');
      return res.status(400).json({ 
        success: false, 
        msg: 'Please provide name, email and password' 
      });
    }

    // 2. Check if user exists
    console.log('Checking if user exists:', email);
    let user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ 
        success: false, 
        msg: 'User already exists' 
      });
    }

    // 3. Create new user
    console.log('Creating new user...');
    user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      role: 'user'
    });

    // 4. Save user (password akan di-hash otomatis oleh pre-save middleware)
    console.log('Saving user...');
    await user.save();
    console.log('User saved successfully:', user.email);

    // 5. Create JWT token
    console.log('Creating JWT token...');
    const payload = {
      user: {
        id: user._id.toString()
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'mern_secret',
      { expiresIn: '7d' } // Token valid 7 hari
    );

    console.log('Token created successfully');

    // 6. Send response
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ REGISTER ERROR DETAILS:');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    console.error('Error Stack:', error.stack);
    
    // Handle specific errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        msg: 'Validation Error', 
        errors 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        msg: 'Email already exists' 
      });
    }
    
    // Generic error
    res.status(500).json({ 
      success: false,
      msg: 'Server error during registration',
      error: error.message
    });
  }
});

// LOGIN - FIXED VERSION
router.post('/login', async (req, res) => {
  console.log('=== LOGIN REQUEST ===');
  console.log('Body:', req.body);
  
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        msg: 'Please provide email and password' 
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        msg: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        msg: 'Invalid credentials' 
      });
    }

    // Create token
    const payload = {
      user: {
        id: user._id.toString()
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'mern_secret',
      { expiresIn: '7d' }
    );

    // Send response
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      msg: 'Server error',
      error: error.message 
    });
  }
});

// GET CURRENT USER
router.get('/', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        msg: 'No token provided' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mern_secret');
    
    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        msg: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get user error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        msg: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        msg: 'Token expired' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      msg: 'Server error' 
    });
  }
});

module.exports = router;