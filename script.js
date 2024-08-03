const password = "T3?dWuU9";

document.getElementById('staff-sign-on')?.addEventListener('click', function() {
    const userPassword = prompt("Enter the password:");

    if (userPassword === password) {
        window.location.href = "add.html";
    } else {
        alert("Incorrect password!");
    }
});

// Function to load collections and tracks from localStorage
function loadContent() {
    const collectionsSection = document.getElementById('collections');
    const collections = JSON.parse(localStorage.getItem('collections')) || {};

    for (const [collectionName, tracks] of Object.entries(collections)) {
        const collectionDiv = document.createElement('div');
        collectionDiv.classList.add('collection');
        collectionDiv.setAttribute('data-collection', collectionName);
        collectionDiv.innerHTML = `<h3>${collectionName}</h3>`;
        collectionsSection.appendChild(collectionDiv);

        tracks.forEach((track, index) => {
            const trackDiv = document.createElement('div');
            trackDiv.classList.add('track');
            trackDiv.setAttribute('data-index', index);
            trackDiv.innerHTML = `
                <img src="${track.photoURL}" alt="${track.title}">
                <div>
                    <p>${track.title}</p>
                    <audio controls src="${track.audioURL}"></audio>
                </div>
            `;
            collectionDiv.appendChild(trackDiv);
        });
    }
}

// Function to save and remove tracks
function saveTracksToLocalStorage(collectionName, tracks) {
    const collections = JSON.parse(localStorage.getItem('collections')) || {};
    collections[collectionName] = tracks;
    localStorage.setItem('collections', JSON.stringify(collections));
}

document.addEventListener('DOMContentLoaded', loadContent);

// Handling deletion of tracks
document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('delete-button')) {
        const trackDiv = event.target.closest('.track');
        const collectionDiv = trackDiv.closest('.collection');
        const collectionName = collectionDiv.getAttribute('data-collection');
        const index = trackDiv.getAttribute('data-index');

        if (confirm("Are you sure you want to delete this track?")) {
            const collections = JSON.parse(localStorage.getItem('collections')) || {};
            if (collections[collectionName]) {
                collections[collectionName].splice(index, 1);
                if (collections[collectionName].length === 0) {
                    delete collections[collectionName];
                    collectionDiv.remove();
                } else {
                    saveTracksToLocalStorage(collectionName, collections[collectionName]);
                    trackDiv.remove();
                }
                if (Object.keys(collections).length === 0) {
                    localStorage.removeItem('collections');
                } else {
                    localStorage.setItem('collections', JSON.stringify(collections));
                }
            }
        }
    }
});
