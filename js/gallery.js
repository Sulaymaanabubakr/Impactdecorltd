// Gallery JavaScript for Images and Videos pages

let allItems = [];
let currentItemIndex = 0;

async function loadGallery(type) {
    if (!db) return;

    const galleryContainer = type === 'image' 
        ? document.getElementById('imagesGallery')
        : document.getElementById('videosGallery');

    if (!galleryContainer) return;

    try {
        const snapshot = await db.collection('media')
            .where('type', '==', type)
            .orderBy('uploadDate', 'desc')
            .get();

        if (snapshot.empty) {
            galleryContainer.innerHTML = `<p class="loading">No ${type}s available yet.</p>`;
        } else {
            galleryContainer.innerHTML = '';
            allItems = [];
            
            snapshot.forEach((doc, index) => {
                const data = { id: doc.id, ...doc.data() };
                allItems.push(data);
                const item = createGalleryItem(data, index, type);
                galleryContainer.appendChild(item);
            });
        }
    } catch (error) {
        console.error(`Error loading ${type}s:`, error);
        galleryContainer.innerHTML = `<p class="loading">Error loading ${type}s.</p>`;
    }
}

function createGalleryItem(data, index, type) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-aos', 'fade-up');
    item.onclick = () => openModal(index, type);

    if (type === 'image') {
        item.innerHTML = `
            <img src="${data.url}" alt="${data.title}" loading="lazy">
            <div class="gallery-item-overlay">
                <h3>${data.title}</h3>
                <p>${data.description}</p>
            </div>
        `;
    } else {
        item.innerHTML = `
            <video src="${data.url}" loading="lazy" muted></video>
            <div class="gallery-item-overlay">
                <h3>${data.title}</h3>
                <p>${data.description}</p>
            </div>
        `;
    }

    return item;
}

function openModal(index, type) {
    currentItemIndex = index;
    const item = allItems[index];
    
    const modal = type === 'image' 
        ? document.getElementById('imageModal')
        : document.getElementById('videoModal');
    
    if (!modal) return;

    if (type === 'image') {
        document.getElementById('modalImage').src = item.url;
    } else {
        const videoElement = document.getElementById('modalVideo');
        videoElement.src = item.url;
        videoElement.load();
    }

    document.getElementById('modalTitle').textContent = item.title;
    document.getElementById('modalDescription').textContent = item.description;
    document.getElementById('modalDate').textContent = formatDate(item.uploadDate);

    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const imageModal = document.getElementById('imageModal');
    const videoModal = document.getElementById('videoModal');
    
    if (imageModal) {
        imageModal.classList.remove('active');
        imageModal.style.display = 'none';
    }
    
    if (videoModal) {
        const videoElement = document.getElementById('modalVideo');
        if (videoElement) {
            videoElement.pause();
            videoElement.currentTime = 0;
        }
        videoModal.classList.remove('active');
        videoModal.style.display = 'none';
    }
    
    document.body.style.overflow = 'auto';
}

function navigateModal(direction, type) {
    currentItemIndex += direction;
    
    if (currentItemIndex < 0) {
        currentItemIndex = allItems.length - 1;
    } else if (currentItemIndex >= allItems.length) {
        currentItemIndex = 0;
    }
    
    openModal(currentItemIndex, type);
}

// Event listeners for modals
document.addEventListener('DOMContentLoaded', () => {
    // Close buttons
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Navigation buttons for image modal
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        const prevBtn = imageModal.querySelector('.modal-prev');
        const nextBtn = imageModal.querySelector('.modal-next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => navigateModal(-1, 'image'));
        if (nextBtn) nextBtn.addEventListener('click', () => navigateModal(1, 'image'));

        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) closeModal();
        });
    }

    // Navigation buttons for video modal
    const videoModal = document.getElementById('videoModal');
    if (videoModal) {
        const prevBtn = videoModal.querySelector('.modal-prev');
        const nextBtn = videoModal.querySelector('.modal-next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => navigateModal(-1, 'video'));
        if (nextBtn) nextBtn.addEventListener('click', () => navigateModal(1, 'video'));

        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeModal();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (imageModal && imageModal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') navigateModal(-1, 'image');
            if (e.key === 'ArrowRight') navigateModal(1, 'image');
            if (e.key === 'Escape') closeModal();
        }
        if (videoModal && videoModal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') navigateModal(-1, 'video');
            if (e.key === 'ArrowRight') navigateModal(1, 'video');
            if (e.key === 'Escape') closeModal();
        }
    });

    // Load appropriate gallery based on current page
    if (document.getElementById('imagesGallery')) {
        loadGallery('image');
    } else if (document.getElementById('videosGallery')) {
        loadGallery('video');
    }
});
