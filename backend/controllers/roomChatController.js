const roomService = require('../services/roomService');

exports.addMessage = async (req, res) => {
    const { content, username, roomId } = req.body;
    try {
        const message = await roomService.addMessage({ content, username, roomId });
        res.json(message);
    } catch (error) {
        res.status(500).send({ message: 'Error adding message', error: error.message });
    }
};

exports.getMessages = async (req, res) => {
    const { roomId } = req.params;
    try {
        const messages = await roomService.getMessages(roomId);
        res.json(messages);
    } catch (error) {
        res.status(500).send({ message: 'Error getting messages', error: error.message });
    }
};
