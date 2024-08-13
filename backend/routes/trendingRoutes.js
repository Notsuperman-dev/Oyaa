const express = require('express');
const router = express.Router();
const trendingRoomController = require('../controllers/trendingRoomController');

router.get('/', trendingRoomController.getTrendingRooms);
router.get('/search', trendingRoomController.searchRooms);
router.get('/all', trendingRoomController.getAllRooms); // Add this line

module.exports = router;
