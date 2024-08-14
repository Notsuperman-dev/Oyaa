document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');

    if (username) {
        document.getElementById('username').innerText = username;
        
        // Fetch leaderboard and check if the logged-in user is the top user
        fetch('/api/leaderboard')
            .then(response => response.json())
            .then(users => {
                if (users.length > 0 && users[0].username === username) {
                    const usernameElement = document.getElementById('username');
                    const crown = document.createElement('span');
                    crown.classList.add('crown');
                    crown.textContent = '👑';
                    usernameElement.appendChild(crown);

                    // Add top-user class to body and change user icon
                    document.body.classList.add('top-user');
                    const userIcon = document.getElementById('userIcon');
                    userIcon.style.backgroundImage = 'var(--top-user-icon)';
                }
            })
            .catch(error => console.error('Error fetching leaderboard:', error));
        
    } else {
        // Redirect to the homepage if no username is found
        window.location.href = '/';
    }

    const buttons = [
        { id: 'joinWorldChatBtn', href: '/worldchat' },
        { id: 'friendsBtn', href: '/friends' },
        { id: 'trendingBtn', href: '/trending' },
        { id: 'myGroupsBtn', href: '/MyGroup' },
        { id: 'leaderBoardBtn', href: '/leaderboard' },
        { id: 'settingsBtn', href: '/settings' }
    ];

    buttons.forEach(button => {
        const element = document.getElementById(button.id);
        if (element) {
            element.addEventListener('click', () => {
                window.location.href = button.href;
            });
        } else {
            console.error(`Element with id ${button.id} not found`);
        }
    });

    document.getElementById('funRoomBtn').addEventListener('click', (event) => {
        event.stopPropagation();
        window.toggleFunRoomMenu(window.funRoomMenu, event.currentTarget);
    });
});
