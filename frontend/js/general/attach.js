document.addEventListener('DOMContentLoaded', () => {
    const attachButton = document.getElementById('attachButton');
    const socket = io('/room-chat'); // Assuming the same namespace as the chatroom

    attachButton.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*'; // Restrict to image files only

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const fileType = file.type;

                // Handle GIFs separately to avoid losing animation
                if (fileType === 'image/gif') {
                    uploadFile(file);
                } else {
                    // Compress and resize other image types
                    new Compressor(file, {
                        quality: 0.3, // Adjust compression quality here (0.3 means 30% of original quality)
                        maxWidth: 1280, // Adjust maximum width here (1280px is a good balance for most devices)
                        maxHeight: 720, // Adjust maximum height here (720px is a good balance for most devices)
                        success(compressedFile) {
                            // The compressed and resized image is now ready to be uploaded
                            uploadFile(compressedFile);
                        },
                        error(err) {
                            console.error('Error compressing file:', err);
                        },
                    });
                }
            }
        });

        fileInput.click();
    });

    function uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        // Send file data to the server using fetch
        fetch('/upload-image', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const timestamp = new Date().toISOString();
                const messageType = 'image';
                const fileUrl = data.fileUrl;

                socket.emit('sendMessage', {
                    content: fileUrl,
                    username: localStorage.getItem('username'),
                    roomId: localStorage.getItem('roomChatId'),
                    timestamp,
                    messageType
                });
            } else {
                console.error('File upload failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        });
    }
});
