document.addEventListener('DOMContentLoaded', async () => {
    const blacklistContainer = document.getElementById('blacklist-container');

    try {
        const response = await fetch('/api/world-chat/reported-users');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const reportedUsers = await response.json();

        if (reportedUsers.length === 0) {
            blacklistContainer.innerHTML = '<p>No reported users.</p>';
        } else {
            // Sort users by report count in descending order
            reportedUsers.sort((a, b) => b.reportCount - a.reportCount);

            reportedUsers.forEach((user, index) => {
                const listItem = document.createElement('li');
                listItem.classList.add('blacklist-item');
                listItem.dataset.username = user.username;

                const rank = document.createElement('div');
                rank.classList.add('rank');
                rank.textContent = index + 1;

                const username = document.createElement('div');
                username.classList.add('username');
                username.textContent = user.username;

                const reportCount = document.createElement('div');
                reportCount.classList.add('report-count');
                reportCount.textContent = `${user.reportCount} Reports`;

                listItem.appendChild(rank);
                listItem.appendChild(username);
                listItem.appendChild(reportCount);

                blacklistContainer.appendChild(listItem);
            });
        }

        // Add event listener to each blacklist item
        document.querySelectorAll('.blacklist-item').forEach(item => {
            item.addEventListener('click', async () => {
                const username = item.dataset.username;
                await showReporters(username);
            });
        });

    } catch (error) {
        console.error('Error fetching reported users:', error);
        blacklistContainer.innerHTML = '<p>Error fetching reported users.</p>';
    }
});

// Function to fetch and show reporters for a specific user
async function showReporters(username) {
    try {
        const response = await fetch(`/api/world-chat/reported-users/${username}/reporters`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const reporters = await response.json();
        const reporterList = reporters.map(reporter => `<li>${reporter}</li>`).join('');
        document.getElementById('reporter-list').innerHTML = reporterList;
        document.getElementById('modal-username').textContent = username;
        document.getElementById('reporter-modal').style.display = 'block';
    } catch (error) {
        console.error(`Error fetching reporters for ${username}:`, error);
        alert('Error fetching reporters.');
    }
}

// Close the modal
document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('reporter-modal').style.display = 'none';
});
