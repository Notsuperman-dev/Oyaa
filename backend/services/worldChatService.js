const WorldMessage = require('../models/WorldMessage');
const User = require('../models/User');
const MessageLike = require('../models/MessageLike');
const { Op } = require('sequelize');
const Report = require('../models/Report');
const ReportedUserCount = require('../models/ReportedUserCount');
const userService = require('../services/userService'); // Ensure correct import
const { sequelize } = require('../config/db');

async function addMessage(content, username) {
    return await WorldMessage.create({
        content,
        username,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    });
}

async function getMessages() {
    console.log('Fetching messages');
    return await WorldMessage.findAll({
        where: {
            expiresAt: {
                [Op.gt]: new Date() // Only fetch messages that haven't expired
            }
        },
        order: [['createdAt', 'DESC']]
    });
}

async function reportUser(reporter, reportedUser) {
    // Create a new report
    await Report.create({ reporter, reportedUser });

    // Update the report count for the reported user
    const [reportedUserCount, created] = await ReportedUserCount.findOrCreate({
        where: { username: reportedUser },
        defaults: { reportCount: 1 },
    });

    if (!created) {
        reportedUserCount.reportCount += 1;
        await reportedUserCount.save();
    }

    return reportedUserCount;
}

async function likeMessage(messageId, username) {
    const transaction = await sequelize.transaction(); // Start a transaction

    if (!transaction) {
        console.error("Failed to start a transaction.");
        throw new Error("Transaction initialization failed");
    }

    try {
        const existingLike = await MessageLike.findOne({
            where: { messageId, username },
            transaction // Pass the transaction to the query
        });

        if (existingLike) {
            console.warn(`User "${username}" already liked message ID "${messageId}".`);
            throw new Error('User has already liked this message');
        }

        const message = await WorldMessage.findByPk(messageId, { transaction }); // Pass the transaction
        if (!message) {
            console.error(`Message ID "${messageId}" not found.`);
            throw new Error('Message not found');
        }

        message.likes += 1;
        await message.save({ transaction }); // Pass the transaction

        const user = await User.findOne({ where: { username: message.username }, transaction }); // Pass the transaction
        if (user) {
            user.totalLikes += 1;
            await user.save({ transaction }); // Pass the transaction
        }

        await MessageLike.create({ messageId, username }, { transaction }); // Pass the transaction

        await transaction.commit(); // Commit the transaction
        return message;
    } catch (error) {
        await transaction.rollback(); // Rollback the transaction in case of error

        if (error.message === 'User has already liked this message') {
            console.warn(`Duplicate like attempt by user "${username}" on message ID "${messageId}".`);
        } else {
            console.error(`Error in likeMessage: ${error.message}`);
        }
        throw error;
    }
}


async function deleteMessage(messageId, username) {
    try {
        console.log(`Delete request: message ID "${messageId}" by user "${username}"`);

        const message = await WorldMessage.findByPk(messageId);
        if (!message) {
            console.error(`Message ID "${messageId}" not found`);
            throw new Error('Message not found');
        }

        const user = await User.findOne({ where: { username } });
        if (!user) {
            console.error(`User "${username}" not found`);
            throw new Error('User not found');
        }

        const topUser = await userService.getTopUser();
        if (!topUser) {
            console.error('Top user not found');
            throw new Error('Top user not found');
        }

        if (user.username !== topUser.username) {
            console.error(`Unauthorized delete by user "${username}"`);
            throw new Error('Unauthorized user');
        }

        await message.destroy();
        console.log(`Message ID "${messageId}" deleted by user "${username}"`);
        return message;
    } catch (error) {
        console.error(`Error in deleteMessage: ${error.message}`);
        throw error;
    }
}

module.exports = {
    addMessage,
    getMessages,
    reportUser,
    likeMessage, 
    deleteMessage 
};
