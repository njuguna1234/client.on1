// Fetch saved data (content and media) when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            // Populate the content editor
            document.getElementById('content-editor').value = data.content;

            // Populate the media gallery and work section
            const gallery = document.getElementById('media-gallery');
            const workSection = document.getElementById('work-section');
            gallery.innerHTML = '';  // Clear gallery
            workSection.innerHTML = '';  // Clear work section

            data.media.forEach(file => {
                // Add to media gallery
                const mediaElement = document.createElement(file.type.startsWith('image/') ? 'img' : 'video');
                mediaElement.src = file.src;
                mediaElement.controls = file.type.startsWith('video');
                gallery.appendChild(mediaElement);

                // Create a card for the work section
                const card = document.createElement('div');
                card.className = 'media-card';

                // Add media to the card
                const cardMedia = document.createElement(file.type.startsWith('image/') ? 'img' : 'video');
                cardMedia.src = file.src;
                cardMedia.controls = file.type.startsWith('video');
                card.appendChild(cardMedia);

                // Add upload date
                const uploadDate = document.createElement('p');
                uploadDate.textContent = `Uploaded on: ${file.uploadDate}`;
                card.appendChild(uploadDate);

                workSection.appendChild(card);
            });
        });
});

// Save content to server
function saveContent() {
    const content = document.getElementById('content-editor').value;

    fetch('/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error('Error saving content:', error);
            alert('Error saving content. Please try again.');
        });
}

// Upload media files
function uploadMedia() {
    const mediaUpload = document.getElementById('media-upload');
    const files = mediaUpload.files;
    const mediaFiles = Array.from(files).map(file => ({
        src: URL.createObjectURL(file),
        type: file.type
    }));

    fetch('/upload-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaFiles })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            // Refresh data
            location.reload();
        })
        .catch(error => {
            console.error('Error uploading media:', error);
            alert('Error uploading media. Please try again.');
        });
}

// Submit booking form
function submitBooking(event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;

    fetch('/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, date })
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('booking-message').innerText = data.message;
            document.getElementById('booking-form').reset(); // Clear the form
        })
        .catch(error => {
            console.error('Error booking appointment:', error);
            document.getElementById('booking-message').innerText = 'Error booking appointment. Please try again.';
        });
}
