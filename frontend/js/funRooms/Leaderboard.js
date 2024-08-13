document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/leaderboard')
        .then(response => response.json())
        .then(users => {
            const topUserSection = document.getElementById('top-user-section');
            const otherUsersSection = document.getElementById('other-users-section');

            // Limit the number of users to the top 100
            const maxUsers = 100;
            const topUsers = users.slice(0, maxUsers);

            topUsers.forEach((user, index) => {
                const userRow = document.createElement('div');

                if (index === 0) {
                    // Top user section
                    userRow.classList.add('top-user-row');

                    // Create an image element
                    const winnerImage = document.createElement('img');
                    winnerImage.src = '/images/winner.png';
                    winnerImage.alt = 'Winner Ribbon';

                    // Create a container for the username to overlay on the image
                    const usernameContainer = document.createElement('div');
                    usernameContainer.classList.add('overlay');

                    // Username text
                    const usernameText = document.createTextNode(user.username);
                    usernameContainer.appendChild(usernameText);

                    // Likes text
                    const likesText = document.createElement('span');
                    likesText.classList.add('likes');
                    likesText.textContent = `👍 ${user.totalLikes}`;
                    likesText.style.display = 'block';

                    // Append the likes to the username container
                    usernameContainer.appendChild(likesText);

                    userRow.appendChild(winnerImage);
                    userRow.appendChild(usernameContainer);

                    topUserSection.appendChild(userRow);
                } else {
                    // Other users section
                    userRow.classList.add('user-row', 'grid-layout');

                    const rank = document.createElement('span');
                    rank.classList.add('rank');
                    rank.textContent = index + 1;

                    const username = document.createElement('span');
                    username.classList.add('username');
                    username.textContent = user.username;

                    const likes = document.createElement('span');
                    likes.classList.add('likes');
                    likes.textContent = `👍 ${user.totalLikes}`;

                    userRow.appendChild(rank);
                    userRow.appendChild(username);
                    userRow.appendChild(likes);

                    otherUsersSection.appendChild(userRow);
                }
            });
        })
        .catch(error => console.error('Error fetching leaderboard:', error));
});
