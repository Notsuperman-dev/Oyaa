// frontend\js\funRooms\chatrooms.js
document.addEventListener('DOMContentLoaded', () => {
    const sendMessageForm = document.getElementById('sendMessageForm');
    const messagesContainer = document.getElementById('messages');
    const roomNameElement = document.getElementById('room-name');
    const userNumberElement = document.getElementById('user-number');
    const socket = io('/room-chat');
    
    let lastSender = ''; 

    const roomId = localStorage.getItem('roomChatId');
    const username = localStorage.getItem('username');
    const roomName = localStorage.getItem('roomName');

    if (roomId && username) {
        roomNameElement.textContent = roomName;
        socket.emit('joinRoom', { roomId, username });

        socket.on('loadPreviousMessages', (messages) => {
            messages.reverse().forEach((message) => {
                const messageWrapper = document.createElement('div');
                messageWrapper.classList.add('message-wrapper');

                if (message.username !== lastSender) {
                    const usernameElement = document.createElement('div');
                    usernameElement.classList.add('username');
                    usernameElement.textContent = message.username;
                    messageWrapper.appendChild(usernameElement);
                }

                const messageElement = document.createElement('div');
                messageElement.classList.add('message');

                const timestamp = new Date(message.createdAt);
                const formattedTime = !isNaN(timestamp)
                    ? timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'Invalid Date';

                let messageContentHTML = '';

                if (message.messageType === 'image') {
                    messageContentHTML = `
                        <div class="message-content">
                            <img src="${message.content.trim()}" alt="Uploaded Image" class="media-message">
                        </div>
                        <div class="timestamp">${formattedTime}</div>
                    `;
                } else if (message.messageType === 'gif' || message.messageType === 'sticker') {
                    messageContentHTML = `
                        <div class="message-content">
                            <img src="${message.content.trim()}" alt="${message.messageType}" class="media-message">
                        </div>
                        <div class="timestamp">${formattedTime}</div>
                    `;
                } else {
                    messageContentHTML = `
                        <div class="message-content">${message.content}</div>
                        <div class="timestamp">${formattedTime}</div>
                    `;
                }

                messageElement.innerHTML = messageContentHTML;

                if (message.username === username) {
                    messageWrapper.classList.add('user-message');
                    messageElement.classList.add('user-message');
                } else {
                    messageWrapper.classList.add('other-message');
                    messageElement.classList.add('other-message');
                }

                messageWrapper.appendChild(messageElement);
                messagesContainer.appendChild(messageWrapper);

                lastSender = message.username;
            });

            // Scroll to the bottom of the message container
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });

        sendMessageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageInput = document.getElementById('messageInput');
            const content = messageInput.value.trim();
            
            if (content) {
                const isGif = content.startsWith('http') && content.endsWith('.gif');
                const isSticker = content.startsWith('http') && (content.endsWith('.webp') || content.endsWith('.png') || content.endsWith('.jpg'));
        
                const messageType = isGif ? 'gif' : isSticker ? 'sticker' : 'text';
                const timestamp = new Date().toISOString(); 
        
                socket.emit('sendMessage', { content, username, roomId, timestamp, messageType });
        
                messageInput.value = '';
            }
        });

        socket.on('newMessage', (message) => {
            const messageWrapper = document.createElement('div');
            messageWrapper.classList.add('message-wrapper');
        
            if (message.username !== lastSender) {
                const usernameElement = document.createElement('div');
                usernameElement.classList.add('username');
                usernameElement.textContent = message.username;
                messageWrapper.appendChild(usernameElement);
            }
        
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
        
            const timestamp = new Date(message.timestamp);
            const formattedTime = !isNaN(timestamp)
                ? timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Invalid Date';
        
            let messageContentHTML = '';
        
            if (message.messageType === 'image') { 
                messageContentHTML = `
                    <div class="message-content">
                        <img src="${message.content.trim()}" alt="Uploaded Image" class="media-message">
                    </div>
                    <div class="timestamp">${formattedTime}</div>
                `;
            } else if (message.messageType === 'gif' || message.messageType === 'sticker') {
                messageContentHTML = `
                    <div class="message-content">
                        <img src="${message.content.trim()}" alt="${message.messageType}" class="media-message">
                    </div>
                    <div class="timestamp">${formattedTime}</div>
                `;
            } else {
                messageContentHTML = `
                    <div class="message-content">${message.content}</div>
                    <div class="timestamp">${formattedTime}</div>
                `;
            }
        
            messageElement.innerHTML = messageContentHTML;
        
            if (message.username === username) {
                messageWrapper.classList.add('user-message');
                messageElement.classList.add('user-message');
            } else {
                messageWrapper.classList.add('other-message');
                messageElement.classList.add('other-message');
            }
        
            messageWrapper.appendChild(messageElement);
            messagesContainer.appendChild(messageWrapper);
        
            lastSender = message.username;
        
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });

        socket.on('updateUserCount', (userCount) => {
            userNumberElement.textContent = userCount;
        });
    } else {
        alert('Username and Room ID are required.');
    }
});

document.getElementById('Back').addEventListener('click', () => {
    window.location.href = './mainmenu';
});
