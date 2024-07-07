const router = require("express").Router()
const { request } = require("express");
const User = require("../models/User")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
  
    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
  
    try {
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });


  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const payload = {
          userId: user._id,
          isAdmin: user.isAdmin
      };
        // Create JWT token
        const token = jwt.sign({payload, _id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: '3d'  // Token expires in 3 days
        });

        // Send token in response
        res.status(200).json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router