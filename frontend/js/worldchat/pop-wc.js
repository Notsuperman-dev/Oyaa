document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        const popups = document.querySelectorAll('.user-popup');
        popups.forEach(popup => {
            if (!popup.contains(e.target) && !popup.parentNode.contains(e.target)) {
                popup.classList.remove('visible');
            }
        });
    });

    function createPopupMenu(username) {
        const popup = document.createElement('div');
        popup.classList.add('user-popup');
    
        const usernameDisplay = document.createElement('div');
        usernameDisplay.classList.add('username-display');
        usernameDisplay.textContent = ` ${username}`;
    
        const blockOption = document.createElement('div');
        blockOption.innerHTML = '<span class="option-icon">🚫</span> Block';
        if (username === window.topUser) {
            blockOption.style.display = 'none'; // Hide the block option for top users
        } else {
            blockOption.addEventListener('click', () => {
                window.blockUser(username);
                showNotification(`User ${username} has been blocked.`);
                popup.classList.remove('visible');
            });
        }
    
        const addOption = document.createElement('div');
        addOption.innerHTML = '<span class="option-icon">➕</span> Add User';
        addOption.addEventListener('click', () => {
            window.addUser(username);
            showNotification(`User ${username} has been added.`);
            popup.classList.remove('visible');
        });
    
        const reportOption = document.createElement('div');
        reportOption.innerHTML = '<span class="option-icon">⚠️</span> Report ';
        if (username === window.topUser) {
            reportOption.style.display = 'none'; // Hide the report option for top users
        } else {
            reportOption.addEventListener('click', async () => {
                try {
                    const response = await fetch('/api/world-chat/report', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ reporter: window.currentUser, reportedUser: username })
                    });
                    if (response.ok) {
                        showNotification(`User ${username} has been reported.`);
                    } else {
                        showNotification(`Failed to report user ${username}.`);
                    }
                } catch (error) {
                    showNotification(`Error reporting user ${username}.`);
                }
                popup.classList.remove('visible');
            });
        }
    
        popup.appendChild(usernameDisplay);
        popup.appendChild(blockOption);
        popup.appendChild(addOption);
        popup.appendChild(reportOption);
    
        return popup;
    }
    
    function addUserIconListeners() {
        const userIcons = document.querySelectorAll('.user-icon');
        userIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();

                const popups = document.querySelectorAll('.user-popup');
                popups.forEach(popup => popup.classList.remove('visible'));

                const username = icon.getAttribute('data-username');
                let popupMenu = icon.parentNode.querySelector('.user-popup');

                if (!popupMenu) {
                    popupMenu = createPopupMenu(username);
                    icon.parentNode.appendChild(popupMenu);
                }

                popupMenu.classList.add('visible');
            });
        });
    }

    function updateBlockedUsersList() {
        const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers')) || [];
        const blockedUsersList = document.getElementById('blocked-users-list');
        if (blockedUsersList) {
            blockedUsersList.innerHTML = '';
            if (blockedUsers.length === 0) {
                blockedUsersList.innerHTML = '<p>No blocked users.</p>';
            } else {
                blockedUsers.forEach(user => {
                    const userItem = document.createElement('li');
                    userItem.textContent = user;
                    userItem.classList.add('blocked-user');
                    blockedUsersList.appendChild(userItem);

                    const unblockButton = document.createElement('button');
                    unblockButton.textContent = 'Unblock';
                    unblockButton.classList.add('unblock-user');
                    unblockButton.dataset.username = user;
                    unblockButton.addEventListener('click', () => {
                        window.unblockUser(user);
                        updateBlockedUsersList();
                    });
                    userItem.appendChild(unblockButton);
                });
            }
        }
    }

    function updateAddedUsersList() {
        const addedUsers = JSON.parse(localStorage.getItem('addedUsers')) || [];
        const addedUsersList = document.getElementById('added-users-list');
        if (addedUsersList) {
            addedUsersList.innerHTML = '';
            if (addedUsers.length === 0) {
                addedUsersList.innerHTML = '<p>No added users.</p>';
            } else {
                addedUsers.forEach(user => {
                    const userItem = document.createElement('li');
                    userItem.textContent = user;
                    userItem.classList.add('added-user');
                    addedUsersList.appendChild(userItem);
                });
            }
        }
    }

    window.addUser = function(username) {
        const addedUsers = JSON.parse(localStorage.getItem('addedUsers')) || [];
        if (!addedUsers.includes(username)) {
            addedUsers.push(username);
            localStorage.setItem('addedUsers', JSON.stringify(addedUsers));
            updateAddedUsersList();
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('visible');
        }, 10);  // Add delay for CSS transition effect
        
        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => {
                notification.remove();
            }, 300);  // Wait for CSS transition effect to complete
        }, 3000);  // Show notification for 3 seconds
    }

    const messageList = document.getElementById('message-list');
    const observer = new MutationObserver(addUserIconListeners);
    observer.observe(messageList, { childList: true });

    addUserIconListeners();
    updateAddedUsersList();
});
