// frontend\js\funRooms\trending.js
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const roomsContainer = document.getElementById('roomsContainer');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const noMoreRoomsMessage = document.getElementById('noMoreRoomsMessage');
    const loadingLogo = document.getElementById('loadingLogo');

    let currentPage = 1;
    const limit = 20;
    let isLoading = false;
    let noMoreRooms = false;
    let initialLoad = true;

    async function fetchRooms(page, limit) {
        console.log('Fetching rooms for page:', page);
        try {
            const response = await fetch(`/api/trending?page=${page}&limit=${limit}`);
            const rooms = await response.json();
            console.log('Fetched rooms:', rooms);
            return rooms;
        } catch (error) {
            console.error('Error fetching rooms:', error);
            return [];
        }
    }

    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    function displayRooms(rooms) {
        if (rooms.length === 0) {
            if (!noMoreRooms) {
                noMoreRoomsMessage.style.display = 'block';
                noMoreRooms = true;
            }
            return;
        }

        rooms.forEach((room) => {
            const roomElement = document.createElement('div');
            roomElement.className = 'room';

            const rankClass = room.rank === 1 ? 'rank number-1' : 'rank';

            const onlineIndicatorColor = room.userCount > 0 ? 'var(--online-indicator)' : '#dc3545';

            roomElement.innerHTML = `
                <div class="${rankClass}">${room.rank}</div>
                <div class="name">${truncateText(room.name, 10)}</div>
                <div class="users">
                    <div class="online-indicator" style="background-color: ${onlineIndicatorColor};"></div>
                    <span>${room.userCount} Users</span>
                </div>
                <div class="description">${truncateText(room.description, 30)}</div>
            `;
            roomElement.addEventListener('click', () => joinRoom(room.name));
            roomsContainer.appendChild(roomElement);
        });
    }

    async function loadMoreRooms() {
        if (noMoreRooms) return;

        isLoading = true;
        loadingIndicator.style.display = 'block';

        currentPage += 1;

        const newRooms = await fetchRooms(currentPage, limit);
        if (newRooms.length > 0) {
            displayRooms(newRooms);
        } else {
            console.log('No more rooms to load');
            noMoreRooms = true;
            noMoreRoomsMessage.style.display = 'block';
        }

        loadingIndicator.style.display = 'none';
        isLoading = false;
    }

    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
            loadMoreRooms();
        }
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        currentPage = 1;
        noMoreRooms = false;
        noMoreRoomsMessage.style.display = 'none';

        roomsContainer.innerHTML = '';
        loadingLogo.style.display = 'block';

        if (query) {
            searchRooms(query).then(() => {
                loadingLogo.style.display = 'none';
            });
        } else {
            fetchRooms(currentPage, limit).then(rooms => {
                loadingLogo.style.display = 'none';
                displayRooms(rooms);
            });
        }
    });

    async function searchRooms(query) {
        console.log(`Searching rooms with query: ${query}`);
        try {
            const response = await fetch(`/api/trending/search?query=${query}`);
            const rooms = await response.json();
            console.log('Rooms found:', rooms);

            roomsContainer.innerHTML = '';

            if (rooms.length > 0) {
                displayRooms(rooms);
            } else {
                noMoreRoomsMessage.style.display = 'block';
                noMoreRoomsMessage.textContent = 'No rooms found for the search.';
            }
        } catch (error) {
            console.error('Error searching rooms:', error);
        }
    }

    async function joinRoom(roomName) {
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

    fetchRooms(currentPage, limit).then(rooms => {
        loadingLogo.style.display = 'none';
        initialLoad = false;
        displayRooms(rooms);
    });

    if (initialLoad) {
        loadingLogo.style.display = 'block';
    }
});
