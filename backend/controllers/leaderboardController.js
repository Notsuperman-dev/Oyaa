const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
    try {
        const users = await User.findAll({
            order: [['totalLikes', 'DESC']],
            limit: 10
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).send(error.message);
    }
};
