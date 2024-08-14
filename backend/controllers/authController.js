const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper function to validate username
const isValidUsername = (username) => /^[a-zA-Z0-9_-]+$/.test(username);

exports.register = async (req, res) => {
    let { username, password } = req.body;
    const originalUsername = username; // Preserve the original case
    username = username.toLowerCase(); // Normalize to lowercase

    if (!isValidUsername(username)) {
        return res.status(400).json({ message: 'Username can only contain letters, numbers, hyphens, and underscores' });
    }

    try {
        const userExists = await User.findOne({ where: { username } });

        if (userExists) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });

        // Automatically log the user in
        req.session.userId = user.id;
        req.session.username = user.username; // Save username in session

        console.log(`User registered and logged in: ${originalUsername}`);

        // Return the username and user ID to the frontend
        res.status(201).json({ message: 'User registered successfully', user: { id: user.id, username: originalUsername } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.login = async (req, res) => {
    let { username, password } = req.body;
    const originalUsername = username; // Preserve the original case
    username = username.toLowerCase(); // Normalize to lowercase

    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        req.session.userId = user.id;
        req.session.username = user.username; // Save username in session

        // Minimal logging of session data, focusing only on key info
        console.log(`User logged in: ${originalUsername} (User ID: ${user.id})`);

        res.status(200).json({ message: 'Login successful', user: { id: user.id, username: originalUsername } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.checkSession = async (req, res) => {
    const { userId } = req.session;

    if (!userId) {
        return res.status(400).json({ valid: false, message: 'No active session' });
    }

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(400).json({ valid: false, message: 'Invalid session' });
        }

        res.status(200).json({ valid: true });
    } catch (error) {
        res.status(500).json({ valid: false, message: 'Server error', error });
    }
};



exports.logout = (req, res) => {
    console.log('Logout request received');

    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Logout failed', error: err });
        }

        console.log('Session destroyed successfully');
        res.status(200).json({ message: 'Logout successful' });
    });
};
