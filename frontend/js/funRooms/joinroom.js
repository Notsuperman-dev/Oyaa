document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('joinRoomForm');
    const passwordField = document.getElementById('password');
    const passwordGroup = document.querySelector('.password-group');
    const passwordToggle = document.getElementById('togglePassword');
    const nameError = document.getElementById('nameError');
    const passwordError = document.getElementById('passwordError');
    const formError = document.getElementById('formError');

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.toLowerCase(); // Convert to lowercase
        const password = passwordField.value;

        // Validate room name
        if (!isValidRoomName(name)) {
            showFormError('Invalid room name. Only letters, numbers, hyphens, and underscores are allowed.');
            return;
        }

        try {
            const checkResponse = await fetch(`/api/rooms/check?name=${name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (checkResponse.ok) {
                const roomData = await checkResponse.json();

                // Check if room requires a password
                if (roomData.requiresPassword) {
                    passwordGroup.style.display = 'block'; // Show password field
                    if (!password) {
                        showFormError('This room requires a password.');
                        return;
                    }
                } else {
                    passwordGroup.style.display = 'none'; // Hide password field
                }

                await joinRoom(name, password);

            } else {
                const error = await checkResponse.json();
                showFormError(error.message);
            }
        } catch (err) {
            showFormError('An error occurred. Please try again.');
        }
    });

    // Toggle password visibility
    if (passwordToggle) {
        passwordToggle.addEventListener('click', () => {
            const type = passwordField.type === 'password' ? 'text' : 'password';
            passwordField.type = type;
            passwordToggle.querySelector('i').classList.toggle('fa-eye');
            passwordToggle.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    function isValidRoomName(name) {
        const regex = /^[a-zA-Z0-9-_]+$/;
        return regex.test(name);
    }

    async function joinRoom(name, password = '') {
        try {
            const response = await fetch('/api/rooms/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: name.toLowerCase(), password }) // Convert to lowercase
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('roomChatId', data.id);
                localStorage.setItem('roomName', name);  // Store room name
                saveRoomToLocalStorage(name);  // Save room to local storage
                window.location.href = '/chatrooms';
            } else {
                const error = await response.json();
                showFormError(error.message);
            }
        } catch (err) {
            showFormError('An error occurred. Please try again.');
        }
    }

    function showFormError(message) {
        formError.textContent = message;
        formError.style.display = 'block'; // Ensure error message is visible
    }

    function saveRoomToLocalStorage(roomName) {
        let rooms = JSON.parse(localStorage.getItem('myRooms')) || [];
        if (!rooms.includes(roomName)) {
            rooms.push(roomName);
            localStorage.setItem('myRooms', JSON.stringify(rooms));
        }
    }
});
