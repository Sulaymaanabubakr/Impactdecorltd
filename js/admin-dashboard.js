// Admin Dashboard JavaScript

let currentUser = null;
let deleteItemId = null;

// Auth guard - redirect if not logged in
if (auth) {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = 'admin-login.html';
        } else {
            currentUser = user;
            document.getElementById('adminEmail').textContent = user.email;
            loadImages();
            loadVideos();
        }
    });
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await auth.signOut();
        showToast('Logged out successfully', 'success');
        window.location.href = 'admin-login.html';
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error logging out', 'error');
    }
});

// Tab switching
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Remove active class from all tabs
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        btn.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// Image Upload
const imageUploadForm = document.getElementById('imageUploadForm');
const imageFile = document.getElementById('imageFile');
const imagePreview = document.getElementById('imagePreview');
const imagePreviewImg = document.getElementById('imagePreviewImg');
const imageUploadBtn = document.getElementById('imageUploadBtn');
const imageUploadText = document.getElementById('imageUploadText');
const imageUploadLoading = document.getElementById('imageUploadLoading');

imageFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreviewImg.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

imageUploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = imageFile.files[0];
    const title = document.getElementById('imageTitle').value;
    const description = document.getElementById('imageDescription').value;

    if (!file) {
        showToast('Please select an image', 'error');
        return;
    }

    // Disable button
    imageUploadBtn.disabled = true;
    imageUploadText.style.display = 'none';
    imageUploadLoading.style.display = 'inline';

    try {
        // Upload to Cloudinary
        const imageUrl = await uploadToCloudinary(file, 'image');

        // Save metadata to Firestore
        await db.collection('media').add({
            title,
            description,
            url: imageUrl,
            type: 'image',
            uploadDate: firebase.firestore.FieldValue.serverTimestamp(),
            uploadedBy: currentUser.email
        });

        showToast('Image uploaded successfully!', 'success');

        // Reset form
        imageUploadForm.reset();
        imagePreview.style.display = 'none';

        // Reload images
        loadImages();

    } catch (error) {
        console.error('Upload error:', error);
        showToast('Error uploading image. Please try again.', 'error');
    } finally {
        imageUploadBtn.disabled = false;
        imageUploadText.style.display = 'inline';
        imageUploadLoading.style.display = 'none';
    }
});

// Video Upload
const videoUploadForm = document.getElementById('videoUploadForm');
const videoFile = document.getElementById('videoFile');
const videoPreview = document.getElementById('videoPreview');
const videoPreviewVid = document.getElementById('videoPreviewVid');
const videoUploadBtn = document.getElementById('videoUploadBtn');
const videoUploadText = document.getElementById('videoUploadText');
const videoUploadLoading = document.getElementById('videoUploadLoading');

videoFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        videoPreviewVid.src = url;
        videoPreview.style.display = 'block';
    }
});

videoUploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = videoFile.files[0];
    const title = document.getElementById('videoTitle').value;
    const description = document.getElementById('videoDescription').value;

    if (!file) {
        showToast('Please select a video', 'error');
        return;
    }

    // Disable button
    videoUploadBtn.disabled = true;
    videoUploadText.style.display = 'none';
    videoUploadLoading.style.display = 'inline';

    try {
        // Upload to Cloudinary
        const videoUrl = await uploadToCloudinary(file, 'video');

        // Save metadata to Firestore
        await db.collection('media').add({
            title,
            description,
            url: videoUrl,
            type: 'video',
            uploadDate: firebase.firestore.FieldValue.serverTimestamp(),
            uploadedBy: currentUser.email
        });

        showToast('Video uploaded successfully!', 'success');

        // Reset form
        videoUploadForm.reset();
        videoPreview.style.display = 'none';

        // Reload videos
        loadVideos();

    } catch (error) {
        console.error('Upload error:', error);
        showToast('Error uploading video. Please try again.', 'error');
    } finally {
        videoUploadBtn.disabled = false;
        videoUploadText.style.display = 'inline';
        videoUploadLoading.style.display = 'none';
    }
});

