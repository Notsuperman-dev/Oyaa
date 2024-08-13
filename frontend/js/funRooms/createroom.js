document.addEventListener('DOMContentLoaded', () => {
    const createRoomForm = document.getElementById('createRoomForm');
    const privateCheckbox = document.getElementById('private');
    const passwordGroup = document.querySelector('.password-group');
    const nameError = document.getElementById('nameError');
    const passwordError = document.getElementById('passwordError');
    const formError = document.getElementById('formError'); // Make sure this element is properly defined
    const descriptionInput = document.getElementById('description');
    const togglePasswordIcon = document.getElementById('togglePassword');

    // Handle private checkbox change
    if (privateCheckbox) {
        privateCheckbox.addEventListener('change', () => {
            if (privateCheckbox.checked) {
                passwordGroup.style.display = 'block';
            } else {
                passwordGroup.style.display = 'none';
            }
        });
    }

    // Handle form submission
    if (createRoomForm) {
        createRoomForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            const isPrivate = privateCheckbox.checked;
            const description = ensureHashtags(getDescriptionKeywords());

            // Validate room name
            if (!isValidRoomName(name)) {
                showFormError('Invalid room name. Only letters, numbers, hyphens, and underscores are allowed.');
                return;
            }

            // Validate that the description is not empty
            if (!description || description.trim() === '') {
                showFormError('Description cannot be empty. Please enter a description.');
                return;
            }

            // Validate description keywords
            if (!isValidDescription(description)) {
                showFormError('Kindly describe the room');
                return;
            }

            const requestBody = { name, password: isPrivate ? password : '', description, isPrivate };

            try {
                const response = await fetch('/api/rooms/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('roomChatId', data.id);
                    localStorage.setItem('roomName', name);
                    saveRoomToLocalStorage(name);  // Save room to local storage
                    window.location.href = '/chatrooms';
                } else {
                    const error = await response.json();
                    showFormError(error.message);
                }
            } catch (err) {
                showFormError('An error occurred. Please try again.');
            }
        });
    }

    // Handle password visibility toggle
    if (togglePasswordIcon) {
        togglePasswordIcon.addEventListener('click', () => {
            const passwordInput = document.getElementById('password');
            const icon = togglePasswordIcon.querySelector('i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    }

    // Handle description input
    if (descriptionInput) {
        descriptionInput.addEventListener('input', handleDescriptionInput);
        descriptionInput.addEventListener('keydown', handleDescriptionKeydown);
        descriptionInput.addEventListener('blur', handleDescriptionBlur);
    }

    // Function to handle description input
    function handleDescriptionInput(e) {
        if (e.inputType === 'deleteContentBackward') return;
        const value = e.target.value;
        const lastChar = value[value.length - 1];

        if (lastChar === ' ') {
            createBubble(value.trim());
            e.target.value = '';
        } else {
            e.target.value = formatText(value);
        }
    }

    // Function to handle description keydown
    function handleDescriptionKeydown(e) {
        if (e.key === 'Backspace' && !e.target.value) {
            const lastBubble = descriptionInput.previousElementSibling;
            if (lastBubble && lastBubble.classList.contains('bubble')) {
                descriptionInput.value = lastBubble.querySelector('.bubble-text').textContent.replace('#', '');
                lastBubble.remove();
            }
        }
    }

    // Function to handle description blur
    function handleDescriptionBlur(e) {
        if (e.target.value.trim()) {
            createBubble(e.target.value.trim());
            e.target.value = '';
        }
    }

    // Function to create a bubble for description keywords
    function createBubble(text) {
        const bubble = document.createElement('span');
        bubble.className = 'bubble';

        const bubbleText = document.createElement('span');
        bubbleText.className = 'bubble-text';
        bubbleText.textContent = text.startsWith('#') ? text : `#${text}`;
        bubble.appendChild(bubbleText);

        const closeButton = document.createElement('span');
        closeButton.className = 'bubble-close';
        closeButton.textContent = '×';
        bubble.appendChild(closeButton);

        closeButton.addEventListener('click', () => {
            bubble.remove();
        });

        descriptionInput.insertAdjacentElement('beforebegin', bubble);
    }

    // Function to get description keywords from bubbles
    function getDescriptionKeywords() {
        const bubbles = descriptionInput.parentNode.querySelectorAll('.bubble');
        return Array.from(bubbles).map(bubble => bubble.querySelector('.bubble-text').textContent).join(' ');
    }

    // Function to format text with hashtags
    function formatText(text) {
        return text.startsWith('#') ? text : `#${text}`;
    }

    // Function to validate room name
    function isValidRoomName(name) {
        const regex = /^[a-zA-Z0-9-_]+$/;
        return regex.test(name);
    }

    // Function to validate description
    function isValidDescription(description) {
        const regex = /^(#\w+\s)*#\w+$/;
        return regex.test(description);
    }

    // Function to show form error message
    function showFormError(message) {
        formError.textContent = message;
        formError.style.display = 'block'; // Ensure the error is visible
    }

    // Function to ensure all words have hashtags
    function ensureHashtags(value) {
        const words = value.split(' ');
        return words.map(word => word.startsWith('#') ? word : `#${word}`).join(' ');
    }

    // Function to save room to local storage
    function saveRoomToLocalStorage(roomName) {
        let rooms = JSON.parse(localStorage.getItem('myRooms')) || [];
        if (!rooms.includes(roomName)) {
            rooms.push(roomName);
            localStorage.setItem('myRooms', JSON.stringify(rooms));
        }
    }
});
