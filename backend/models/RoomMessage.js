// models/RoomMessage.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class RoomMessage extends Model {}

RoomMessage.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: { 
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour after creation
    },
    messageType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'text', // Default to 'text' if not specified
    },
  },
  {
    sequelize,
    modelName: 'RoomMessage',
    tableName: 'RoomMessages',
    timestamps: true, // Ensure Sequelize manages createdAt and updatedAt
  }
);

module.exports = RoomMessage;
