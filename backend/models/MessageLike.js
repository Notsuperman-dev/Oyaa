const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MessageLike = sequelize.define('MessageLike', {
    messageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'WorldMessages',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'username',
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'MessageLikes',
    timestamps: true, // Handles createdAt and updatedAt
    uniqueKeys: {
        actions_unique: {
            fields: ['messageId', 'username']
        }
    }
});

module.exports = MessageLike;
