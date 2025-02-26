const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This middleware is used to protect routes that require authentication
const protect = async (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Get the token from header 
      const token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach it to the request object
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } else {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    return res.status(401).json({ message: error.message || 'Not authorized' });
  }
};

module.exports = { protect }; 