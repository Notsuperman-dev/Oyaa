document.addEventListener('DOMContentLoaded', () => {
    const settingsIcon = document.getElementById('settingsIcon');
    const userIcon = document.getElementById('userIcon');

    const settingsMenu = document.createElement('div');
    settingsMenu.className = 'popup-menu settings-menu';
    settingsMenu.innerHTML = `
        <label class="switch">
            <input type="checkbox" id="theme-toggle">
            <span class="slider">
                
                <i class="fas fa-moon moon-icon"></i>
            </span>
        </label>
        <a href="/settings">Settings</a>
        <a href="#" id="logoutBtn">Log Out</a>
    `;
    document.body.appendChild(settingsMenu);

    const userMenu = document.createElement('div');
    userMenu.className = 'popup-menu user-menu';
    userMenu.innerHTML = `
        <a href="/bio">Bio</a>
        <a href="/kinship">Kinship</a>
        <a href="/blocked-users">Blocked Users</a>
        <a href="/blacklist">Blacklist</a>
    `;
    document.body.appendChild(userMenu);

    window.funRoomMenu = document.createElement('div');
    funRoomMenu.className = 'popup-menu fun-room-menu';
    funRoomMenu.innerHTML = `
        <a href="/createroom">Create a Room</a>
        <a href="/joinroom">Join a Room</a>
    `;
    document.body.appendChild(funRoomMenu);

    window.toggleFunRoomMenu = function(menu, icon) {
        if (menu.style.display === 'flex') {
            menu.style.display = 'none';
        } else {
            menu.style.display = 'flex';
            const iconRect = icon.getBoundingClientRect();
            const menuRect = menu.getBoundingClientRect();
            const spaceBelow = window.innerHeight - iconRect.bottom;
            const spaceAbove = iconRect.top;
            const spaceRight = window.innerWidth - iconRect.right;

            if (spaceBelow < menuRect.height && spaceAbove > menuRect.height) {
                menu.style.top = `${iconRect.top - menuRect.height}px`;
            } else {
                menu.style.top = `${iconRect.bottom}px`;
            }

            if (iconRect.left < menuRect.width) {
                menu.style.left = `${iconRect.left}px`;
                menu.style.right = 'auto';
            } else {
                menu.style.right = `${spaceRight}px`;
                menu.style.left = 'auto';
            }
        }
    };

    function toggleMenu(menu, icon) {
        if (menu.style.display === 'flex') {
            menu.style.display = 'none';
        } else {
            menu.style.display = 'flex';
            const iconRect = icon.getBoundingClientRect();
            const menuRect = menu.getBoundingClientRect();
            const spaceBelow = window.innerHeight - iconRect.bottom;
            const spaceAbove = iconRect.top;
            const spaceRight = window.innerWidth - iconRect.right;

            if (spaceBelow < menuRect.height && spaceAbove > menuRect.height) {
                menu.style.top = `${iconRect.top - menuRect.height}px`;
            } else {
                menu.style.top = `${iconRect.bottom}px`;
            }

            if (iconRect.left < menuRect.width) {
                menu.style.left = `${iconRect.left}px`;
                menu.style.right = 'auto';
            } else {
                menu.style.right = `${spaceRight}px`;
                menu.style.left = 'auto';
            }
        }
    }

    settingsIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleMenu(settingsMenu, settingsIcon);
    });

    userIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleMenu(userMenu, userIcon);
    });

    document.addEventListener('click', () => {
        settingsMenu.style.display = 'none';
        userMenu.style.display = 'none';
        funRoomMenu.style.display = 'none';
    });

    document.getElementById('logoutBtn').addEventListener('click', async (event) => {
        event.stopPropagation();
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            window.location.href = '/';
        } else {
            alert('Logout failed');
        }
    });

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    };

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.checked = savedTheme === 'dark';
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);

        const event = new CustomEvent('themeChanged', { detail: newTheme });
        document.dispatchEvent(event);
    });

    document.addEventListener('themeChanged', (event) => {
        applyTheme(event.detail);
    });

    window.addEventListener('pageshow', () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        applyTheme(currentTheme);
    });
});
