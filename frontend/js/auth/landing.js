document.getElementById('signUpBtn').addEventListener('click', () => {
    window.location.href = 'signup';
});

document.getElementById('signInBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/auth/check-session', {
            method: 'POST', // Ensure this matches your backend route
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error('Failed to check session');
        }

        const data = await response.json();

        if (data.valid) {
            // If the session is valid, redirect to the main menu
            window.location.href = 'mainmenu';
        } else {
            // If no valid session, redirect to the sign-in page
            window.location.href = 'signin';
        }
    } catch (error) {
        console.error('Error checking session:', error);
        window.location.href = 'signin'; // Redirect to sign-in page on error
    }
});

document.getElementById('getStartedBtn').addEventListener('click', () => {
    document.getElementById('popupMenu').classList.add('active');
    document.getElementById('popupOverlay').classList.add('active');
});

document.getElementById('popupSignInBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/auth/check-session', {
            method: 'POST', // Ensure this matches your backend route
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error('Failed to check session');
        }

        const data = await response.json();

        if (data.valid) {
            // If the session is valid, redirect to the main menu
            window.location.href = 'mainmenu';
        } else {
            // If no valid session, redirect to the sign-in page
            window.location.href = 'signin';
        }
    } catch (error) {
        console.error('Error checking session:', error);
        window.location.href = 'signin'; // Redirect to sign-in page on error
    }
});

document.getElementById('popupSignUpBtn').addEventListener('click', () => {
    window.location.href = 'signup';
});

// Close pop-up when clicking outside of it
document.getElementById('popupOverlay').addEventListener('click', () => {
    document.getElementById('popupMenu').classList.remove('active');
    document.getElementById('popupOverlay').classList.remove('active');
});
