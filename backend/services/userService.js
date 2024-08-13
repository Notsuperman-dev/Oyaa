// backend/services/userService.js
const { User, BlockedUser } = require('../models'); // Ensure the correct path to User model

async function getUserByUsername(username) {
    try {
        return await User.findOne({ where: { username } });
    } catch (error) {
        console.error(`Error fetching user "${username}":`, error.message);
        throw error;
    }
}

async function usernameExists(username) {
    try {
        const user = await User.findOne({ where: { username } });
        return !!user;
    } catch (error) {
        console.error(`Error checking if username exists "${username}":`, error.message);
        throw error;
    }
}

async function getTopUser() {
    try {
        return await User.findOne({
            order: [['totalLikes', 'DESC']] // Using totalLikes to determine the top user
        });
    } catch (error) {
        console.error('Error fetching top user:', error.message);
        throw error;
    }
}

async function isTopUser(username) {
    try {
        const topUser = await getTopUser();
        return topUser && topUser.username === username;
    } catch (error) {
        console.error(`Error checking if "${username}" is top user:`, error.message);
        throw error;
    }
}

async function getBlockedUsers(userId) {
    try {
        const blockedUsers = await BlockedUser.findAll({
            where: { userId },
            include: [{ model: User, as: 'blockedUser' }]
        });
        return blockedUsers.map(block => block.blockedUser);
    } catch (error) {
        console.error(`Error fetching blocked users for user ID "${userId}":`, error.message);
        throw error;
    }
}

async function blockUser(userId, blockedUserId) {
    try {
        return await BlockedUser.create({ userId, blockedUserId });
    } catch (error) {
        console.error(`Error blocking user "${blockedUserId}" for user ID "${userId}":`, error.message);
        throw error;
    }
}

async function unblockUser(userId, blockedUserId) {
    try {
        const blockedUser = await BlockedUser.findOne({ where: { userId, blockedUserId } });
        if (blockedUser) {
            await blockedUser.destroy();
        }
    } catch (error) {
        console.error(`Error unblocking user "${blockedUserId}" for user ID "${userId}":`, error.message);
        throw error;
    }
}

module.exports = {
    getUserByUsername,
    usernameExists,
    getTopUser,
    isTopUser,
    getBlockedUsers,
    blockUser,
    unblockUser
};
