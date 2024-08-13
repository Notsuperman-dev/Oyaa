document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    const userDisplayName = document.getElementById('user-display-name');
    const usernameInput = document.getElementById('username');

    // Display Messages
    const displayMessage = (element, message, isError = false) => {
        element.textContent = message;
        element.style.color = isError ? 'red' : 'green';
    };

    // Fetch User Data
    fetch(`/api/user/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            return response.json();
        })
        .then(data => {
            if (data.user) {
                const { username } = data.user;
                userDisplayName.textContent = username;
                usernameInput.value = username;
                localStorage.setItem('username', username);
            } else {
                displayMessage(document.getElementById('username-update-message'), 'Failed to fetch user data', true);
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            displayMessage(document.getElementById('username-update-message'), 'Error fetching user data', true);
        });

    // Update Username
    document.getElementById('username-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = usernameInput.value;

        try {
            const response = await fetch(`/api/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred');
            }

            const result = await response.json();
            displayMessage(document.getElementById('username-update-message'), 'Username updated successfully');
            userDisplayName.textContent = username;
            localStorage.setItem('username', username);
        } catch (error) {
            displayMessage(document.getElementById('username-update-message'), error.message, true);
        }
    });

    // Change Password
    document.getElementById('password-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('password').value;

        try {
            const response = await fetch(`/api/user/${userId}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oldPassword, password: newPassword }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred');
            }

            const result = await response.json();
            displayMessage(document.getElementById('password-update-message'), 'Password changed successfully');
        } catch (error) {
            displayMessage(document.getElementById('password-update-message'), error.message, true);
        }
    });

    // Delete User Account with Confirmation
    document.getElementById('delete-account').addEventListener('click', () => {
        // Create confirmation dialog
        const confirmDialog = document.createElement('div');
        confirmDialog.classList.add('confirm-dialog');

        confirmDialog.innerHTML = `
            <div class="confirm-dialog-content">
                <p>Are you sure you want to delete your account?</p>
                <button id="confirm-yes" class="confirm-button">Yes</button>
                <button id="confirm-no" class="confirm-button">No</button>
            </div>
        `;

        document.body.appendChild(confirmDialog);

        // Handle Yes/No clicks
        document.getElementById('confirm-yes').addEventListener('click', async () => {
            try {
                const response = await fetch(`/api/user/${userId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'An error occurred');
                }

                const result = await response.json();
                displayMessage(document.getElementById('delete-message'), 'User deleted successfully');
                // Redirect to home page or login page
                window.location.href = '/';
            } catch (error) {
                displayMessage(document.getElementById('delete-message'), error.message, true);
            } finally {
                document.body.removeChild(confirmDialog);
            }
        });

        document.getElementById('confirm-no').addEventListener('click', () => {
            document.body.removeChild(confirmDialog);
        });
    });

    // Toggle Password Visibility
    const togglePasswordVisibility = (toggleId, passwordId) => {
        document.getElementById(toggleId).addEventListener('click', () => {
            const passwordInput = document.getElementById(passwordId);
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const toggleIcon = document.getElementById(toggleId);
            toggleIcon.classList.toggle('fa-eye');
            toggleIcon.classList.toggle('fa-eye-slash');
        });
    };

    togglePasswordVisibility('toggleOldPassword', 'old-password');
    togglePasswordVisibility('toggleNewPassword', 'password');
});
