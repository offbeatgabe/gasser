const password = "T3?dWuU9";

document.getElementById('staff-sign-on')?.addEventListener('click', function() {
    const userPassword = prompt("Enter the password:");

    if (userPassword === password) {
        window.location.href = "add.html";
    } else {
        alert("Incorrect password!");
    }
});

document.getElementById('upload-form')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const trackTitle = document.getElementById('track-title').value;
    const trackFile = document.getElementById('track-file').files[0];
    const trackPhoto = document.getElementById('track-photo').files[0];
    const collectionName = document.getElementById('collection').value;

    if (trackFile && trackPhoto && trackTitle) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const audioURL = e.target.result;

            const photoReader = new FileReader();
            photoReader.onload = function(e) {
                const photoURL = e.target.result;

                addTrackToCollection(trackTitle, audioURL, photoURL, collectionName);
                document.getElementById('upload-form').reset();
            };
            photoReader.readAsDataURL(trackPhoto);
        };
        reader.readAsDataURL(trackFile);
    }
});

function addTrackToCollection(trackTitle, audioURL, photoURL, collectionName) {
    const collectionsSection = document.getElementById('collections');
    let collectionDiv = [...collectionsSection.children].find(div => div.getAttribute('data-collection') === collectionName);

    if (!collectionDiv) {
        collectionDiv = document.createElement('div');
        collectionDiv.classList.add('collection');
        collectionDiv.setAttribute('data-collection', collectionName);
        collectionDiv.innerHTML = `<h3>${collectionName}</h3>`;
        collectionsSection.appendChild(collectionDiv);
    }

    const trackDiv = document.createElement('div');
    trackDiv.classList.add('track');
    trackDiv.innerHTML = `
        <img src="${photoURL}" alt="${trackTitle}">
        <div>
            <p>${trackTitle}</p>
            <audio controls src="${audioURL}"></audio>
        </div>
    `;
    collectionDiv.appendChild(trackDiv);
}

// Sample data for demonstration
addTrackToCollection("Sample Track", "sample.mp3", "sample.jpg", "Sample Collection");
