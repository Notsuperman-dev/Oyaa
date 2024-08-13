document.addEventListener('DOMContentLoaded', () => {
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
                    userItem.classList.add('added-user');
                    
                    const userName = document.createElement('span');
                    userName.textContent = user;
                    
                    const removeButton = document.createElement('button');
                    removeButton.textContent = 'X';
                    removeButton.classList.add('remove-friend');
                    removeButton.dataset.username = user;
                    removeButton.addEventListener('click', () => {
                        removeUser(user);
                        updateAddedUsersList();
                    });

                    userItem.appendChild(userName);
                    userItem.appendChild(removeButton);
                    addedUsersList.appendChild(userItem);
                });
            }
        }
    }

    function removeUser(username) {
        let addedUsers = JSON.parse(localStorage.getItem('addedUsers')) || [];
        addedUsers = addedUsers.filter(user => user !== username);
        localStorage.setItem('addedUsers', JSON.stringify(addedUsers));
    }

    updateAddedUsersList();
});
