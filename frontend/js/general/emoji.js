document.addEventListener('DOMContentLoaded', () => {
    const emojiButton = document.getElementById('emojiButton');
    const chatContainer = document.getElementById('chat-container');
    let recentGifs = [];
    let recentStickers = [];

    const socket = io('/room-chat'); // Ensure socket is connected to the chat room

    // Add necessary event listeners for socket, form, etc.

    emojiButton.addEventListener('click', () => {
        const existingPicker = document.getElementById('emoji-picker');
        if (existingPicker) {
            existingPicker.remove();
            document.removeEventListener('click', handleClickOutside);
        } else {
            const emojiPicker = document.createElement('div');
            emojiPicker.id = 'emoji-picker';

            const gifSearchContainer = createSearchContainer('gif');
            const stickerSearchContainer = createSearchContainer('sticker');

            emojiPicker.appendChild(gifSearchContainer);
            emojiPicker.appendChild(stickerSearchContainer);

            const tabs = document.createElement('div');
            tabs.classList.add('tabs');
            tabs.innerHTML = `
                <button class="tab-button active" data-type="gif">GIFs</button>
                <button class="tab-button" data-type="sticker">Stickers</button>
            `;
            emojiPicker.appendChild(tabs);

            const gifContent = document.createElement('div');
            gifContent.id = 'gif-content';
            gifContent.classList.add('content', 'active-content');

            const stickerContent = document.createElement('div');
            stickerContent.id = 'sticker-content';
            stickerContent.classList.add('content');

            emojiPicker.appendChild(gifContent);
            emojiPicker.appendChild(stickerContent);

            chatContainer.appendChild(emojiPicker);

            loadGifs();
            loadStickers();

            tabs.addEventListener('click', (e) => {
                if (e.target.classList.contains('tab-button')) {
                    document.querySelector('.tab-button.active').classList.remove('active');
                    e.target.classList.add('active');

                    document.querySelector('.content.active-content').classList.remove('active-content');
                    document.getElementById(`${e.target.dataset.type}-content`).classList.add('active-content');

                    document.querySelector('.search-container.active-search').classList.remove('active-search');
                    document.getElementById(`search-container-${e.target.dataset.type}`).classList.add('active-search');
                }
            });

            setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
            }, 0);
        }
    });

    function createSearchContainer(type) {
        const searchContainer = document.createElement('div');
        searchContainer.classList.add('search-container');
        searchContainer.id = `search-container-${type}`;
        searchContainer.innerHTML = `
            <input type="text" id="search-input-${type}" placeholder="Search ${type}s" />
        `;
        searchContainer.querySelector(`#search-input-${type}`).addEventListener('input', handleSearch);
        if (type === 'gif') {
            searchContainer.classList.add('active-search');
        }
        return searchContainer;
    }

    function handleClickOutside(event) {
        const emojiPicker = document.getElementById('emoji-picker');
        if (emojiPicker && !emojiPicker.contains(event.target) && !emojiButton.contains(event.target)) {
            emojiPicker.remove();
            document.removeEventListener('click', handleClickOutside);
        }
    }

    function loadGifs(query = '') {
        const gifContent = document.getElementById('gif-content');
        gifContent.innerHTML = `<div class="recent">Recent</div><div class="gif-grid" id="recent-gifs"></div>`;

        // Populate recent gifs
        recentGifs.forEach(gifUrl => {
            const gifElement = document.createElement('img');
            gifElement.src = gifUrl;
            gifElement.classList.add('gif');
            document.getElementById('recent-gifs').appendChild(gifElement);
            gifElement.addEventListener('click', () => {
                sendGifOrSticker(gifUrl, 'gif');
            });
        });

        const searchUrl = `/api/media/gifs?query=${encodeURIComponent(query)}`;

        fetch(searchUrl)
            .then(response => response.json())
            .then(data => {
                const gifGrid = document.createElement('div');
                gifGrid.classList.add('gif-grid');

                data.data.forEach(gif => {
                    const gifElement = document.createElement('img');
                    gifElement.src = gif.images.fixed_height.url;
                    gifElement.classList.add('gif');
                    gifGrid.appendChild(gifElement);

                    gifElement.addEventListener('click', () => {
                        sendGifOrSticker(gif.images.fixed_height.url, 'gif');
                    });
                });

                gifContent.appendChild(gifGrid);
            });
    }

    function loadStickers(query = '') {
        const stickerContent = document.getElementById('sticker-content');
        stickerContent.innerHTML = `<div class="recent">Recent</div><div class="sticker-grid" id="recent-stickers"></div>`;
        
        // Populate recent stickers
        recentStickers.forEach(stickerUrl => {
            const stickerElement = document.createElement('img');
            stickerElement.src = stickerUrl;
            stickerElement.classList.add('sticker');
            document.getElementById('recent-stickers').appendChild(stickerElement);
            stickerElement.addEventListener('click', () => {
                sendGifOrSticker(stickerUrl, 'sticker');
            });
        });

        const searchUrl = `/api/media/stickers?query=${encodeURIComponent(query)}`;

        fetch(searchUrl)
            .then(response => response.json())
            .then(data => {
                const stickerGrid = document.createElement('div');
                stickerGrid.classList.add('sticker-grid');

                data.results.forEach(sticker => {
                    const stickerElement = document.createElement('img');
                    stickerElement.src = sticker.media_formats.gif.url;
                    stickerElement.classList.add('sticker');
                    stickerGrid.appendChild(stickerElement);
                    
                    stickerElement.addEventListener('click', () => {
                        sendGifOrSticker(sticker.media_formats.gif.url, 'sticker');
                    });
                });

                stickerContent.appendChild(stickerGrid);
            });
    }

    function sendGifOrSticker(url, type) {
        const roomId = localStorage.getItem('roomChatId');
        const username = localStorage.getItem('username');

        if (roomId && username) {
            const timestamp = new Date().toISOString();
            socket.emit('sendMessage', {
                content: url.trim(),
                username,
                roomId,
                timestamp,
                messageType: type
            });

            // Update recent list
            if (type === 'gif') {
                updateRecent(url, recentGifs, 'recent-gifs');
            } else if (type === 'sticker') {
                updateRecent(url, recentStickers, 'recent-stickers');
            }
        } else {
            alert('Username and Room ID are required.');
        }
    }

    function handleSearch(event) {
        const searchType = event.target.id.split('-')[2];
        const query = event.target.value.trim();

        if (searchType === 'gif') {
            loadGifs(query);
        } else if (searchType === 'sticker') {
            loadStickers(query);
        }
    }

    function updateRecent(item, recentList, recentContainerId) {
        if (!recentList.includes(item)) {
            recentList.push(item);
            const recentContainer = document.getElementById(recentContainerId);
            const newItem = document.createElement('img');
            newItem.classList.add(recentContainerId === 'recent-gifs' ? 'gif' : 'sticker');
            newItem.src = item;
            recentContainer.appendChild(newItem);
            newItem.addEventListener('click', () => {
                sendGifOrSticker(item, recentContainerId === 'recent-gifs' ? 'gif' : 'sticker');
            });
        }
    }
});
