// Main JavaScript for Impact Decor Limited

// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Mobile Navigation Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-content')) {
            navMenu.classList.remove('active');
        }
    });
}

// Fetch and display recent projects on homepage
async function loadRecentProjects() {
    if (!db) return;

    const imagesContainer = document.getElementById('recent-images');
    const videosContainer = document.getElementById('recent-videos');

    if (!imagesContainer && !videosContainer) return;

    try {
        // Fetch recent images
        if (imagesContainer) {
            const imagesSnapshot = await db.collection('media')
                .where('type', '==', 'image')
                .orderBy('uploadDate', 'desc')
                .limit(6)
                .get();

            if (imagesSnapshot.empty) {
                imagesContainer.innerHTML = '<p class="loading">No images available yet.</p>';
            } else {
                imagesContainer.innerHTML = '';
                imagesSnapshot.forEach(doc => {
                    const data = doc.data();
                    const card = createProjectCard(data);
                    imagesContainer.appendChild(card);
                });
            }
        }

        // Fetch recent videos
        if (videosContainer) {
            const videosSnapshot = await db.collection('media')
                .where('type', '==', 'video')
                .orderBy('uploadDate', 'desc')
                .limit(6)
                .get();

            if (videosSnapshot.empty) {
                videosContainer.innerHTML = '<p class="loading">No videos available yet.</p>';
            } else {
                videosContainer.innerHTML = '';
                videosSnapshot.forEach(doc => {
                    const data = doc.data();
                    const card = createProjectCard(data);
                    videosContainer.appendChild(card);
                });
            }
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        if (imagesContainer) {
            imagesContainer.innerHTML = '<p class="loading">Error loading images.</p>';
        }
        if (videosContainer) {
            videosContainer.innerHTML = '<p class="loading">Error loading videos.</p>';
        }
    }
}

// Create project card element
function createProjectCard(data) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-aos', 'fade-up');

    if (data.type === 'image') {
        card.innerHTML = `
            <img src="${data.url}" alt="${data.title}" loading="lazy">
            <div class="project-info">
                <h3>${data.title}</h3>
                <p>${data.description}</p>
            </div>
        `;
    } else {
        card.innerHTML = `
            <video src="${data.url}" loading="lazy" muted></video>
            <div class="project-info">
                <h3>${data.title}</h3>
                <p>${data.description}</p>
            </div>
        `;
    }

    return card;
}

// Initialize homepage
if (document.getElementById('recent-images') || document.getElementById('recent-videos')) {
    loadRecentProjects();
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }
        
        lastScroll = currentScroll;
    });
}
