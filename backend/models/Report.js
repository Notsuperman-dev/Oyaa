const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust the path to your database configuration

const Report = sequelize.define('Report', {
    reporter: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reportedUser: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = Report;
