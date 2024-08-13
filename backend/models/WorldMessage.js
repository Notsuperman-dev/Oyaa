const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const MessageLike = require('./MessageLike'); // Add this line

const WorldMessage = sequelize.define('WorldMessage', {
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    },
    likes: {  // New field for storing the number of likes
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    tableName: 'WorldMessages',
    timestamps: true, // Handles createdAt and updatedAt
});

WorldMessage.hasMany(MessageLike, { foreignKey: 'messageId', sourceKey: 'id', onDelete: 'CASCADE' }); // Add this line

module.exports = WorldMessage;
