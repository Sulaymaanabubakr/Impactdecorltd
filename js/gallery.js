// Gallery Page JavaScript - Service-Based Filtering

let currentServiceFilter = 'all';
let currentMediaType = 'all';
let currentLightboxIndex = 0;
let allMediaArray = [];
let filteredMediaArray = [];

// Service configurations
const serviceConfig = {
    'all': { title: 'Our Work Gallery', subtitle: 'Browse our collection of completed projects across all services' },
    'painting-decorating': { title: 'Painting & Decorating Gallery', subtitle: 'Professional painting services with stunning finishes' },
    'wallpapering': { title: 'Wallpapper, Mural & Wall Panel Installation Gallery', subtitle: 'Expert wallpapper, mural & wall panel installation with precision' },
    'tiling-flooring': { title: 'Tiling & Flooring Gallery', subtitle: 'Professional tiling for kitchens, bathrooms, and floors' },
    'plastering': { title: 'Plastering Gallery', subtitle: 'Expert surface preparation and plaster repair' },
    'plumbing': { title: 'Plumbing Gallery', subtitle: 'Professional plumbing installations and repairs' },
    'property-maintenance': { title: 'Property Maintenance Gallery', subtitle: 'Comprehensive renovation and maintenance services' },
    'carpentry-fitting': { title: 'Carpentry & Fitting Gallery', subtitle: 'Skilled carpentry and professional fitting work' },
    'coving-moulding': { title: 'Coving & Moulding Gallery', subtitle: 'Elegant decorative installations and finishing touches' }
};

// Initialize Gallery
document.addEventListener('DOMContentLoaded', () => {
    // Check URL parameters for service filter
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    
    if (serviceParam && serviceConfig[serviceParam]) {
        currentServiceFilter = serviceParam;
        // Update active tab
        const serviceTabs = document.querySelectorAll('.service-filter-tab');
        serviceTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('onclick').includes(serviceParam)) {
                tab.classList.add('active');
            }
        });
    }
    
    // Update titles and load media
    updateGalleryTitles();
    loadAllMedia();
    
    // Setup lightbox
    setupLightbox();
});

// Switch Service Filter
function switchServiceFilter(service) {
    currentServiceFilter = service;
    
    // Update service tabs
    const serviceTabs = document.querySelectorAll('.service-filter-tab');
    serviceTabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update URL
    const url = new URL(window.location);
    if (service === 'all') {
        url.searchParams.delete('service');
    } else {
        url.searchParams.set('service', service);
    }
    window.history.replaceState({}, '', url);
    
    // Update titles
    updateGalleryTitles();
    
    // Filter and load media
    filterAndLoadMedia();
}

// Switch Media Type
function switchMediaType(type) {
    currentMediaType = type;
    
    // Update media tabs
    const mediaTabs = document.querySelectorAll('.media-tab');
    mediaTabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter and load media
    filterAndLoadMedia();
}

// Update Gallery Titles
function updateGalleryTitles() {
    const titleElement = document.getElementById('gallery-title');
    const subtitleElement = document.getElementById('gallery-subtitle');
    
    if (titleElement && subtitleElement && serviceConfig[currentServiceFilter]) {
        titleElement.textContent = serviceConfig[currentServiceFilter].title;
        subtitleElement.textContent = serviceConfig[currentServiceFilter].subtitle;
    }
}

// Load All Media from Firebase
async function loadAllMedia() {
    const grid = document.getElementById('gallery-grid');
    if (!grid || !db) {
        console.error('Gallery grid or database not found');
        return;
    }
    
    try {
        // Show loading
        grid.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading gallery...</p></div>';
        
        // Fetch all media
        const snapshot = await db.collection('media')
            .orderBy('uploadedAt', 'desc')
            .get();
        
        allMediaArray = [];
        
        if (snapshot.empty) {
            grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No media available yet.</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const data = { id: doc.id, ...doc.data() };
            allMediaArray.push(data);
        });
        
        // Filter and display media
        filterAndLoadMedia();
        
    } catch (error) {
        console.error('Error loading media:', error);
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Unable to load gallery.</p>';
    }
}

// Filter and Load Media
function filterAndLoadMedia() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    
    // Filter by service
    let serviceFiltered = allMediaArray;
    if (currentServiceFilter !== 'all') {
        serviceFiltered = allMediaArray.filter(item => 
            item.service === currentServiceFilter || 
            (item.category && item.category === currentServiceFilter)
        );
    }
    
    // Filter by media type
    let mediaFiltered = serviceFiltered;
    if (currentMediaType !== 'all') {
        if (currentMediaType === 'images') {
            mediaFiltered = serviceFiltered.filter(item => item.type === 'image');
        } else if (currentMediaType === 'videos') {
            mediaFiltered = serviceFiltered.filter(item => item.type === 'video');
        }
    }
    
    filteredMediaArray = mediaFiltered;
    
    // Display filtered media
    displayMedia(filteredMediaArray);
}

// Display Media in Grid
function displayMedia(mediaArray) {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    
    if (mediaArray.length === 0) {
        grid.innerHTML = `
            <div style="text-align: center; grid-column: 1/-1; padding: 3rem;">
                <h3>No ${currentMediaType === 'all' ? 'media' : currentMediaType} found</h3>
                <p>No ${currentMediaType === 'all' ? 'items' : currentMediaType} available for ${serviceConfig[currentServiceFilter]?.title || 'this service'}.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = '';
    
    mediaArray.forEach((item, index) => {
        const card = createGalleryCard(item, index);
        grid.appendChild(card);
    });
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
    
    // Get service name for display
    const serviceName = getServiceDisplayName(item.service || item.category);
    
    card.innerHTML = `
        ${mediaElement}
        <div class="project-info">
            <h3>${item.title || 'Untitled'}</h3>
            <p>${item.description || 'No description'}</p>
            ${serviceName ? `<div class="service-tag">${serviceName}</div>` : ''}
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

// Get Service Display Name
function getServiceDisplayName(serviceKey) {
    const serviceNames = {
        'painting-decorating': 'Painting & Decorating',
        'wallpapering': 'Wallpapper, Mural & Wall Panel Installation',
        'tiling-flooring': 'Tiling & Flooring',
        'plastering': 'Plastering',
        'plumbing': 'Plumbing',
        'property-maintenance': 'Property Maintenance',
        'carpentry-fitting': 'Carpentry & Fitting',
        'coving-moulding': 'Coving & Moulding'
    };
    return serviceNames[serviceKey] || serviceKey;
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
    const item = filteredMediaArray[index];
    
    if (!lightbox || !item) return;
    
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
    
    if (!lightbox) return;
    
    lightbox.classList.remove('show');
    lightboxVideo.pause();
    lightboxVideo.src = '';
    document.body.style.overflow = 'auto';
}

// Navigate Lightbox
function navigateLightbox(direction) {
    currentLightboxIndex += direction;
    
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = filteredMediaArray.length - 1;
    } else if (currentLightboxIndex >= filteredMediaArray.length) {
        currentLightboxIndex = 0;
    }
    
    openLightbox(currentLightboxIndex);
}

// Setup Lightbox
function setupLightbox() {
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
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
}

// Format date for display
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    
    let date;
    if (timestamp.toDate) {
        date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
        date = timestamp;
    } else {
        date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}