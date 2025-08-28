// backend/routes/users.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Go up one directory to find models

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }
        // Create a new user instance
        user = new User({ username, email, password });
        // Save the user (password will be hashed by the pre-save hook in the model)
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        // Compare submitted password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        // If credentials are correct, create a JWT token
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, 'yourSecretKey', { expiresIn: '1h' }); // Remember to use a strong secret key
        
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

module.exports = router;