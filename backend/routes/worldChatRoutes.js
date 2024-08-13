const express = require('express');
const router = express.Router();
const worldChatController = require('../controllers/worldChatController');

router.get('/messages', worldChatController.getMessages);
router.post('/messages', worldChatController.addMessage);
router.post('/report', worldChatController.reportUser);
router.get('/reported-users', worldChatController.getReportedUsers);
router.get('/reported-users/:username/reporters', worldChatController.getReportersForUser); // Existing line

// New route to like a message
router.post('/like', worldChatController.likeMessage);

module.exports = router;
