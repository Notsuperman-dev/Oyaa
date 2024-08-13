// backend/config/session.js
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false, // For production with Heroku or similar
});

const sessionMiddleware = session({
    store: new pgSession({
        pool: pgPool,                // Connection pool
        tableName: 'session',        // Use a custom table-name (optional)
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProduction,  // Set to true if using HTTPS
        httpOnly: true,        // Helps to prevent cross-site scripting (XSS) attacks
        sameSite: 'strict',    // Helps to prevent CSRF attacks
    },
});

module.exports = sessionMiddleware;
