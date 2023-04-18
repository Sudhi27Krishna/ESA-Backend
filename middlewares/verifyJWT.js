const jwt = require('jsonwebtoken');
const asyncHandler=require('express-async-handler');
const User=require('../models/User');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    console.log(token);
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        asyncHandler(async(err, decoded) => {
            if (err) return res.sendStatus(403); // invalid token
            req.user = await User.findById(decoded.id).select('-password');
            next();
        })
    );
}

module.exports = verifyJWT;