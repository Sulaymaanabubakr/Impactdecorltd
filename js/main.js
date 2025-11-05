// Main JavaScript for Impact Decor Ltd Website

// Gallery assets and state
const whatsappGalleryAssets = [
    'WhatsApp Image 2025-11-02 at 11.38.42 PM.jpeg',
    'WhatsApp Image 2025-11-02 at 11.39.22 PM (1).jpeg',
    'WhatsApp Image 2025-11-02 at 11.39.22 PM (2).jpeg',
    'WhatsApp Image 2025-11-02 at 11.39.22 PM (3).jpeg',
    'WhatsApp Image 2025-11-02 at 11.39.22 PM (4).jpeg',
    'WhatsApp Image 2025-11-02 at 11.39.22 PM.jpeg',
    'WhatsApp Image 2025-11-02 at 11.39.23 PM.jpeg',
    'WhatsApp Image 2025-11-02 at 11.41.28 PM.jpeg',
    'WhatsApp Image 2025-11-02 at 11.42.36 PM (1).jpeg',
    'WhatsApp Image 2025-11-02 at 11.42.36 PM (2).jpeg',
    'WhatsApp Image 2025-11-02 at 11.42.36 PM.jpeg',
    'WhatsApp Image 2025-11-02 at 11.43.09 PM (1).jpeg',
    'WhatsApp Image 2025-11-02 at 11.43.09 PM.jpeg',
    'WhatsApp Image 2025-11-02 at 11.44.32 PM (1).jpeg',
    'WhatsApp Image 2025-11-02 at 11.44.32 PM (2).jpeg',
    'WhatsApp Image 2025-11-02 at 11.44.32 PM (3).jpeg',
    'WhatsApp Image 2025-11-02 at 11.44.32 PM (4).jpeg',
    'WhatsApp Image 2025-11-02 at 11.44.32 PM (5).jpeg',
    'WhatsApp Image 2025-11-02 at 11.44.32 PM (6).jpeg',
    'WhatsApp Image 2025-11-02 at 11.44.32 PM (7).jpeg',
    'WhatsApp Image 2025-11-02 at 11.44.32 PM (8).jpeg',
    'WhatsApp Image 2025-11-02 at 11.44.32 PM.jpeg',
    'WhatsApp Image 2025-11-02 at 11.44.59 PM (1).jpeg',
    'WhatsApp Image 2025-11-02 at 11.44.59 PM (2).jpeg',
    'WhatsApp Image 2025-11-02 at 11.44.59 PM.jpeg'
];

let galleryImages = [];
let currentGalleryIndex = 0;
let galleryLightboxElement = null;
let galleryLightboxImage = null;
let galleryLightboxCaption = null;
let galleryTouchStartX = 0;
let lastFocusedGalleryTrigger = null;

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out',
            once: true,
            offset: 120,
            delay: 0
        });
    }
    
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize scroll-to-top button
    initScrollToTop();
    
    // Prepare gallery lightbox
    initGalleryLightbox();
    
    // Load recent projects on homepage
    if (document.getElementById('recent-projects')) {
        loadRecentProjects();
    }
    
    // Load WhatsApp gallery on homepage
    if (document.getElementById('whatsapp-gallery')) {
        loadWhatsAppGallery();
    }
});

