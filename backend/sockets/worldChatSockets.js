const worldChatService = require('../services/worldChatService');
const userService = require('../services/userService'); // Ensure you have a service to handle user-related queries

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('sendMessage', async (data) => {
            try {
                const { content, username } = data;
                if (!username) {
                    console.error('Username is missing');
                    return;
                }
                const message = await worldChatService.addMessage(content, username);
                
                // Emit the new message to all clients
                io.emit('newMessage', {
                    id: message.id, // Include the message ID
                    content: message.content,
                    username: message.username,
                    createdAt: message.createdAt,
                    expiresAt: message.expiresAt,
                    likes: message.likes || 0 // Ensure likes are sent with the message
                });

                // Handle mentions in the message content
                const mentionedUsers = extractMentions(content);
                for (const mentionedUsername of mentionedUsers) {
                    const mentionedUser = await userService.getUserByUsername(mentionedUsername);
                    if (mentionedUser && mentionedUser.socketId) {
                        socket.to(mentionedUser.socketId).emit('mention', {
                            message: content,
                            mentionedBy: username
                        });
                    }
                }
            } catch (error) {
                console.error('Error adding message:', error);
            }
        });

        socket.on('likeMessage', async (data) => {
            try {
                const { messageId, username } = data; // Make sure `username` is passed from the client
                const message = await worldChatService.likeMessage(messageId, username);
                io.emit('messageLiked', {
                    messageId: message.id,
                    likes: message.likes
                });
            } catch (error) {
                // Minimalistic error logging for the specific error
                if (error.message === 'User has already liked this message') {
                    console.warn(`User "${data.username}" already liked message with ID "${data.messageId}".`);
                } else {
                    console.error('Error liking message:', error);
                }
            }
        });

        socket.on('deleteMessage', async (data) => {
            try {
                const { messageId, username } = data;
                if (!username) {
                    console.error('deleteMessage: Username is missing');
                    return;
                }

                console.log(`deleteMessage: Request to delete message ${messageId} by user ${username}`);

                const user = await userService.getUserByUsername(username);
                if (!user) {
                    console.error(`deleteMessage: User ${username} not found`);
                    socket.emit('unauthorizedDeleteAttempt');
                    return;
                }

                console.log(`deleteMessage: Found user ${username}, checking if top user`);

                const topUser = await userService.getTopUser();
                if (topUser.username !== user.username) {
                    console.error(`deleteMessage: User ${username} is not authorized to delete messages`);
                    socket.emit('unauthorizedDeleteAttempt');
                    return;
                }

                await worldChatService.deleteMessage(messageId, username);
                console.log(`deleteMessage: Successfully deleted message ${messageId}`);
                io.emit('messageDeleted', { messageId });
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    function extractMentions(message) {
        const mentionPattern = /@(\w+)/g;
        let match;
        const mentions = [];
        while ((match = mentionPattern.exec(message)) !== null) {
            mentions.push(match[1]);
        }
        return mentions;
    }
};
