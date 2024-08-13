document.getElementById('signInForm').addEventListener('submit', async (e) => {
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

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.status === 200) {
        localStorage.setItem('username', data.user.username); // Store the original case username
        localStorage.setItem('userId', data.user.id); // Save user ID
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
