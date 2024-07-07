const express = require("express");
const router = express.Router();
 const User = require("../models/User")   
 const CryptoJS = require('crypto-js');
 const bcrypt = require('bcryptjs');
 
 
 router.get("/users", async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find();
        
        // If no users are found, return a 404 error
        if (!users || users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }
        
        // If users are found, send them as a JSON response
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}); 

router.get("/:id",async (req, res) => {

const userId = req.params.id;
    
    try {
        // Here you can use userId to fetch user data from your database
        // Example MongoDB query using Mongoose
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // If user is found, send it as a JSON response
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

 router.post("/userpost", async (req, res) => {
    try {
        const { username, password, email, isAdmin } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

        // Create a new user object with hashed password
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            isAdmin: isAdmin !== undefined ? isAdmin : false // Default to false if isAdmin is not provided
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Respond with the saved user data (without returning the hashed password)
        res.status(201).json({
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            isAdmin: savedUser.isAdmin
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const isAdmin = async (req, res, next) => {
    try {
        // Check if req.user is defined and has isAdmin property
        if (!req.user || !req.user.isAdmin) {
           
            return res.status(403).json({ error: "Unauthorized access" });
        }
        next(); // User is admin, continue to the next middleware or route handler
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
router.put("/:id",   async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Find user by ID and delete
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully', deletedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router