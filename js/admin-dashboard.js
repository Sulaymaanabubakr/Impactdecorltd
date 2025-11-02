// Admin Dashboard JavaScript

let currentUser = null;
let deleteItemId = null;

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (auth) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                currentUser = user;
                initDashboard();
            } else {
                // Redirect to login
                window.location.href = 'admin-login.html';
            }
        });
    } else {
        showToast('Authentication not available', 'error');
        setTimeout(() => {
            window.location.href = 'admin-login.html';
        }, 2000);
    }
});

// Initialize Dashboard
function initDashboard() {
    // Load images and videos
    loadMediaList('images');
    loadMediaList('videos');
    
    // Handle logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Handle image upload
    document.getElementById('upload-image-form').addEventListener('submit', (e) => handleMediaUpload(e, 'image'));
    document.getElementById('image-file').addEventListener('change', (e) => previewFile(e, 'image'));
    
    // Handle video upload
    document.getElementById('upload-video-form').addEventListener('submit', (e) => handleMediaUpload(e, 'video'));
    document.getElementById('video-file').addEventListener('change', (e) => previewFile(e, 'video'));
}

// Switch Tab
function switchTab(tab) {
    // Update tab buttons
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update tab content
    const contents = document.querySelectorAll('.admin-tab-content');
    contents.forEach(c => c.classList.remove('active'));
    document.getElementById(`${tab}-tab`).classList.add('active');
}

// Preview File
function previewFile(e, type) {
    const file = e.target.files[0];
    const preview = document.getElementById(`${type}-preview`);
    
    if (!file) return;
    
    // Validate file size (100MB for video, 10MB for image)
    const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
        showToast(`File too large. Maximum ${type === 'video' ? '100MB' : '10MB'}.`, 'error');
        e.target.value = '';
        return;
    }
    
    preview.innerHTML = '';
    preview.style.display = 'block';
    
    if (type === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    } else {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.controls = true;
        preview.appendChild(video);
    }
}

// Handle Media Upload
async function handleMediaUpload(e, type) {
    e.preventDefault();
    
    const title = document.getElementById(`${type}-title`).value.trim();
    const description = document.getElementById(`${type}-description`).value.trim();
    const fileInput = document.getElementById(`${type}-file`);
    const file = fileInput.files[0];
    const uploadBtn = document.getElementById(`upload-${type}-btn`);
    const originalText = uploadBtn.textContent;
    
    if (!title || !description || !file) {
        showToast('Please fill all fields', 'error');
        return;
    }
    
    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Uploading...';
    
    try {
        // Upload to Cloudinary
        const formData = new FormData();
        const resourceType = type === 'video' ? 'video' : 'image';
        const uploadPreset = getCloudinaryUploadPreset(resourceType);
        
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', `impact-decor/${type}s`);
        
        const response = await fetch(`${CLOUDINARY_API_URL}/${resourceType}/upload`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        
        const data = await response.json();
        
        // Save metadata to Firestore
        await db.collection('media').add({
            type: type,
            title: title,
            description: description,
            url: data.secure_url,
            publicId: data.public_id,
            uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
            uploadedBy: currentUser.email
        });
        
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`, 'success');
        
        // Reset form
        e.target.reset();
        document.getElementById(`${type}-preview`).style.display = 'none';
        
        // Reload media list
        loadMediaList(`${type}s`);
        
    } catch (error) {
        console.error('Upload error:', error);
        showToast('Upload failed. Please try again.', 'error');
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = originalText;
    }
}

// Load Media List
async function loadMediaList(type) {
    const listContainer = document.getElementById(`${type}-list`);
    const mediaType = type === 'images' ? 'image' : 'video';
    
    try {
        const snapshot = await db.collection('media')
            .where('type', '==', mediaType)
            .orderBy('uploadedAt', 'desc')
            .get();
        
        listContainer.innerHTML = '';
        
        if (snapshot.empty) {
            listContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No items uploaded yet.</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const data = { id: doc.id, ...doc.data() };
            const card = createMediaCard(data);
            listContainer.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading media:', error);
        listContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Error loading items.</p>';
    }
}

// Create Media Card
function createMediaCard(item) {
    const card = document.createElement('div');
    card.className = 'media-card';
    
    const mediaElement = item.type === 'video'
        ? `<video src="${item.url}" class="media-card-image"></video>`
        : `<img src="${item.url}" alt="${item.title}" class="media-card-image">`;
    
    card.innerHTML = `
        ${mediaElement}
        <div class="media-card-content">
            <h4>${item.title}</h4>
            <p>${item.description}</p>
            <div class="media-card-date">${formatDate(item.uploadedAt)}</div>
            <div class="media-card-actions">
                <button class="btn btn-secondary btn-small" onclick="openDeleteModal('${item.id}')">Delete</button>
            </div>
        </div>
    `;
    
    return card;
}

// Open Delete Modal
function openDeleteModal(itemId) {
    deleteItemId = itemId;
    const modal = document.getElementById('delete-modal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    document.getElementById('confirm-delete-btn').onclick = () => handleDelete(itemId);
}

// Close Delete Modal
function closeDeleteModal() {
    deleteItemId = null;
    const modal = document.getElementById('delete-modal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Handle Delete
async function handleDelete(itemId) {
    const confirmBtn = document.getElementById('confirm-delete-btn');
    const originalText = confirmBtn.textContent;
    
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Deleting...';
    
    try {
        // Delete from Firestore
        await db.collection('media').doc(itemId).delete();
        
        showToast('Item deleted successfully', 'success');
        
        // Reload both lists
        loadMediaList('images');
        loadMediaList('videos');
        
        closeDeleteModal();
        
    } catch (error) {
        console.error('Delete error:', error);
        showToast('Failed to delete item', 'error');
        
        confirmBtn.disabled = false;
        confirmBtn.textContent = originalText;
    }
}

// Handle Logout
async function handleLogout() {
    try {
        await auth.signOut();
        showToast('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'admin-login.html';
        }, 1000);
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Logout failed', 'error');
    }
}
