document.addEventListener('DOMContentLoaded', () => {
    const blockedUsersList = document.getElementById('blocked-users-list');

    function updateBlockedUsersList() {
        const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers')) || [];
        blockedUsersList.innerHTML = '';
        
        if (blockedUsers.length === 0) {
            blockedUsersList.innerHTML = '<p>No blocked users.</p>';
        } else {
            blockedUsers.forEach(user => {
                const userItem = document.createElement('li');
                userItem.textContent = user;
                userItem.classList.add('blocked-user');

                const unblockButton = document.createElement('button');
                unblockButton.textContent = 'Unblock';
                unblockButton.classList.add('unblock-user');
                unblockButton.dataset.username = user;
                unblockButton.addEventListener('click', () => {
                    unblockUser(user);
                    updateBlockedUsersList();
                });

                userItem.appendChild(unblockButton);
                blockedUsersList.appendChild(userItem);
            });
        }
    }

    function unblockUser(username) {
        let blockedUsers = JSON.parse(localStorage.getItem('blockedUsers')) || [];
        blockedUsers = blockedUsers.filter(user => user !== username);
        localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
        updateBlockedUsersList();
    }

    updateBlockedUsersList();
});
