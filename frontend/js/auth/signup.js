document.getElementById('signUpForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const alertDiv = document.getElementById('alert');

    const showError = (message) => {
        alertDiv.innerText = message;
        alertDiv.style.display = 'block';
        setTimeout(() => {
            alertDiv.style.transition = 'opacity 0.5s ease-out';
            alertDiv.style.opacity = '0';
        }, 3000);
        setTimeout(() => {
            alertDiv.style.display = 'none';
            alertDiv.style.opacity = '1';
            alertDiv.style.transition = '';
        }, 3500);
    };

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        showError('Username can only contain letters, numbers, hyphens, and underscores.');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters long.');
        return;
    }

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.status === 201) {
        // Store the original case username and user ID in local storage
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userId', data.user.id);
        window.location.href = 'mainmenu';
    } else {
        showError(data.message);
    }
});

document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});
