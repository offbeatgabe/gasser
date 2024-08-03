document.addEventListener('DOMContentLoaded', () => {
    const storage = firebase.storage();
    const db = firebase.firestore();
    const fileInput = document.getElementById('fileInput');
    const collectionInput = document.getElementById('collectionInput');
    const uploadButton = document.getElementById('uploadButton');
    const songList = document.getElementById('song-list');
    
    uploadButton.addEventListener('click', async () => {
        const files = fileInput.files;
        const collectionName = collectionInput.value.trim() || 'Uncategorized';
        
        if (files.length === 0) {
            alert('Please select at least one file.');
            return;
        }
        
        for (const file of files) {
            const storageRef = storage.ref(`songs/${collectionName}/${file.name}`);
            const uploadTask = storageRef.put(file);
            
            uploadTask.on('state_changed', 
                (snapshot) => {
                    // Progress monitoring can be implemented here if needed
                }, 
                (error) => {
                    console.error('Upload failed:', error);
                }, 
                async () => {
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    await db.collection('songs').add({
                        name: file.name,
                        url: downloadURL,
                        collection: collectionName,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    loadSongs();
                }
            );
        }
    });
    
    async function loadSongs() {
        songList.innerHTML = '';
        const querySnapshot = await db.collection('songs').orderBy('timestamp', 'desc').get();
        querySnapshot.forEach(doc => {
            const data = doc.data();
            const songItem = document.createElement('div');
            songItem.innerHTML = `<a href="${data.url}" target="_blank">${data.name}</a> (Collection: ${data.collection})`;
            songList.appendChild(songItem);
        });
    }
    
    loadSongs();
});
