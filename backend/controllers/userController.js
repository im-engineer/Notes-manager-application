const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @route   GET /users/me
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// @route   PUT /users/me
const updateMe = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findById(req.user.id);

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }
        await user.save();

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMe,
    updateMe,
};
