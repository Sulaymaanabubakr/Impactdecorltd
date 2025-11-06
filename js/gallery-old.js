// Gallery Page JavaScript

let currentGalleryType = 'images';
let currentLightboxIndex = 0;
let currentMediaArray = [];
let galleryMediaCache = [];
let galleryMediaLoaded = false;

// Switch Gallery Tab
function switchGalleryTab(type) {
    currentGalleryType = type;
    
    // Update tabs
    const tabs = document.querySelectorAll('.gallery-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update content
    const contents = document.querySelectorAll('.gallery-content');
    contents.forEach(content => content.classList.remove('active'));
    document.getElementById(`${type}-gallery`).classList.add('active');
    
    // Load media
    if (type === 'images') {
        loadImages();
    } else {
        loadVideos();
    }
}

// Load Images from Firebase
async function loadImages() {
    const grid = document.getElementById('images-grid');
    if (!grid || !db) return;

    renderGalleryLoadingState(grid, 'images');

    try {
        const media = await fetchGalleryMedia();
        const images = media.filter(item => !isVideoMedia(item));
        renderGalleryItems(grid, images, 'No images available yet.');
    } catch (error) {
        console.error('Error loading images:', error);
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Unable to load images.</p>';
    }
}

// Load Videos from Firebase
async function loadVideos() {
    const grid = document.getElementById('videos-grid');
    if (!grid || !db) return;

    renderGalleryLoadingState(grid, 'videos');

    try {
        const media = await fetchGalleryMedia();
        const videos = media.filter(item => isVideoMedia(item));
        renderGalleryItems(grid, videos, 'No videos available yet.');
    } catch (error) {
        console.error('Error loading videos:', error);
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Unable to load videos.</p>';
    }
}

async function fetchGalleryMedia(forceRefresh = false) {
    if (!db) return [];

    if (!forceRefresh && galleryMediaLoaded) {
        return galleryMediaCache;
    }

    const snapshot = await db.collection('media')
        .orderBy('uploadedAt', 'desc')
        .limit(100)
        .get();

    galleryMediaCache = [];

    snapshot.forEach(doc => {
        const item = normalizeMediaItem({ id: doc.id, ...doc.data() });
        if (!item.url) return;
        galleryMediaCache.push(item);
    });

    galleryMediaLoaded = true;
    return galleryMediaCache;
}

function renderGalleryLoadingState(grid, type) {
    grid.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading ${type}...</p>
        </div>
    `;
}

function renderGalleryItems(grid, items, emptyMessage) {
    currentMediaArray = items;
    grid.innerHTML = '';

    if (!items.length) {
        grid.innerHTML = `<p style="text-align: center; grid-column: 1/-1;">${emptyMessage}</p>`;
        return;
    }

    items.forEach((item, index) => {
        const card = createGalleryCard(item, index);
        grid.appendChild(card);
    });

    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Create Gallery Card
function createGalleryCard(item, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-aos', 'fade-up');
    card.onclick = () => openLightbox(index);
    
    const mediaElement = buildMediaElementHTML(item, {
        className: 'project-media'
    });

    const safeTitle = sanitizeInput(item.title || 'Untitled');
    const safeDescription = sanitizeInput(item.description || 'No description');

    card.innerHTML = `
        ${mediaElement}
        <div class="project-info">
            <h3>${safeTitle}</h3>
            <p>${safeDescription}</p>
            <div class="project-date">${formatDate(item.uploadedAt)}</div>
        </div>
    `;
    
    // Add video event listeners if it's a video
    if (isVideoMedia(item)) {
        setTimeout(() => {
            const video = card.querySelector('video');
            if (video) {
                setupVideoHandlers(video);
                
                // Prevent lightbox opening when clicking video controls
                video.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        }, 100);
    }
    
    return card;
}

// Setup video event handlers
function setupVideoHandlers(video) {
    // Pause other videos when one starts playing
    video.addEventListener('play', () => {
        pauseOtherVideos(video);
    });
    
    // Add loading states
    video.addEventListener('loadstart', () => {
        video.style.opacity = '0.7';
    });
    
    video.addEventListener('canplay', () => {
        video.style.opacity = '1';
    });
    
    // Add error handling
    video.addEventListener('error', () => {
        console.error('Video failed to load:', video.src);
        const errorMsg = document.createElement('div');
        errorMsg.className = 'video-error';
        errorMsg.innerHTML = '<p>Warning: Video unavailable</p>';
        errorMsg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #666;
            background: rgba(255,255,255,0.9);
            padding: 1rem;
            border-radius: 8px;
        `;
        video.parentElement.style.position = 'relative';
        video.parentElement.appendChild(errorMsg);
        video.style.display = 'none';
    });
}

// Pause all other videos except the one playing
function pauseOtherVideos(currentVideo) {
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(video => {
        if (video !== currentVideo && !video.paused) {
            video.pause();
        }
    });
}

// Open Lightbox
function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    const item = currentMediaArray[index];
    if (!item) return;

    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxVideo = document.getElementById('lightbox-video');
    if (!lightboxImage || !lightboxVideo) return;

    const isVideo = isVideoMedia(item);
    const mediaUrl = typeof item.url === 'string' ? item.url : '';
    const posterUrl = typeof getMediaPoster === 'function' ? getMediaPoster(item) : '';

    const existingError = lightboxVideo.parentElement.querySelector('.lightbox-video-error');
    if (existingError) {
        existingError.remove();
    }

    if (isVideo) {
        lightboxImage.style.display = 'none';
        lightboxVideo.style.display = 'block';
        lightboxVideo.pause();
        lightboxVideo.removeAttribute('src');

        if (posterUrl) {
            lightboxVideo.setAttribute('poster', posterUrl);
        } else {
            lightboxVideo.removeAttribute('poster');
        }

        if (mediaUrl) {
            lightboxVideo.src = mediaUrl;
        }

        lightboxVideo.currentTime = 0;
        lightboxVideo.load();

        lightboxVideo.onerror = () => {
            console.error('Lightbox video failed to load:', mediaUrl);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'lightbox-video-error';
            errorDiv.innerHTML = '<p style="color: white; text-align: center;">Video could not be loaded</p>';
            lightboxVideo.parentElement.appendChild(errorDiv);
            lightboxVideo.style.display = 'none';
        };
    } else {
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.removeAttribute('src');
        lightboxVideo.removeAttribute('poster');
        lightboxVideo.load();

        lightboxImage.style.display = 'block';
        if (mediaUrl) {
            lightboxImage.src = mediaUrl;
        } else {
            lightboxImage.removeAttribute('src');
        }
        lightboxImage.alt = sanitizeInput(item.title || 'Gallery image');
    }

    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close Lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');
    
    lightbox.classList.remove('show');
    
    // Properly clean up video
    if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
        lightboxVideo.removeAttribute('src');
        lightboxVideo.removeAttribute('poster');
        lightboxVideo.load(); // Reset video element
        
        // Remove any error messages
        const errorDiv = lightboxVideo.parentElement.querySelector('.lightbox-video-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    document.body.style.overflow = 'auto';
}

// Navigate Lightbox
function navigateLightbox(direction) {
    currentLightboxIndex += direction;
    
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = currentMediaArray.length - 1;
    } else if (currentLightboxIndex >= currentMediaArray.length) {
        currentLightboxIndex = 0;
    }
    
    openLightbox(currentLightboxIndex);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('show')) {
        if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});

// Close lightbox when clicking outside
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Load initial gallery
    loadImages();
});
