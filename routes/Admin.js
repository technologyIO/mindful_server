const express = require("express");
const Adminuser = require("../database/models/AdminUser");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const router = express.Router();


router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const role = 1 // by default set role to 1
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if the user already exists
        const existingUser = await Adminuser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Admin user already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new admin user
        const newAdmin = new Adminuser({
            email,
            password: hashedPassword,
            role: role || 1, // Default role
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin user created successfully', user: newAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
  );


  router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find the user
        const user = await Adminuser.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            "JWT_SECRET",
            { expiresIn: '24h' } // Token expiration time
        );

        res.status(200).json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


module.exports = router;