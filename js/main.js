// Main JavaScript for Impact Decor Ltd Website

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
        ? `<video src="${item.url}" class="project-media"></video>`
        : `<img src="${item.url}" alt="${item.title || 'Project'}" class="project-media">`;
    
    card.innerHTML = `
        ${mediaElement}
        <div class="project-info">
            <h3>${item.title || 'Untitled Project'}</h3>
            <p>${item.description || 'No description available'}</p>
            <div class="project-date">${formatDate(item.uploadedAt)}</div>
        </div>
    `;
    
    return card;
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
    
    // Define WhatsApp images that may exist in the assets folder
    // These will be automatically loaded when files are added to /assets/
    const whatsappImages = [
        'Whatsapp1.jpg',
        'Whatsapp2.jpg',
        'Whatsapp3.jpg',
        'Whatsapp4.jpg',
        'Whatsapp5.jpg',
        'Whatsapp6.jpg',
        'Whatsapp7.jpg',
        'Whatsapp8.jpg',
        'Whatsapp9.jpg',
        'Whatsapp10.jpg'
    ];
    
    // Use placeholder images from Unsplash for demonstration
    // These showcase Impact Decor's types of work: painting, decorating, renovations
    const placeholderImages = [
        {
            url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80',
            alt: 'Professional interior painting'
        },
        {
            url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
            alt: 'Wall decoration and painting'
        },
        {
            url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80',
            alt: 'Home renovation work'
        },
        {
            url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
            alt: 'Plastering and wall preparation'
        },
        {
            url: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=800&q=80',
            alt: 'Tiling work'
        },
        {
            url: 'https://images.unsplash.com/photo-1590490200097-6b37d8a7319d?w=800&q=80',
            alt: 'Interior decorating'
        }
    ];
    
    // Clear loading state
    galleryContainer.innerHTML = '';
    
    // Check if WhatsApp images exist, otherwise use placeholders
    let imagesToLoad = [];
    let loadedCount = 0;
    let totalImages = whatsappImages.length;
    
    // Try to load WhatsApp images first
    whatsappImages.forEach((imageName, index) => {
        const img = new Image();
        img.onload = function() {
            imagesToLoad.push({
                url: `assets/${imageName}`,
                alt: `Project showcase ${index + 1}`
            });
            loadedCount++;
            if (loadedCount === totalImages) {
                renderGallery(imagesToLoad.length > 0 ? imagesToLoad : placeholderImages);
            }
        };
        img.onerror = function() {
            loadedCount++;
            if (loadedCount === totalImages) {
                renderGallery(imagesToLoad.length > 0 ? imagesToLoad : placeholderImages);
            }
        };
        img.src = `assets/${imageName}`;
    });
    
    function renderGallery(images) {
        if (images.length === 0) {
            galleryContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No images available.</p>';
            return;
        }
        
        images.forEach((image, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'whatsapp-gallery-item';
            galleryItem.setAttribute('data-aos', 'fade-up');
            galleryItem.setAttribute('data-aos-delay', (index * 100).toString());
            
            const img = document.createElement('img');
            img.src = image.url;
            img.alt = image.alt;
            img.loading = 'lazy';
            
            galleryItem.appendChild(img);
            galleryContainer.appendChild(galleryItem);
        });
        
        // Re-initialize AOS for new elements
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
}
