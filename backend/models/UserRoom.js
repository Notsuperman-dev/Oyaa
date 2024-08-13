const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserRoom = sequelize.define('UserRoom', {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    roomId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Rooms',
            key: 'id'
        }
    }
});

module.exports = UserRoom;
