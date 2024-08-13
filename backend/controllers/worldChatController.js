const { Op } = require('sequelize');
const worldChatService = require('../services/worldChatService');
const WorldMessage = require('../models/WorldMessage');
const Report = require('../models/Report');
const ReportedUserCount = require('../models/ReportedUserCount');

exports.getMessages = async (req, res) => {
    try {
        console.log('Fetching messages');
        const messages = await worldChatService.getMessages();
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send(error.message);
    }
};

exports.addMessage = async (req, res) => {
    try {
        let username = req.session.username;
        if (!username) {
            username = req.body.username; // Get from local storage
        }

        if (!username) {
            console.error('Username is undefined in addMessage');
            return res.status(400).send('Username is required');
        }
        console.log('Adding message for user:', username);
        const message = await worldChatService.addMessage(req.body.message, username);
        res.json(message);
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).send(error.message);
    }
};

exports.reportUser = async (req, res) => {
    try {
        const { reporter, reportedUser } = req.body;
        if (!reporter || !reportedUser) {
            return res.status(400).send('Both reporter and reported user are required');
        }
        const reportedUserCount = await worldChatService.reportUser(reporter, reportedUser);
        res.json(reportedUserCount);
    } catch (error) {
        console.error('Error reporting user:', error);
        res.status(500).send(error.message);
    }
};

exports.getReportedUsers = async (req, res) => {
    try {
        const reportedUsers = await ReportedUserCount.findAll({
            where: {
                reportCount: {
                    [Op.gt]: 10
                }
            }
        });
        res.json(reportedUsers);
    } catch (error) {
        console.error('Error fetching reported users:', error);
        res.status(500).send(error.message);
    }
};

// New method to get reporters for a specific user
exports.getReportersForUser = async (req, res) => {
    try {
        const { username } = req.params;
        const reports = await Report.findAll({
            where: { reportedUser: username },
            attributes: ['reporter']
        });

        const reporters = reports.map(report => report.reporter);
        res.json(reporters);
    } catch (error) {
        console.error(`Error fetching reporters for user ${username}:`, error);
        res.status(500).send(error.message);
    }
};

// Updated method to like a message
exports.likeMessage = async (req, res) => {
    try {
        const { messageId, username: bodyUsername } = req.body;
        let username = req.session.username || bodyUsername;

        // Log session data and username for debugging
        console.log('Session data:', req.session);
        console.log('Username from request body:', bodyUsername);
        console.log('Username used:', username);

        if (!username) {
            console.error('Username is undefined in likeMessage');
            return res.status(400).send('Username is required');
        }

        const message = await worldChatService.likeMessage(messageId, username);
        res.json({ success: true, likes: message.likes });
    } catch (error) {
        console.error('Error liking message:', error);
        res.status(500).send(error.message);
    }
};