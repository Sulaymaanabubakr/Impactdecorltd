// Gallery Page JavaScript

let currentGalleryType = 'images';
let currentLightboxIndex = 0;
let currentMediaArray = [];

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
    
    try {
        const snapshot = await db.collection('media')
            .where('type', '==', 'image')
            .orderBy('uploadedAt', 'desc')
            .get();
        
        grid.innerHTML = '';
        currentMediaArray = [];
        
        if (snapshot.empty) {
            grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No images available yet.</p>';
            return;
        }
        
        snapshot.forEach((doc, index) => {
            const data = { id: doc.id, ...doc.data() };
            currentMediaArray.push(data);
            
            const card = createGalleryCard(data, index);
            grid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading images:', error);
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Unable to load images.</p>';
    }
}

// Load Videos from Firebase
async function loadVideos() {
    const grid = document.getElementById('videos-grid');
    if (!grid || !db) return;
    
    try {
        const snapshot = await db.collection('media')
            .where('type', '==', 'video')
            .orderBy('uploadedAt', 'desc')
            .get();
        
        grid.innerHTML = '';
        currentMediaArray = [];
        
        if (snapshot.empty) {
            grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No videos available yet.</p>';
            return;
        }
        
        snapshot.forEach((doc, index) => {
            const data = { id: doc.id, ...doc.data() };
            currentMediaArray.push(data);
            
            const card = createGalleryCard(data, index);
            grid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading videos:', error);
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Unable to load videos.</p>';
    }
}

// Create Gallery Card
function createGalleryCard(item, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-aos', 'fade-up');
    card.onclick = () => openLightbox(index);
    
    const mediaElement = item.type === 'video' 
        ? `<video src="${item.url}" class="project-media" controls preload="metadata" playsinline>
             <p>Your browser doesn't support video playback.</p>
           </video>`
        : `<img src="${item.url}" alt="${item.title || 'Gallery item'}" class="project-media">`;
    
    card.innerHTML = `
        ${mediaElement}
        <div class="project-info">
            <h3>${item.title || 'Untitled'}</h3>
            <p>${item.description || 'No description'}</p>
            <div class="project-date">${formatDate(item.uploadedAt)}</div>
        </div>
    `;
    
    // Add video event listeners if it's a video
    if (item.type === 'video') {
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
        errorMsg.innerHTML = '<p>⚠️ Video unavailable</p>';
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
    const item = currentMediaArray[index];
    
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxVideo = document.getElementById('lightbox-video');
    
    if (item.type === 'video') {
        lightboxImage.style.display = 'none';
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = item.url;
        lightboxVideo.load(); // Ensure video loads properly
        
        // Add error handling for lightbox video
        lightboxVideo.onerror = () => {
            console.error('Lightbox video failed to load:', item.url);
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = '<p style="color: white; text-align: center;">⚠️ Video could not be loaded</p>';
            lightboxVideo.parentElement.appendChild(errorDiv);
            lightboxVideo.style.display = 'none';
        };
    } else {
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.src = '';
        lightboxImage.style.display = 'block';
        lightboxImage.src = item.url;
        lightboxImage.alt = item.title || 'Gallery image';
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
        lightboxVideo.src = '';
        lightboxVideo.load(); // Reset video element
        
        // Remove any error messages
        const errorDiv = lightboxVideo.parentElement.querySelector('div');
        if (errorDiv && errorDiv.innerHTML.includes('⚠️')) {
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
