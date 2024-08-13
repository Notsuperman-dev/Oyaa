// backend/models/BlockedUser.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BlockedUser = sequelize.define('BlockedUser', {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users', // Use table name to avoid circular dependency
            key: 'id',
        },
        allowNull: false,
    },
    blockedUserId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users', // Use table name to avoid circular dependency
            key: 'id',
        },
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'BlockedUsers',
});

module.exports = BlockedUser;
