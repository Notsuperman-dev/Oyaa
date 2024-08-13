// bio.js

document.addEventListener('DOMContentLoaded', () => {
    const bioForm = document.getElementById('bioForm');
    const bioInput = document.getElementById('bioInput');
    const bioMessage = document.getElementById('bioMessage');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const bioContainer = document.getElementById('bioContainer');

    // Load the saved bio from localStorage if it exists
    const savedBio = localStorage.getItem('bio');
    if (savedBio) {
        populateBio(savedBio);
    }

    // Retrieve the username from localStorage
    const username = localStorage.getItem('username');
    if (username) {
        usernameDisplay.innerText = ` ${username}`;
    } else {
        usernameDisplay.innerText = 'No username found';
    }

    bioForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const bio = getBioKeywords();
        localStorage.setItem('bio', bio);

        bioMessage.innerText = 'Bio saved successfully!';
        bioMessage.classList.remove('fade-out');
        
        // Fade out after 2 seconds
        setTimeout(() => {
            bioMessage.classList.add('fade-out');
        }, 2000);
    });

    bioInput.addEventListener('input', handleDescriptionInput);
    bioInput.addEventListener('keydown', handleDescriptionKeydown);
    bioInput.addEventListener('blur', handleDescriptionBlur);

    function populateBio(bio) {
        const keywords = bio.split(' ');
        keywords.forEach(keyword => {
            if (keyword.trim()) {
                createBubble(keyword.trim());
            }
        });
    }

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

    function handleDescriptionKeydown(e) {
        if (e.key === 'Backspace' && !e.target.value) {
            const lastBubble = bioInput.previousElementSibling;
            if (lastBubble && lastBubble.classList.contains('bubble')) {
                bioInput.value = lastBubble.querySelector('.bubble-text').textContent.replace('#', '');
                lastBubble.remove();
            }
        }
    }

    function handleDescriptionBlur(e) {
        if (e.target.value.trim()) {
            createBubble(e.target.value.trim());
            e.target.value = '';
        }
    }

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

        bioInput.insertAdjacentElement('beforebegin', bubble);
    }

    function getBioKeywords() {
        const bubbles = bioContainer.querySelectorAll('.bubble');
        return Array.from(bubbles).map(bubble => bubble.querySelector('.bubble-text').textContent).join(' ');
    }

    function formatText(text) {
        return text.startsWith('#') ? text : `#${text}`;
    }
});
