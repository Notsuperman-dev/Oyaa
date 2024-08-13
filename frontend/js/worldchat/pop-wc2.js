document.addEventListener('DOMContentLoaded', () => {
    const socket = io('/world-chat');

    function createBubblePopup() {
        const popup = document.createElement('div');
        popup.classList.add('bubble-popup');

        const usernameDisplay = document.createElement('div');
        usernameDisplay.classList.add('username-display');

        const pinOption = document.createElement('div');
        pinOption.innerHTML = '<span class="option-icon">📌</span> Pin this chat';
        pinOption.addEventListener('click', (e) => {
            showNotification('This feature is for Kin subscribers only.');
            popup.classList.remove('visible');
        });

        const deleteOption = document.createElement('div');
        deleteOption.innerHTML = '<span class="option-icon">🗑️</span> Delete';
        deleteOption.addEventListener('click', (e) => {
            const bubble = popup.relatedBubble;
            const messageId = bubble.closest('.message').dataset.messageId;
            const username = localStorage.getItem('username');

            if (!username) {
                showNotification('You must be logged in to delete messages.');
                return;
            }

            console.log(`Delete chat ID: ${messageId}`);
            socket.emit('deleteMessage', { messageId, username });
            popup.classList.remove('visible');
        });

        const likeOption = document.createElement('div');
        likeOption.innerHTML = '<span class="option-icon">👍</span> Like';
        likeOption.classList.add('like-option');
        likeOption.addEventListener('click', (e) => {
            const bubble = popup.relatedBubble;
            const messageId = bubble.closest('.message').dataset.messageId;
            let username = localStorage.getItem('username');
            if (!username) {
                username = 'Anonymous';
                localStorage.setItem('username', username);
            }
            console.log(`Like chat ID: ${messageId}`);
            socket.emit('likeMessage', { messageId, username });
            popup.classList.remove('visible');
        });

        popup.appendChild(usernameDisplay);
        popup.appendChild(pinOption);
        popup.appendChild(deleteOption);
        popup.appendChild(likeOption);

        return popup;
    }

    function showBubblePopup(bubble, popup) {
        console.log('showBubblePopup called');
        popup.relatedBubble = bubble;
    
        const messageElement = bubble.closest('.message');
        const username = messageElement.dataset.username;
    
        if (username) {
            popup.querySelector('.username-display').textContent = username;
            popup.relatedUsername = username;
            console.log(`Username found: ${username}`);
        } else {
            popup.querySelector('.username-display').textContent = 'Unknown';
            popup.relatedUsername = 'Unknown';
            console.warn('Username element not found for message:', messageElement);
        }
    
        const likeOption = popup.querySelector('.like-option');
        if (popup.relatedUsername === localStorage.getItem('username')) {
            likeOption.style.display = 'none';
        } else {
            likeOption.style.display = 'block';
        }
    
        // Calculate position of the popup
        const bubbleRect = bubble.getBoundingClientRect();
        const scrollTop = window.scrollY; // Get the current scroll position
    
        // Remove any previously set top and left styles
        popup.style.top = '';
        popup.style.left = '';
    
        // Set the new position
        popup.style.top = `${bubbleRect.top + scrollTop - popup.offsetHeight}px`;
    
        // Check if the popup goes out of the right boundary
        const windowWidth = window.innerWidth;
        const popupWidth = popup.offsetWidth;
        let popupLeft = bubbleRect.left;
    
        const shiftOffset = -15; // Change this value to shift more towards the center
    
        if (popupLeft + popupWidth > windowWidth) {
            popupLeft = windowWidth - popupWidth - 10; // Adjust to fit within the window, with a 10px margin
        } else if (popupLeft + popupWidth + shiftOffset > windowWidth) {
            popupLeft = windowWidth - popupWidth - shiftOffset; // Shift more to the left if needed
        } else {
            popupLeft += shiftOffset; // Shift the popup towards the center
        }
    
        popup.style.left = `${popupLeft}px`;
    
        popup.classList.add('visible');
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
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    const bubblePopup = createBubblePopup();
    document.body.appendChild(bubblePopup);

    document.addEventListener('click', (e) => {
        if (!bubblePopup.contains(e.target)) {
            bubblePopup.classList.remove('visible');
        }
    });

    document.addEventListener('click', (e) => {
        console.log('Document clicked');
        const bubble = e.target.closest('.bubble');
        if (bubble) {
            console.log('Bubble clicked', bubble);
            e.stopPropagation();
            showBubblePopup(bubble, bubblePopup);
        }
    });

    socket.on('messageDeleted', (data) => {
        const { messageId } = data;
        const messageElement = document.querySelector(`.message[data-message-id="${messageId}"]`);
        if (messageElement) {
            messageElement.remove();
            showNotification('Message deleted by the Governor.');
        }
    });

    socket.on('unauthorizedDeleteAttempt', () => {
        showNotification('only Governors or Kin members can delete messages.');
    });
});
