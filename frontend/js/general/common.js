document.addEventListener('DOMContentLoaded', () => {
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
        console.log(`Current theme: ${theme}`);
    };

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.checked = savedTheme === 'dark';
        themeToggle.addEventListener('change', () => {
            const newTheme = themeToggle.checked ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);

            const event = new CustomEvent('themeChanged', { detail: newTheme });
            document.dispatchEvent(event);
        });
    }

    document.addEventListener('themeChanged', (event) => {
        applyTheme(event.detail);
    });

    window.addEventListener('pageshow', () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        applyTheme(currentTheme);
    });
});