// Mobile Navigation Toggle
function initMobileNav() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Load Recent Projects for Homepage
async function loadRecentProjects() {
    const projectsGrid = document.getElementById('recent-projects');
    if (!projectsGrid || !db) return;
    
    try {
        // Fetch last 10 images and videos
        const imagesQuery = db.collection('media')
            .where('type', '==', 'image')
            .orderBy('uploadedAt', 'desc')
            .limit(5);
            
        const videosQuery = db.collection('media')
            .where('type', '==', 'video')
            .orderBy('uploadedAt', 'desc')
            .limit(5);
        
        const [imagesSnapshot, videosSnapshot] = await Promise.all([
            imagesQuery.get(),
            videosQuery.get()
        ]);
        
        const allMedia = [];
        
        imagesSnapshot.forEach(doc => {
            allMedia.push({ id: doc.id, ...doc.data() });
        });
        
        videosSnapshot.forEach(doc => {
            allMedia.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort by date and limit to 10
        allMedia.sort((a, b) => b.uploadedAt - a.uploadedAt);
        const recentMedia = allMedia.slice(0, 10);
        
        projectsGrid.innerHTML = '';
        
        if (recentMedia.length === 0) {
            projectsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No projects available yet.</p>';
            return;
        }
        
        recentMedia.forEach(item => {
            const card = createProjectCard(item);
            projectsGrid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading recent projects:', error);
        projectsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: var(--text-light);">Unable to load projects at this time.</p>';
    }
}

// Create Project Card
function createProjectCard(item) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-aos', 'fade-up');
    
    const mediaElement = item.type === 'video' 
        ? `<video src="${item.url}" class="project-media" controls preload="metadata" playsinline>
             <p>Your browser doesn't support video playback.</p>
           </video>`
        : `<img src="${item.url}" alt="${item.title || 'Project'}" class="project-media">`;
    
    card.innerHTML = `
        ${mediaElement}
        <div class="project-info">
            <h3>${item.title || 'Untitled Project'}</h3>
            <p>${item.description || 'No description available'}</p>
            <div class="project-date">${formatDate(item.uploadedAt)}</div>
        </div>
    `;
    
    // Add video event listeners if it's a video
    if (item.type === 'video') {
        setTimeout(() => {
            const video = card.querySelector('video');
            if (video) {
                setupVideoHandlers(video);
                
                // Allow video interaction without interfering with card clicks
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

// Set active nav link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Call on page load
document.addEventListener('DOMContentLoaded', setActiveNavLink);

// Scroll-to-Top Button
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
        
        // Smooth scroll to top on click
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Load WhatsApp Gallery
function loadWhatsAppGallery() {
    const galleryContainer = document.getElementById('whatsapp-gallery');
    if (!galleryContainer) return;
    
    galleryImages = whatsappGalleryAssets.map((imageName, index) => ({
        src: `assets/${imageName}`,
        alt: `Impact Decor project ${index + 1}`
    }));
    
    // Clear loading state
    galleryContainer.innerHTML = '';
    
    galleryImages.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'whatsapp-gallery-item';
        galleryItem.setAttribute('data-aos', 'fade-up');
        galleryItem.setAttribute('data-aos-delay', (index * 40).toString());
        galleryItem.setAttribute('role', 'button');
        galleryItem.setAttribute('tabindex', '0');
        galleryItem.setAttribute('aria-label', `Open project image ${index + 1}`);
        
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt;
        img.loading = 'lazy';
        
        galleryItem.appendChild(img);
        galleryContainer.appendChild(galleryItem);
        
        galleryItem.addEventListener('click', () => openGalleryLightbox(index));
        galleryItem.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openGalleryLightbox(index);
            }
        });
    });
    
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

function initGalleryLightbox() {
    galleryLightboxElement = document.getElementById('gallery-lightbox');
    if (!galleryLightboxElement) return;
    
    galleryLightboxImage = document.getElementById('gallery-lightbox-image');
    galleryLightboxCaption = document.getElementById('gallery-lightbox-caption');
    const closeBtn = document.getElementById('gallery-lightbox-close');
    const prevBtn = document.getElementById('gallery-lightbox-prev');
    const nextBtn = document.getElementById('gallery-lightbox-next');
    const content = galleryLightboxElement.querySelector('.gallery-lightbox-content');
    
    closeBtn?.addEventListener('click', closeGalleryLightbox);
    prevBtn?.addEventListener('click', () => handleGalleryNavigation(-1));
    nextBtn?.addEventListener('click', () => handleGalleryNavigation(1));
    
    galleryLightboxElement.addEventListener('click', (event) => {
        if (event.target === galleryLightboxElement) {
            closeGalleryLightbox();
        }
    });
    
    if (content) {
        content.addEventListener('touchstart', handleGalleryTouchStart, { passive: true });
        content.addEventListener('touchend', handleGalleryTouchEnd, { passive: true });
    }
    
    document.addEventListener('keydown', (event) => {
        if (!galleryLightboxElement.classList.contains('open')) return;
        if (event.key === 'Escape') {
            closeGalleryLightbox();
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            handleGalleryNavigation(-1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            handleGalleryNavigation(1);
        }
    });
}

function openGalleryLightbox(index) {
    if (!galleryLightboxElement) return;
    lastFocusedGalleryTrigger = document.activeElement;
    currentGalleryIndex = index;
    showGalleryImage(currentGalleryIndex);
    galleryLightboxElement.classList.add('open');
    galleryLightboxElement.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const closeBtn = document.getElementById('gallery-lightbox-close');
    closeBtn?.focus();
}

function closeGalleryLightbox() {
    if (!galleryLightboxElement) return;
    galleryLightboxElement.classList.remove('open');
    galleryLightboxElement.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedGalleryTrigger && typeof lastFocusedGalleryTrigger.focus === 'function') {
        lastFocusedGalleryTrigger.focus();
    }
}

function showGalleryImage(index) {
    if (!galleryImages.length || !galleryLightboxImage) return;
    const item = galleryImages[index];
    if (!item) return;
    galleryLightboxImage.src = item.src;
    galleryLightboxImage.alt = item.alt;
    if (galleryLightboxCaption) {
        galleryLightboxCaption.textContent = `${item.alt} (${index + 1} of ${galleryImages.length})`;
    }
}

function handleGalleryNavigation(direction) {
    if (!galleryImages.length) return;
    currentGalleryIndex = (currentGalleryIndex + direction + galleryImages.length) % galleryImages.length;
    showGalleryImage(currentGalleryIndex);
}

function handleGalleryTouchStart(event) {
    galleryTouchStartX = event.changedTouches[0]?.screenX ?? 0;
}

function handleGalleryTouchEnd(event) {
    const touchEndX = event.changedTouches[0]?.screenX ?? 0;
    const deltaX = touchEndX - galleryTouchStartX;
    if (Math.abs(deltaX) > 40) {
        handleGalleryNavigation(deltaX < 0 ? 1 : -1);
    }
}
