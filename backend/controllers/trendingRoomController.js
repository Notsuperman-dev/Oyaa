const trendingRoomService = require('../services/trendingRoomService');

exports.getAllRooms = async (req, res) => {
    try {
        console.log('Fetching all rooms');
        
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 rooms per page

        const rooms = await trendingRoomService.getAllRooms(page, limit);
        res.json(rooms);
    } catch (error) {
        console.error('Error:', error.message || error);
        res.status(500).json({ error: 'Failed to fetch all rooms' });
    }
};

exports.getTrendingRooms = async (req, res) => {
    try {
        console.log('Fetching trending rooms');

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const rooms = await trendingRoomService.getTrendingRooms(page, limit);
        res.json(rooms);
    } catch (error) {
        console.error('Error:', error.message || error);
        res.status(500).json({ error: 'Failed to fetch trending rooms' });
    }
};

exports.searchRooms = async (req, res) => {
    try {
        const query = req.query.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        console.log(`Searching rooms for query: ${query}`);

        const rooms = await trendingRoomService.searchRooms(query, page, limit);
        res.json(rooms);
    } catch (error) {
        console.error('Error:', error.message || error);
        res.status(500).json({ error: 'Failed to search rooms' });
    }
};