// Load Images
async function loadImages() {
    const imagesList = document.getElementById('imagesList');
    
    try {
        const snapshot = await db.collection('media')
            .where('type', '==', 'image')
            .orderBy('uploadDate', 'desc')
            .get();

        if (snapshot.empty) {
            imagesList.innerHTML = '<p class="loading">No images uploaded yet.</p>';
        } else {
            imagesList.innerHTML = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                const item = createMediaItem(doc.id, data);
                imagesList.appendChild(item);
            });
        }
    } catch (error) {
        console.error('Error loading images:', error);
        imagesList.innerHTML = '<p class="loading">Error loading images.</p>';
    }
}

// Load Videos
async function loadVideos() {
    const videosList = document.getElementById('videosList');
    
    try {
        const snapshot = await db.collection('media')
            .where('type', '==', 'video')
            .orderBy('uploadDate', 'desc')
            .get();

        if (snapshot.empty) {
            videosList.innerHTML = '<p class="loading">No videos uploaded yet.</p>';
        } else {
            videosList.innerHTML = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                const item = createMediaItem(doc.id, data);
                videosList.appendChild(item);
            });
        }
    } catch (error) {
        console.error('Error loading videos:', error);
        videosList.innerHTML = '<p class="loading">Error loading videos.</p>';
    }
}

// Create Media Item
function createMediaItem(id, data) {
    const item = document.createElement('div');
    item.className = 'media-item';

    const mediaElement = data.type === 'image'
        ? `<img src="${data.url}" alt="${data.title}" class="media-thumbnail">`
        : `<video src="${data.url}" class="media-thumbnail" muted></video>`;

    item.innerHTML = `
        ${mediaElement}
        <div class="media-details">
            <h3>${data.title}</h3>
            <p>${data.description}</p>
            <p class="media-date">${formatDate(data.uploadDate)}</p>
            <div class="media-actions">
                <button class="btn-edit" onclick="editItem('${id}', '${data.type}')">Edit</button>
                <button class="btn-delete" onclick="confirmDelete('${id}')">Delete</button>
            </div>
        </div>
    `;

    return item;
}

// Edit Item
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editModalClose = editModal.querySelector('.modal-close');

window.editItem = async function(id, type) {
    try {
        const doc = await db.collection('media').doc(id).get();
        const data = doc.data();

        document.getElementById('editItemId').value = id;
        document.getElementById('editItemType').value = type;
        document.getElementById('editTitle').value = data.title;
        document.getElementById('editDescription').value = data.description;
        document.getElementById('editModalTitle').textContent = `Edit ${type === 'image' ? 'Image' : 'Video'}`;

        editModal.classList.add('active');
        editModal.style.display = 'flex';
    } catch (error) {
        console.error('Error loading item:', error);
        showToast('Error loading item', 'error');
    }
};

editModalClose.addEventListener('click', () => {
    editModal.classList.remove('active');
    editModal.style.display = 'none';
});

editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('editItemId').value;
    const type = document.getElementById('editItemType').value;
    const title = document.getElementById('editTitle').value;
    const description = document.getElementById('editDescription').value;

    try {
        await db.collection('media').doc(id).update({
            title,
            description,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showToast('Updated successfully!', 'success');
        editModal.classList.remove('active');
        editModal.style.display = 'none';

        // Reload appropriate list
        if (type === 'image') {
            loadImages();
        } else {
            loadVideos();
        }
    } catch (error) {
        console.error('Error updating item:', error);
        showToast('Error updating item', 'error');
    }
});

// Delete Item
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');

window.confirmDelete = function(id) {
    deleteItemId = id;
    deleteModal.classList.add('active');
    deleteModal.style.display = 'flex';
};

cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.classList.remove('active');
    deleteModal.style.display = 'none';
    deleteItemId = null;
});

confirmDeleteBtn.addEventListener('click', async () => {
    if (!deleteItemId) return;

    try {
        const doc = await db.collection('media').doc(deleteItemId).get();
        const data = doc.data();

        await db.collection('media').doc(deleteItemId).delete();

        showToast('Deleted successfully!', 'success');
        deleteModal.classList.remove('active');
        deleteModal.style.display = 'none';

        // Reload appropriate list
        if (data.type === 'image') {
            loadImages();
        } else {
            loadVideos();
        }

        deleteItemId = null;
    } catch (error) {
        console.error('Error deleting item:', error);
        showToast('Error deleting item', 'error');
    }
});

// Close modals on outside click
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.classList.remove('active');
        editModal.style.display = 'none';
    }
});

deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        deleteModal.classList.remove('active');
        deleteModal.style.display = 'none';
        deleteItemId = null;
    }
});
