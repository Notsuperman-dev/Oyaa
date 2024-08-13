// backend/server.js

const dotenv = require('dotenv');
const http = require('http');
const socketio = require('socket.io');
const sessionMiddleware = require('./config/session');
const app = require('./app');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const server = http.createServer(app);

const io = socketio(server, {
    cors: {
        origin: isProduction ? 'https://your-production-url.com' : '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Use session middleware
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// Namespace for world chats
const worldChatIo = io.of('/world-chat');
require('./sockets/worldChatSockets')(worldChatIo);

// Namespace for room chats
const roomIo = io.of('/room-chat');
require('./sockets/chatRoomSockets')(roomIo);

// Schedule a task to reset likes every midnight
cron.schedule('0 0 * * *', async () => {
    try {
        await User.update({ totalLikes: 0 }, { where: {} });
        console.log('All likes have been reset to zero.');
    } catch (error) {
        console.error('Error resetting likes:', error);
    }
});

cron.schedule('* * * * *', async () => { // Runs every minute
    const ninetyMinutesAgo = new Date(Date.now() - 90 * 60 * 1000);
    const UploadedImage = app.get('UploadedImage');

    try {
        const expiredImages = await UploadedImage.findAll({
            where: {
                uploadedAt: {
                    [Sequelize.Op.lt]: ninetyMinutesAgo
                }
            }
        });

        for (const image of expiredImages) {
            const filePath = path.join(__dirname, '../', image.filePath);
            fs.unlink(filePath, async (err) => {
                if (!err) {
                    await image.destroy();
                    console.log(`Deleted expired image: ${filePath}`);
                } else {
                    console.error(`Error deleting file: ${filePath}`, err);
                }
            });
        }
    } catch (error) {
        console.error('Error cleaning up expired images:', error);
    }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});
