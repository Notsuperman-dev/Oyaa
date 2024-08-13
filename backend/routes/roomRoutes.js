const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Room-related routes
router.post('/create', roomController.createRoom);
router.post('/join', roomController.joinRoom);
router.get('/check', roomController.checkRoom);

// Descriptions-related routes
router.get('/:roomId/descriptions', roomController.getRoomDescriptions);
router.post('/:roomId/descriptions', roomController.updateRoomDescriptions);

// User counts-related routes
router.post('/userCounts', roomController.getUserCounts);

module.exports = router;
