const authenticateSession = (req, res, next) => {
    if (!req.session.username) {
        return res.status(401).json({ message: 'Access denied, please log in' });
    }
    console.log(`Session valid for user`); // Minimal log
    next();
};

module.exports = authenticateSession;
