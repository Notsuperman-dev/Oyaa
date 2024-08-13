// backend\services\roomService.js

const Room = require('../models/Room');
const RoomMessage = require('../models/RoomMessage');
const { Op } = require('sequelize'); // Import Sequelize operators

// Import roomUsersCount from chatRoomSockets.js
const { roomUsersCount } = require('../sockets/chatRoomSockets');

// Placeholder function for getActiveUserCountForRoom
async function getActiveUserCountForRoom(roomId) {
    // Implement actual logic to fetch active user count
    return roomUsersCount[roomId] || 0; // Use the real-time count from socket
}

exports.createRoom = async (name, password, description, isPrivate) => {
    try {
        const newRoom = await Room.create({
            name: name.toLowerCase(),
            password: isPrivate ? password : null,
            description,
            isPrivate,
        });
        return newRoom;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.error(`Error creating room: Room name "${name}" already exists.`);
            throw new Error('Room name already exists');
        }
        console.error('Error creating room:', error.message || error);
        throw error;
    }
};

exports.joinRoom = async (name, password) => {
    try {
        const room = await Room.findOne({ where: { name: name.toLowerCase() } });
        if (!room) throw new Error('Room not found');
        if (room.password && room.password !== password) throw new Error('Invalid password');
        return room;
    } catch (error) {
        console.error('Error joining room:', error.message || error);
        throw error;
    }
};

exports.addMessage = async ({ content, username, roomId, messageType }) => {
    try {
        if (!content) {
            throw new Error('Message content cannot be empty');
        }
        const message = await RoomMessage.create({ content, username, roomId, messageType });
        return message;
    } catch (error) {
        console.error('Error adding message:', error.message || error);
        throw error;
    }
};

exports.getMessages = async (roomId) => {
    try {
        const messages = await RoomMessage.findAll({
            where: {
                roomId,
                expiresAt: {
                    [Op.gt]: new Date(), // Fetch only non-expired messages
                },
            },
            order: [['createdAt', 'DESC']],
            limit: 50,
        });
        return messages;
    } catch (error) {
        console.error('Error getting messages:', error.message || error);
        throw error;
    }
};

exports.checkRoom = async (name) => {
    try {
        const room = await Room.findOne({ where: { name: name.toLowerCase() } });
        return room;
    } catch (error) {
        console.error('Error checking room:', error.message || error);
        throw error;
    }
};

exports.getRoomDescriptions = async (roomId) => {
    const room = await Room.findByPk(roomId);
    if (!room) throw new Error('Room not found');
    return room.descriptions || [];
};

exports.updateRoomDescriptions = async (roomId, descriptions) => {
    const room = await Room.findByPk(roomId);
    if (!room) throw new Error('Room not found');
    room.descriptions = descriptions;
    await room.save();
    return room;
};

exports.getUserCounts = async (roomNames) => {
    const userCounts = {};
    for (const roomName of roomNames) {
        const room = await Room.findOne({ where: { name: roomName.toLowerCase() } });
        if (room) {
            const userCount = roomUsersCount[room.id] || 0; // Get real-time count from sockets
            userCounts[roomName] = userCount;
        } else {
            userCounts[roomName] = 0;
        }
    }
    return userCounts;
};
