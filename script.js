document.addEventListener('DOMContentLoaded', () => {
    // Load collections and tracks for index.html
    if (document.body.id === 'index-page') {
        loadContent();
    }

    // Load collections and prepare form for add.html
    if (document.body.id === 'add-page') {
        loadCollections();
        
        document.getElementById('collection').addEventListener('change', function() {
            const newCollectionInput = document.getElementById('new-collection');
            newCollectionInput.style.display = (this.value === 'new') ? 'inline' : 'none';
        });

        document.getElementById('upload-form').addEventListener('submit', function(event) {
            event.preventDefault();

            const trackTitle = document.getElementById('track-title').value;
            const trackFile = document.getElementById('track-file').files[0];
            const trackPhoto = document.getElementById('track-photo').files[0];
            let collectionName = document.getElementById('collection').value;

            if (collectionName === 'new') {
                collectionName = document.getElementById('new-collection').value.trim();
            }

            if (trackFile && trackPhoto && trackTitle) {
                const formData = new FormData();
                formData.append('track-title', trackTitle);
                formData.append('track-file', trackFile);
                formData.append('track-photo', trackPhoto);
                formData.append('collection', collectionName);

                fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        alert("Track uploaded successfully.");
                        window.location.href = "index.html";
                    } else {
                        alert("Error uploading track: " + result.message);
                    }
                })
                .catch(error => console.error('Error uploading track:', error));
            }
        });

        document.getElementById('back-to-main').addEventListener('click', function() {
            window.location.href = "index.html";
        });
    }

    // Handle staff sign-on
    document.getElementById('staff-sign-on')?.addEventListener('click', function() {
        const userPassword = prompt("Enter the password:");
        if (userPassword === "T3?dWuU9") {
            window.location.href = "add.html";
        } else {
            alert("Incorrect password!");
        }
    });

    // Handle track deletion on index.html
    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('delete-button')) {
            const trackDiv = event.target.closest('.track');
            const trackId = trackDiv.getAttribute('data-id');

            if (confirm("Are you sure you want to delete this track?")) {
                fetch(`/api/track/${trackId}`, { method: 'DELETE' })
                    .then(response => {
                        if (response.ok) {
                            trackDiv.remove();
                        } else {
                            alert("Failed to delete track.");
                        }
                    })
                    .catch(error => console.error('Error deleting track:', error));
            }
        }
    });
});

// Function to load collections and tracks for index.html
function loadContent() {
    fetch('/api/collections')
        .then(response => response.json())
        .then(data => {
            const collectionsSection = document.getElementById('collections');
            collectionsSection.innerHTML = '';

            data.forEach(collection => {
                const collectionDiv = document.createElement('div');
                collectionDiv.classList.add('collection');
                collectionDiv.setAttribute('data-collection', collection.name);
                collectionDiv.innerHTML = `<h3>${collection.name}</h3>`;

                collection.tracks.forEach(track => {
                    const trackDiv = document.createElement('div');
                    trackDiv.classList.add('track');
                    trackDiv.setAttribute('data-id', track.id);
                    trackDiv.innerHTML = `
                        <img src="${track.photoURL}" alt="${track.title}">
                        <div>
                            <p>${track.title}</p>
                            <audio controls src="${track.audioURL}"></audio>
                            <button class="delete-button">Delete</button>
                        </div>
                    `;
                    collectionDiv.appendChild(trackDiv);
                });

                collectionsSection.appendChild(collectionDiv);
            });
        })
        .catch(error => console.error('Error fetching collections:', error));
}

// Function to load collections for add.html
function loadCollections() {
    fetch('/api/collections')
        .then(response => response.json())
        .then(data => {
            const collectionsSelect = document.getElementById('collection');
            const collectionsList = document.getElementById('collections');
            collectionsSelect.innerHTML = '<option value="none">No Collection</option><option value="new">Add New Collection</option>';
            collectionsList.innerHTML = '';

            data.forEach(collection => {
                const option = document.createElement('option');
                option.value = collection.name;
                option.textContent = collection.name;
                collectionsSelect.appendChild(option);

                const li = document.createElement('li');
                li.textContent = collection.name;
                collectionsList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching collections:', error));
}
