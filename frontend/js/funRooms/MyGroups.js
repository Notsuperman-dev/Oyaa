document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const myGroupsContainer = document.getElementById('myGroupsContainer');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const noMoreGroupsMessage = document.getElementById('noMoreGroupsMessage');
    const loadingLogo = document.getElementById('loadingLogo');

    let currentPage = 1;
    const limit = 20;
    let isLoading = false;
    let noMoreGroups = false;
    let initialLoad = true;
    let allSortedRooms = [];

    fetchAndSortMyGroups();

    searchForm.addEventListener('submit', searchGroups);

    async function fetchAndSortMyGroups(searchQuery = '') {
        isLoading = true;

        if (!initialLoad) {
            loadingIndicator.style.display = 'block';
        }

        try {
            const rooms = JSON.parse(localStorage.getItem('myRooms')) || [];
            if (rooms.length === 0) {
                displayNoGroupsMessage('You have not joined or created any rooms yet.');
                return;
            }

            const filteredRooms = rooms.filter(roomName =>
                roomName.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredRooms.length === 0) {
                displayNoGroupsMessage('No matching groups found.');
                return;
            }

            const response = await fetch('/api/rooms/userCounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ roomNames: filteredRooms })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user counts');
            }

            const userCounts = await response.json();
            allSortedRooms = filteredRooms.sort((a, b) => (userCounts[b] || 0) - (userCounts[a] || 0));

            displayRoomsBatch();
        } catch (error) {
            console.error('Error fetching user counts:', error);
            displayNoGroupsMessage('Error fetching user counts. Please try again later.');
        } finally {
            if (!initialLoad) {
                loadingIndicator.style.display = 'none';
            }
            loadingLogo.style.display = 'none';
            isLoading = false;
            initialLoad = false;
        }
    }

    function displayRoomsBatch() {
        if (noMoreGroups) return;

        const paginatedRooms = allSortedRooms.slice((currentPage - 1) * limit, currentPage * limit);

        if (paginatedRooms.length === 0) {
            noMoreGroups = true;
            noMoreGroupsMessage.style.display = 'block';
            return;
        }

        fetch('/api/rooms/userCounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomNames: paginatedRooms })
        })
        .then(response => response.json())
        .then(userCounts => {
            displayRooms(paginatedRooms, userCounts);
            currentPage += 1;
        })
        .catch(error => {
            console.error('Error fetching user counts:', error);
            displayNoGroupsMessage('Error fetching user rooms. Please try again later.');
        });
    }

    function displayNoGroupsMessage(message) {
        const noGroupsMessage = document.createElement('p');
        noGroupsMessage.textContent = message;
        noGroupsMessage.classList.add('no-groups-message');
        myGroupsContainer.innerHTML = '';
        myGroupsContainer.appendChild(noGroupsMessage);
    }

    function displayRooms(rooms, userCounts) {
        rooms.forEach(roomName => {
            const groupElement = document.createElement('div');
            groupElement.classList.add('group');

            const roomNameElement = document.createElement('h3');
            roomNameElement.textContent = roomName.length > 10 ? roomName.substring(0, 7) + '...' : roomName;
            groupElement.appendChild(roomNameElement);

            const usersOnlineElement = document.createElement('div');
            usersOnlineElement.classList.add('users-online');

            const onlineIndicatorElement = document.createElement('div');
            onlineIndicatorElement.classList.add('online-indicator');

            const userCount = userCounts[roomName] || 0;
            if (userCount === 0) {
                onlineIndicatorElement.style.backgroundColor = 'red';
            } else {
                onlineIndicatorElement.style.backgroundColor = 'green';
            }

            usersOnlineElement.appendChild(onlineIndicatorElement);

            const userCountText = document.createElement('span');
            userCountText.textContent = `${userCount} Users`;
            usersOnlineElement.appendChild(userCountText);

            groupElement.appendChild(usersOnlineElement);

            groupElement.addEventListener('click', () => enterRoom(roomName));

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteRoom(roomName);
            });
            groupElement.appendChild(deleteButton);

            myGroupsContainer.appendChild(groupElement);
        });
    }

    function searchGroups(event) {
        event.preventDefault();
        const searchQuery = searchInput.value.trim();
        resetGroupsList();
        fetchAndSortMyGroups(searchQuery);
    }

    function resetGroupsList() {
        myGroupsContainer.innerHTML = '';
        currentPage = 1;
        noMoreGroups = false;
        noMoreGroupsMessage.style.display = 'none';
        loadingLogo.style.display = 'block';
    }

    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
            displayRoomsBatch();
        }
    });

    async function enterRoom(roomName) {
        try {
            const response = await fetch('/api/rooms/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: roomName.toLowerCase() })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('roomChatId', data.id);
                localStorage.setItem('roomName', roomName);

                const myRooms = JSON.parse(localStorage.getItem('myRooms')) || [];
                if (!myRooms.includes(roomName)) {
                    myRooms.push(roomName);
                    localStorage.setItem('myRooms', JSON.stringify(myRooms));
                }

                window.location.href = '/chatrooms';
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (err) {
            alert('An error occurred. Please try again.');
        }
    }

    function deleteRoom(roomName) {
        let rooms = JSON.parse(localStorage.getItem('myRooms')) || [];
        rooms = rooms.filter(room => room !== roomName);
        localStorage.setItem('myRooms', JSON.stringify(rooms));
        resetGroupsList();
        fetchAndSortMyGroups();
    }

    if (initialLoad) {
        loadingLogo.style.display = 'block';
    }
});
