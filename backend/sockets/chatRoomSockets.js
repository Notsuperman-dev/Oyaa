// backend\sockets\chatRoomSockets.js

const roomService = require('../services/roomService');

const roomUsersCount = {};

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected to room chat');

        socket.on('joinRoom', async ({ roomId, username }) => {
            socket.join(roomId);
            console.log(`${username} joined room ${roomId}`);

            // Fetch the last 50 messages for the room
            try {
                const previousMessages = await roomService.getMessages(roomId);
                socket.emit('loadPreviousMessages', previousMessages);
            } catch (error) {
                console.error('Error fetching previous messages:', error);
            }

            // Increment user count for the room
            if (!roomUsersCount[roomId]) {
                roomUsersCount[roomId] = 0;
            }
            roomUsersCount[roomId] += 1;

            // Emit updated user count to the specific room
            io.to(roomId).emit('updateUserCount', roomUsersCount[roomId]);
        });

        socket.on('sendMessage', async (data) => {
            try {
                const { content, username, roomId, timestamp, messageType } = data; 
                if (!content) {
                    throw new Error('Message content cannot be empty');
                }

                // Store the message in the database, including messageType
                const message = await roomService.addMessage({ content, username, roomId, messageType });

                // Emit the message to the room, including the timestamp and messageType
                io.to(roomId).emit('newMessage', {
                    content: message.content,
                    username: message.username,
                    roomId: message.roomId,
                    timestamp: timestamp || new Date().toISOString(),
                    messageType: message.messageType,
                });
            } catch (error) {
                console.error('Error adding message:', error);
            }
        });

        socket.on('disconnecting', () => {
            socket.rooms.forEach(roomId => {
                if (roomId !== socket.id && roomUsersCount[roomId]) {
                    roomUsersCount[roomId] -= 1;
                    io.to(roomId).emit('updateUserCount', roomUsersCount[roomId]);
                }
            });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected from room chat');
        });
    });
};

module.exports.roomUsersCount = roomUsersCount;
