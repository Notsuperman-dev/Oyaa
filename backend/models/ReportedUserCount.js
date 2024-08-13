// backend/models/ReportedUserCount.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust the path to your database configuration

const ReportedUserCount = sequelize.define('ReportedUserCount', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    reportCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    timestamps: false,
});

module.exports = ReportedUserCount;
