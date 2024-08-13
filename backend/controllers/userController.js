// backend/controllers/userController.js
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { getBlockedUsers, blockUser, unblockUser, usernameExists } = require('../services/userService');

exports.getUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { username, password } = req.body;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) {
            const existingUser = await usernameExists(username);
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            user.username = username;
        }

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getUserGroups = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const createdRooms = await Room.findAll({ where: { creatorId: user.id } });
        const joinedRooms = await user.getRooms(); // Assuming a many-to-many relationship exists between User and Room

        res.status(200).json({ createdRooms, joinedRooms });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Blocked users controllers
exports.getBlockedUsers = async (req, res) => {
    try {
        console.log('Fetching blocked users for userId:', req.params.userId);
        const blockedUsers = await getBlockedUsers(req.params.userId);
        console.log('Blocked users fetched:', blockedUsers);
        res.status(200).json(blockedUsers);
    } catch (error) {
        console.error('Error fetching blocked users:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.blockUser = async (req, res) => {
    try {
        const { username } = req.body;
        const blockedUser = await User.findOne({ where: { username } });
        if (!blockedUser) {
            return res.status(404).json({ message: 'Blocked user not found' });
        }
        await blockUser(req.params.userId, blockedUser.id);
        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.unblockUser = async (req, res) => {
    try {
        const { username } = req.body;
        const blockedUser = await User.findOne({ where: { username } });
        if (!blockedUser) {
            return res.status(404).json({ message: 'Blocked user not found' });
        }
        await unblockUser(req.params.userId, blockedUser.id);
        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        res.status500.json({ message: 'Server error', error });
    }
};
exports.updatePassword = async (req, res) => {
    const { userId } = req.params;
    const { oldPassword, password } = req.body;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the old password matches
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        // Hash the new password
        user.password = await bcrypt.hash(password, 10);
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error updating password:', error); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error });
    }
};