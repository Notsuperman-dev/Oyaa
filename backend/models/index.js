const sequelize = require('../config/db');

const User = require('./User');
const Room = require('./Room');
const UserRoom = require('./UserRoom');

// Define many-to-many relationship
User.belongsToMany(Room, { through: UserRoom, foreignKey: 'userId' });
Room.belongsToMany(User, { through: UserRoom, foreignKey: 'roomId' });

module.exports = {
    sequelize,
    User,
    Room,
    UserRoom,
};
