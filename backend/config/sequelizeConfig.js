// backend/config/sequelizeConfig.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
                ca: process.env.CA_CERT,
            },
        },
    },
    production: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
                ca: process.env.CA_CERT,
            },
        },
        logging: false, // Disable logging in production for performance and security
    },
};
