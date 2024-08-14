const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const MessageLike = require('./MessageLike');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    totalLikes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    isTopUser: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

User.hasMany(MessageLike, { foreignKey: 'username', sourceKey: 'username', onDelete: 'CASCADE' });

module.exports = User;
