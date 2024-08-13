document.addEventListener('DOMContentLoaded', () => {
    const homeLink = document.getElementById('homeLink');
    
    if (homeLink) {
        homeLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = '/';
        });
    }
});
