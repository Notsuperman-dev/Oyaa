const roomService = require('../services/roomService');

function isValidRoomName(name) {
    const regex = /^[a-zA-Z0-9-_]+$/;
    return regex.test(name);
}

function isValidDescription(description) {
    const regex = /^(#\w+\s)*#\w+$/;
    return regex.test(description);
}

exports.createRoom = async (req, res) => {
    const { name, password, description, isPrivate } = req.body;

    if (!isValidRoomName(name)) {
        return res.status(400).send({ message: 'Invalid room name. Only letters, numbers, hyphens, and underscores are allowed.' });
    }

    if (!isValidDescription(description)) {
        return res.status(400).send({ message: 'Invalid description. Keywords must be prefixed with "#" and separated by spaces.' });
    }

    try {
        const room = await roomService.createRoom(name, password, description, isPrivate);
        res.json(room);
    } catch (error) {
        if (error.message === 'Room name already exists') {
            res.status(400).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Error creating room', error: error.message });
        }
    }
};

exports.joinRoom = async (req, res) => {
    const { name, password } = req.body;

    if (!isValidRoomName(name)) {
        return res.status(400).send({ message: 'Invalid room name. Only letters, numbers, hyphens, and underscores are allowed.' });
    }

    try {
        const room = await roomService.joinRoom(name, password);
        res.json(room);
    } catch (error) {
        if (error.message === 'Room not found' || error.message === 'Invalid password') {
            res.status(400).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Error joining room', error: error.message });
        }
    }
};

exports.checkRoom = async (req, res) => {
    const { name } = req.query;

    if (!isValidRoomName(name)) {
        return res.status(400).send({ message: 'Invalid room name. Only letters, numbers, hyphens, and underscores are allowed.' });
    }

    try {
        const room = await roomService.checkRoom(name);
        if (room) {
            res.json({ requiresPassword: !!room.password });
        } else {
            res.status(404).send({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error checking room', error: error.message });
    }
};

exports.getRoomDescriptions = async (req, res) => {
    try {
        const { roomId } = req.params;
        const descriptions = await roomService.getRoomDescriptions(roomId);
        res.json(descriptions);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching descriptions', error: error.message });
    }
};

exports.updateRoomDescriptions = async (req, res) => {
    const { roomId } = req.params;
    const { descriptions } = req.body;
    try {
        const updatedRoom = await roomService.updateRoomDescriptions(roomId, descriptions);
        res.json(updatedRoom);
    } catch (error) {
        res.status(500).send({ message: 'Error updating descriptions', error: error.message });
    }
};


exports.getUserCounts = async (req, res) => {
    try {
        const { roomNames } = req.body;
        if (!Array.isArray(roomNames)) {
            return res.status(400).send({ message: 'Invalid input. Expected an array of room names.' });
        }

        const userCounts = await roomService.getUserCounts(roomNames);
        res.json(userCounts);
    } catch (error) {
        console.error('Error fetching user counts:', error);
        res.status(500).send({ message: 'Error fetching user counts', error: error.message });
    }
};
