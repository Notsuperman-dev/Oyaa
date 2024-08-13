document.addEventListener('DOMContentLoaded', () => {
    // Check if the username is in localStorage
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = '/'; // Redirect to homepage if username is not found
        return; // Exit the script
    }
    const socket = io('/world-chat');
    const messageList = document.getElementById('message-list');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    let autoScrollEnabled = true;
    let lastUsername = '';
    let topUser = '';
    let autoScrollTimeout;

    // Define a character limit
    const MESSAGE_CHARACTER_LIMIT = 255;

    const notificationSound = new Audio('js/worldchat/notification.wav');
    notificationSound.addEventListener('canplaythrough', () => {
        console.log('Notification sound is ready to play');
    }, false);

    notificationSound.addEventListener('error', (e) => {
        console.error('Error loading notification sound:', e);
    }, false);

    socket.on('connect', () => {
        console.log('Connected to world chat');
        fetchTopUser().then(fetchMessages);
    });

    socket.on('disconnect', () => console.log('Disconnected from world chat'));

    sendButton.addEventListener('click', (e) => {
        e.preventDefault();
        sendMessage();
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    socket.on('newMessage', (message) => {
        if (!isUserBlocked(message.username)) {
            displayMessage(message);
            handleMentions(message);
            if (autoScrollEnabled) {
                scrollToBottom();
            }
        }
    });

    socket.on('messageLiked', (data) => {
        const { messageId, likes } = data;
        updateMessageLikes(messageId, likes);
    });

    async function fetchTopUser() {
        try {
            const response = await fetch('/api/leaderboard');
            const users = await response.json();
            if (users && users.length > 0) {
                topUser = users[0].username;
                window.topUser = topUser; // Expose globally
            }
        } catch (error) {
            console.error('Error fetching top user:', error);
        }
    }

    async function fetchMessages() {
        try {
            const response = await fetch('/api/world-chat/messages');
            const messages = await response.json();
            if (Array.isArray(messages)) {
                const filteredMessages = messages.reverse().filter(message => !isUserBlocked(message.username));
                displayMessages(filteredMessages);
                if (autoScrollEnabled) {
                    scrollToBottom();
                }
            } else {
                displayErrorMessage('Invalid data received.');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            displayErrorMessage('Failed to load messages. Please try again later.');
        }
    }

    function sendMessage() {
        const message = messageInput.value.trim();

        // Check if the message exceeds the character limit
        if (message.length > MESSAGE_CHARACTER_LIMIT) {
            // Display an error message
            displayErrorMessage(`Sorry, you can only input ${MESSAGE_CHARACTER_LIMIT} characters per chat.`);
            return;
        }

        if (message) {
            const username = getCurrentUsername();
            if (!username) {
                console.error('Username is not defined.');
                return;
            }
            socket.emit('sendMessage', { content: message, username });
            messageInput.value = '';
            messageInput.focus();
            // Always auto-scroll when the user sends a message
            scrollToBottom(true);
        }
    }

    function getCurrentUsername() {
        const username = localStorage.getItem('username') || 'Anonymous';
        window.currentUser = username;
        return username;
    }

    function displayMessages(messages) {
        const fragment = document.createDocumentFragment();
        messages.forEach((message, index) => {
            const isSameUser = index > 0 && messages[index - 1].username === message.username;
            const messageElement = createMessageElement(message, isSameUser);
            fragment.appendChild(messageElement);
        });
        messageList.appendChild(fragment);
        if (autoScrollEnabled) {
            scrollToBottom();
        }
    }

    function displayMessage(message) {
        const isSameUser = lastUsername === message.username;
        const messageElement = createMessageElement(message, isSameUser);
        messageList.appendChild(messageElement);
        lastUsername = message.username;
        if (autoScrollEnabled) {
            scrollToBottom();
        }
    }

    function createMessageElement({ id, content, username, createdAt, likes = 0 }, isSameUser) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', username === getCurrentUsername() ? 'message-sent' : 'message-received');
        messageElement.dataset.messageId = id;
        messageElement.dataset.username = username; // Store username in a data attribute
    
        if (!isSameUser && username !== getCurrentUsername()) {
            const userContainer = document.createElement('div');
            userContainer.classList.add('user-container');
    
            const userIcon = document.createElement('div');
            userIcon.classList.add('user-icon');
            if (username === topUser) {
                userIcon.classList.add('top-user-icon'); // Apply the top-user-icon class
            }
            userIcon.setAttribute('data-username', username);
    
            const usernameElement = document.createElement('span');
            usernameElement.classList.add('username');
            if (username === topUser) {
                usernameElement.classList.add('top-user-username'); // Apply the top-user-username class
            }
            usernameElement.textContent = username;
    
            userContainer.appendChild(userIcon);
            userContainer.appendChild(usernameElement);
            messageElement.appendChild(userContainer);
        } else if (!isSameUser) {
            const userContainer = document.createElement('div');
            userContainer.classList.add('user-container');
    
            const usernameElement = document.createElement('span');
            usernameElement.classList.add('username');
            if (username === topUser) {
                usernameElement.classList.add('top-user-username'); // Apply the top-user-username class
            }
            usernameElement.textContent = username;
    
            userContainer.appendChild(usernameElement);
            messageElement.appendChild(userContainer);
        }
    
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        if (username === topUser) {
            bubble.classList.add('top-user-bubble'); // Apply the top-user-bubble class
        }
    
        // Highlight the mentioned username
        const currentUser = getCurrentUsername();
        const mentionRegex = new RegExp(`@${currentUser}`, 'gi');
        const highlightedContent = content.replace(mentionRegex, `<span class="mention">@${currentUser}</span>`);
    
        bubble.innerHTML = 
            `<span class="content">${highlightedContent}</span>
            <span class="timestamp">${new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            ${likes > 0 ? `<span class="likes">👍 ${likes}</span>` : ''}`;
    
        bubble.addEventListener('click', () => {
            console.log('Chat Bubble:', content);
            console.log('Username:', username);
        });
    
        messageElement.appendChild(bubble);
    
        return messageElement;
    }
    
    function updateMessageLikes(messageId, likes) {
        const messageElement = messageList.querySelector(`.message[data-message-id="${messageId}"]`);
        if (messageElement) {
            const likesElement = messageElement.querySelector('.likes');
            if (likesElement) {
                if (likes > 0) {
                    likesElement.textContent = `👍 ${likes}`;
                    likesElement.style.display = '';
                } else {
                    likesElement.style.display = 'none';
                }
            } else if (likes > 0) {
                const bubble = messageElement.querySelector('.bubble');
                const likesSpan = document.createElement('span');
                likesSpan.classList.add('likes');
                likesSpan.textContent = `👍 ${likes}`;
                bubble.appendChild(likesSpan);
            }
        }
    }

    function displayErrorMessage(message) {
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-message');
        errorElement.textContent = message;
        messageList.appendChild(errorElement);
        setTimeout(() => errorElement.remove(), 5000);
    }

    function scrollToBottom(forceScroll = false) {
        if (autoScrollEnabled || forceScroll) {
            const recentMessage = document.querySelector('.message:last-child');
            if (recentMessage) {
                recentMessage.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    function isUserBlocked(username) {
        const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers')) || [];
        return blockedUsers.includes(username);
    }

    window.blockUser = function blockUser(username) {
        let blockedUsers = JSON.parse(localStorage.getItem('blockedUsers')) || [];
        if (!blockedUsers.includes(username)) {
            blockedUsers.push(username);
            localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
            filterMessages();
        }
    }

    window.unblockUser = function unblockUser(username) {
        let blockedUsers = JSON.parse(localStorage.getItem('blockedUsers')) || [];
        blockedUsers = blockedUsers.filter(user => user !== username);
        localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
        filterMessages();
    }

    function filterMessages() {
        const messages = Array.from(document.querySelectorAll('.message'));
        messages.forEach(message => {
            const usernameElement = message.querySelector('.username');
            if (usernameElement) {
                const username = usernameElement.textContent;
                if (isUserBlocked(username)) {
                    message.style.display = 'none';
                } else {
                    message.style.display = '';
                }
            }
        });
    }

    messageList.addEventListener('click', (e) => {
        if (e.target.classList.contains('block-user')) {
            const username = e.target.dataset.username;
            blockUser(username);
        }
    });

    messageList.addEventListener('click', (e) => {
        if (e.target.classList.contains('unblock-user')) {
            const username = e.target.dataset.username;
            unblockUser(username);
        }
    });

    function handleUserScroll() {
        autoScrollEnabled = false;
        clearTimeout(autoScrollTimeout);
        autoScrollTimeout = setTimeout(() => {
            autoScrollEnabled = true;
            scrollToBottom();
        }, 10000);
    }

    messageList.addEventListener('touchstart', handleUserScroll);
    messageList.addEventListener('touchend', () => {
        if (autoScrollEnabled) {
            scrollToBottom();
        }
    });

    messageList.addEventListener('mousedown', handleUserScroll);
    messageList.addEventListener('mouseup', () => {
        if (autoScrollEnabled) {
            scrollToBottom();
        }
    });

    messageList.addEventListener('wheel', handleUserScroll);

    function handleMentions(message) {
        const currentUser = getCurrentUsername();
        const mentionRegex = new RegExp(`@${currentUser}`, 'i');
        console.log('Checking for mention:', currentUser, 'in message:', message.content);
        if (mentionRegex.test(message.content)) {
            showNotification(`You have been mentioned by ${message.username}`);
            notificationSound.play().catch((e) => {
                console.error('Failed to play notification sound:', e);
            });
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('visible');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
});
