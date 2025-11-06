// Admin Dashboard JavaScript

let currentUser = null;
let deleteItemId = null;
let editItemId = null;
let editItemType = null;

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
    initializeTabSwitcher();
    
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
    
    // Handle edit form
    const editForm = document.getElementById('edit-media-form');
    if (editForm) {
        editForm.addEventListener('submit', handleEditSubmit);
    }
}

function initializeTabSwitcher() {
    const tabButtons = document.querySelectorAll('.admin-tab-chip');
    
    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const target = button.dataset.tabTarget;
            if (target) {
                switchTab(target);
            }
        });
    });
    
    // Ensure default tab is active
    switchTab('images');
}

// Switch Tab
function switchTab(tab) {
    const targetPanel = document.getElementById(`${tab}-tab`);
    if (!targetPanel) return;
    
    const tabButtons = document.querySelectorAll('.admin-tab-chip');
    tabButtons.forEach((button) => {
        const isActive = button.dataset.tabTarget === tab;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    
    const panels = document.querySelectorAll('.admin-panel');
    panels.forEach((panel) => {
        const isTarget = panel.id === `${tab}-tab`;
        panel.classList.toggle('active', isTarget);
    });
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
    const service = document.getElementById(`${type}-service`).value;
    const fileInput = document.getElementById(`${type}-file`);
    const file = fileInput.files[0];
    const uploadBtn = document.getElementById(`upload-${type}-btn`);
    const originalText = uploadBtn.textContent;
    
    if (!title || !description || !service || !file) {
        showToast('Please fill all fields including service category', 'error');
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
            service: service,
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
    
    if (!listContainer) return;
    
    listContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    
    try {
        const snapshot = await db.collection('media')
            .where('type', '==', mediaType)
            .orderBy('uploadedAt', 'desc')
            .get();
        
        listContainer.innerHTML = '';
        
        if (snapshot.empty) {
            listContainer.innerHTML = `
                <div class="media-empty">
                    <h4>No ${mediaType === 'image' ? 'images' : 'videos'} yet</h4>
                    <p>Uploads will appear here as soon as you add them.</p>
                </div>
            `;
            return;
        }
        
        snapshot.forEach(doc => {
            const data = { id: doc.id, ...doc.data() };
            const card = createMediaCard(data);
            listContainer.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading media:', error);
        listContainer.innerHTML = `
            <div class="media-empty error">
                <h4>Unable to load items</h4>
                <p>Please refresh the page or try again shortly.</p>
            </div>
        `;
    }
}

// Create Media Card
function createMediaCard(item) {
    const card = document.createElement('article');
    card.className = 'media-card';
    
    const safeTitle = typeof sanitizeInput === 'function' ? sanitizeInput(item.title || '') : (item.title || '');
    const safeDescription = typeof sanitizeInput === 'function' ? sanitizeInput(item.description || '') : (item.description || '');
    const formattedDate = formatDate(item.uploadedAt);
    const isVideo = item.type === 'video';
    const mediaUrl = typeof sanitizeInput === 'function' ? sanitizeInput(item.url || '') : (item.url || '');
    
    const mediaElement = isVideo
        ? `<video src="${mediaUrl}" controls playsinline></video>`
        : `<img src="${mediaUrl}" alt="${safeTitle}" loading="lazy">`;
    
    card.innerHTML = `
        <div class="media-card-thumb">
            ${mediaElement}
        </div>
        <div class="media-card-meta">
            <div class="media-card-title">${safeTitle}</div>
            <div class="media-card-description">${safeDescription}</div>
        </div>
        <div class="media-card-footer">
            <span class="media-card-date">Updated ${formattedDate}</span>
            <div class="media-card-actions">
                <button type="button" class="admin-btn admin-btn-edit admin-btn-icon media-edit-btn">Edit</button>
                <button type="button" class="admin-btn admin-btn-danger admin-btn-icon media-delete-btn">Delete</button>
            </div>
        </div>
    `;
    
    const editBtn = card.querySelector('.media-edit-btn');
    const deleteBtn = card.querySelector('.media-delete-btn');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => openEditModal(item));
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => openDeleteModal(item.id));
    }
    
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

// Open Edit Modal
function openEditModal(item) {
    editItemId = item.id;
    editItemType = item.type;
    
    const modal = document.getElementById('edit-modal');
    if (!modal) return;
    
    const titleField = document.getElementById('edit-media-title');
    const descriptionField = document.getElementById('edit-media-description');
    const idField = document.getElementById('edit-media-id');
    const typeField = document.getElementById('edit-media-type');
    
    if (titleField) titleField.value = item.title || '';
    if (descriptionField) descriptionField.value = item.description || '';
    if (idField) idField.value = item.id;
    if (typeField) typeField.value = item.type;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close Edit Modal
function closeEditModal() {
    editItemId = null;
    editItemType = null;
    
    const modal = document.getElementById('edit-modal');
    if (!modal) return;
    
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    const editForm = document.getElementById('edit-media-form');
    if (editForm) {
        editForm.reset();
    }
}

// Handle Edit Submit
async function handleEditSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('edit-media-title').value.trim();
    const description = document.getElementById('edit-media-description').value.trim();
    const mediaId = document.getElementById('edit-media-id').value;
    const mediaType = document.getElementById('edit-media-type').value;
    const saveBtn = document.getElementById('save-edit-btn');
    const originalText = saveBtn.textContent;
    
    if (!title || !description || !mediaId) {
        showToast('Please fill all fields before saving.', 'error');
        return;
    }
    
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    try {
        await db.collection('media').doc(mediaId).update({
            title,
            description,
            uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Media updated successfully.', 'success');
        
        closeEditModal();
        
        if (mediaType === 'image') {
            loadMediaList('images');
        } else {
            loadMediaList('videos');
        }
        
    } catch (error) {
        console.error('Edit error:', error);
        showToast('Failed to save changes.', 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = originalText;
    }
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
