const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// This function helps to generate a JWT token for a user
const generateToken = (id) => {
    try {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// @route POST /auth/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please add all fields" });
        }

        // Check if user exists or not
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // create hash password for the user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            return res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// @route   POST /auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email or not
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            return res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
};
