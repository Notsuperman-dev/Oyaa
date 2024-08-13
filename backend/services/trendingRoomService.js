// backend\services\trendingRoomService.js

const Room = require('../models/Room');
const { Op } = require('sequelize');
const { getUserCounts } = require('./roomService');

exports.getAllRooms = async (page, limit) => {
    try {
        const offset = (page - 1) * limit;

        const rooms = await Room.findAll({
            where: { isPrivate: false },
            attributes: ['id', 'name', 'description', 'createdAt'], // Fetch only necessary fields
            order: [['createdAt', 'DESC']],
            offset: offset,
            limit: limit,
        });

        const roomNames = rooms.map(room => room.name);
        const userCounts = await getUserCounts(roomNames);

        const roomsWithUserCounts = rooms.map(room => ({
            ...room.toJSON(),
            userCount: userCounts[room.name] || 0,
        }));

        roomsWithUserCounts.sort((a, b) => b.userCount - a.userCount);

        roomsWithUserCounts.forEach((room, index) => {
            room.rank = offset + index + 1;
        });

        return roomsWithUserCounts;
    } catch (error) {
        console.error('Error:', error.message || error);
        throw error;
    }
};

exports.getTrendingRooms = async (page, limit) => {
    try {
        const rooms = await Room.findAll({
            where: { isPrivate: false },
            attributes: ['id', 'name', 'description', 'createdAt'],
            order: [['createdAt', 'DESC']],
        });

        const roomNames = rooms.map(room => room.name);
        const userCounts = await getUserCounts(roomNames);

        const roomsWithUserCounts = rooms.map(room => ({
            ...room.toJSON(),
            userCount: userCounts[room.name] || 0,
        }));

        roomsWithUserCounts.sort((a, b) => b.userCount - a.userCount);

        const offset = (page - 1) * limit;
        const paginatedRooms = roomsWithUserCounts.slice(offset, offset + limit);

        paginatedRooms.forEach((room, index) => {
            room.rank = offset + index + 1;
        });

        return paginatedRooms;
    } catch (error) {
        console.error('Error:', error.message || error);
        throw error;
    }
};

exports.searchRooms = async (query, page, limit) => {
    try {
        const rooms = await Room.findAll({
            where: {
                isPrivate: false,
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { description: { [Op.like]: `%${query}%` } }
                ]
            },
            attributes: ['id', 'name', 'description', 'createdAt'],
            order: [['createdAt', 'DESC']],
        });

        const roomNames = rooms.map(room => room.name);
        const userCounts = await getUserCounts(roomNames);

        const roomsWithUserCounts = rooms.map(room => ({
            ...room.toJSON(),
            userCount: userCounts[room.name] || 0,
        }));

        roomsWithUserCounts.sort((a, b) => b.userCount - a.userCount);

        const offset = (page - 1) * limit;
        const paginatedRooms = roomsWithUserCounts.slice(offset, offset + limit);

        paginatedRooms.forEach((room, index) => {
            room.rank = offset + index + 1;
        });

        return paginatedRooms;
    } catch (error) {
        console.error('Error:', error.message || error);
        throw error;
    }
};
