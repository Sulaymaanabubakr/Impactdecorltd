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
