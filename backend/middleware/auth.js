// backend/middleware/auth.js

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('Authorization')?.split(' ')[1];

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, ' process.env.d3a3c1b1-6b8f-4d32-9c1a-7b8f2d3e4c5a'); // Use the same secret key
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
