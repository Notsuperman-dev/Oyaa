const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const logWithTimestamp = (msg) => {
    const timestamp = new Date().toISOString();
    if (!msg.includes('Executing (default):')) {
        console.log(`[${timestamp}] ${msg}`);
    }
};

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: logWithTimestamp
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = {
    sequelize,
    Sequelize
};
