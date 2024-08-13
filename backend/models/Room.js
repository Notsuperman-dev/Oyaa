const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Room = sequelize.define('Room', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
            this.setDataValue('name', value.toLowerCase());
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isPrivate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Public by default
    },
   
});

module.exports = Room;
