// backend/config/session.js
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: isProduction,  // Set to true if using HTTPS
        httpOnly: true,        // Helps to prevent cross-site scripting (XSS) attacks
        sameSite: 'strict',    // Helps to prevent CSRF attacks
    },
});

module.exports = sessionMiddleware;
