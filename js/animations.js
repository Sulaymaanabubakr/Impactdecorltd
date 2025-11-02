// Advanced Animations for Impact Decor Ltd
// Using GSAP 3.x for premium, professional animations

document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP and ScrollTrigger if available
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
        initGSAPAnimations();
    }
    
    // Initialize preloader
    initPreloader();
    
    // Initialize parallax effects
    initParallaxEffects();
    
    // Initialize hover animations
    initHoverAnimations();
    
    // Initialize scroll-based animations
    initScrollAnimations();
    
    // Initialize contact page animations
    initContactPageAnimations();
});

// ===== Preloader Animation =====
function initPreloader() {
    // Create preloader element
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #1E2A38;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease, visibility 0.5s ease;
    `;
    
    const logo = document.createElement('div');
    logo.style.cssText = `
        text-align: center;
        color: #C9A227;
        font-family: 'Montserrat', sans-serif;
    `;
    logo.innerHTML = `
        <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; opacity: 0; animation: fadeInUp 0.6s ease forwards;">Impact Decor</div>
        <div style="font-size: 0.875rem; font-weight: 500; letter-spacing: 2px; opacity: 0; animation: fadeInUp 0.6s ease 0.3s forwards;">INNOVATION. INTEGRITY. IMPACT.</div>
    `;
    
    preloader.appendChild(logo);
    document.body.insertBefore(preloader, document.body.firstChild);
    
    // Add keyframe animation
    if (!document.getElementById('preloader-styles')) {
        const style = document.createElement('style');
        style.id = 'preloader-styles';
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Hide preloader after content loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => preloader.remove(), 500);
        }, 1000);
    });
}

// ===== GSAP Animations =====
function initGSAPAnimations() {
    // Hero Section Animations
    animateHeroSection();
    
    // About Section Animations
    animateAboutSection();
    
    // Services Section Animations
    animateServicesSection();
    
    // Mission/Vision/Values Animations
    animateMissionSection();
    
    // Testimonials Animations
    animateTestimonialsSection();
    
    // Footer Animations
    animateFooterSection();
}

// Hero Section - Fade in background, slide heading, staggered CTAs
function animateHeroSection() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    const heroImage = heroSection.querySelector('.hero-image');
    const heroOverlay = heroSection.querySelector('.hero-overlay');
    const heroHeading = heroSection.querySelector('.hero-content h1');
    const heroSubtext = heroSection.querySelector('.hero-content p');
    const heroButtons = heroSection.querySelector('.hero-buttons');
    
    // Timeline for hero animations
    const heroTL = gsap.timeline({
        defaults: { ease: 'power2.out' }
    });
    
    if (heroImage) {
        heroTL.from(heroImage, {
            opacity: 0,
            y: 50,
            duration: 1.2
        });
    }
    
    if (heroOverlay) {
        heroTL.from(heroOverlay, {
            opacity: 0,
            duration: 0.8
        }, '-=0.6');
    }
    
    if (heroHeading) {
        heroTL.from(heroHeading, {
            opacity: 0,
            x: -100,
            duration: 1
        }, '-=0.4');
    }
    
    if (heroSubtext) {
        heroTL.from(heroSubtext, {
            opacity: 0,
            y: 30,
            duration: 0.8
        }, '-=0.5');
    }
    
    if (heroButtons) {
        const buttons = heroButtons.querySelectorAll('.btn');
        heroTL.from(buttons, {
            opacity: 0,
            y: 30,
            stagger: 0.2,
            duration: 0.8
        }, '-=0.4');
    }
    
    // Subtle parallax zoom on scroll
    if (heroImage) {
        gsap.to(heroImage, {
            scale: 1.1,
            scrollTrigger: {
                trigger: heroSection,
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    }
}

// About Section - Slide from right, fade up paragraphs, pop-in boxes
function animateAboutSection() {
    const aboutSection = document.querySelector('.intro-section');
    if (!aboutSection) return;
    
    const heading = aboutSection.querySelector('h2');
    const paragraphs = aboutSection.querySelectorAll('p');
    const valueCards = document.querySelectorAll('.service-card');
    
    // Section title slides in from right
    if (heading) {
        gsap.from(heading, {
            scrollTrigger: {
                trigger: heading,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: 100,
            duration: 1,
            ease: 'power2.out'
        });
    }
    
    // Paragraphs fade up one by one
    if (paragraphs.length > 0) {
        gsap.from(paragraphs, {
            scrollTrigger: {
                trigger: paragraphs[0],
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power2.out'
        });
    }
    
    // Innovation/Integrity/Impact boxes pop-in
    if (valueCards.length > 0) {
        valueCards.forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                scale: 0.8,
                y: 30,
                duration: 0.6,
                delay: index * 0.15,
                ease: 'back.out(1.2)'
            });
        });
    }
    
    // Background parallax effect
    gsap.to(aboutSection, {
        backgroundPosition: '50% 30%',
        ease: 'none',
        scrollTrigger: {
            trigger: aboutSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        }
    });
}

// Services Section - Alternating slides, hover glow
function animateServicesSection() {
    const servicesSection = document.querySelector('.services-section');
    if (!servicesSection) return;
    
    const heading = servicesSection.querySelector('h2');
    const serviceCards = servicesSection.querySelectorAll('.service-card');
    
    // Section heading fades up
    if (heading) {
        gsap.from(heading, {
            scrollTrigger: {
                trigger: heading,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power2.out'
        });
    }
    
    // Service cards slide in alternately
    serviceCards.forEach((card, index) => {
        const direction = index % 2 === 0 ? -100 : 100;
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: direction,
            duration: 0.8,
            ease: 'power2.out'
        });
    });
}

// Mission/Vision/Values - Fade-up with scale, gold shimmer
function animateMissionSection() {
    const missionElements = document.querySelectorAll('[data-aos="fade-up"]');
    
    missionElements.forEach((element, index) => {
        if (element.closest('.intro-section') || element.closest('section[style*="padding"]')) {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 40,
                scale: 0.95,
                duration: 0.8,
                delay: index * 0.1,
                ease: 'power2.out'
            });
        }
    });
}

// Testimonials - Slide up with fade, sequential stars
function animateTestimonialsSection() {
    const testimonials = document.querySelectorAll('.testimonial');
    
    testimonials.forEach((testimonial, index) => {
        const stars = testimonial.querySelector('.stars');
        const text = testimonial.querySelector('.testimonial-text');
        const author = testimonial.querySelector('.testimonial-author');
        
        // Card slides up
        gsap.from(testimonial, {
            scrollTrigger: {
                trigger: testimonial,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 60,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'power2.out'
        });
        
        // Stars pop in sequentially
        if (stars) {
            gsap.from(stars, {
                scrollTrigger: {
                    trigger: testimonial,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                scale: 0,
                duration: 0.5,
                delay: 0.3 + (index * 0.2),
                ease: 'back.out(1.7)'
            });
        }
    });
}

// Footer - Fade-up links and social icons
function animateFooterSection() {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    
    const footerColumns = footer.querySelectorAll('.footer-column');
    const socialLinks = footer.querySelectorAll('.social-links a');
    
    // Footer columns fade up
    footerColumns.forEach((column, index) => {
        gsap.from(column, {
            scrollTrigger: {
                trigger: footer,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'power2.out'
        });
    });
    
    // Social icons pop in
    if (socialLinks.length > 0) {
        gsap.from(socialLinks, {
            scrollTrigger: {
                trigger: socialLinks[0],
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: 'back.out(1.7)'
        });
    }
}

// ===== Parallax Effects =====
function initParallaxEffects() {
    // Smooth parallax on hero background
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }
}

// ===== Hover Animations =====
function initHoverAnimations() {
    // Service cards hover with gold border glow
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                boxShadow: '0 12px 28px rgba(201, 162, 39, 0.3), 0 0 0 3px rgba(201, 162, 39, 0.4)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                boxShadow: '0 2px 4px rgba(30, 42, 56, 0.1)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Scroll-to-top button bounce on hover
    const scrollToTop = document.querySelector('.scroll-to-top');
    if (scrollToTop) {
        scrollToTop.addEventListener('mouseenter', () => {
            gsap.to(scrollToTop, {
                y: -5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        scrollToTop.addEventListener('mouseleave', () => {
            gsap.to(scrollToTop, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    }
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    // Smooth reveal for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 0.6,
            delay: (index % 4) * 0.1,
            ease: 'power2.out'
        });
    });
}

// ===== Contact Page Animations =====
function initContactPageAnimations() {
    // Contact form fields slide in alternately
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        const direction = index % 2 === 0 ? -50 : 50;
        
        if (typeof gsap !== 'undefined') {
            gsap.from(group, {
                scrollTrigger: {
                    trigger: group,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                x: direction,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power2.out'
            });
        }
    });
    
    // Map container fade in
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer && typeof gsap !== 'undefined') {
        gsap.from(mapContainer, {
            scrollTrigger: {
                trigger: mapContainer,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power2.out'
        });
    }
    
    // Contact info cards slide in
    const contactCards = document.querySelectorAll('.contact-info-card');
    contactCards.forEach((card, index) => {
        if (typeof gsap !== 'undefined') {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 30,
                duration: 0.6,
                delay: index * 0.15,
                ease: 'power2.out'
            });
        }
    });
    
    // Phone and WhatsApp icons pulse animation
    const contactIcons = document.querySelectorAll('.contact-info-card i, .whatsapp-float i');
    contactIcons.forEach(icon => {
        icon.style.display = 'inline-block';
        
        if (typeof gsap !== 'undefined') {
            gsap.to(icon, {
                scale: 1.1,
                duration: 0.8,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    });
}
