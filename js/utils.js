// Utility Functions for Impact Decor Ltd Website

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Format date for display
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate UK phone number
function isValidUKPhone(phone) {
    // Remove spaces and common formatting
    const cleanPhone = phone.replace(/[\s()-]/g, '');
    // Check if it's a valid UK format
    const ukPhoneRegex = /^(\+44|0044|0)[1-9]\d{9,10}$/;
    return ukPhoneRegex.test(cleanPhone);
}

// Sanitize input to prevent XSS
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to element
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Get query parameter from URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Initialize current year in footer
function updateCurrentYear() {
    const yearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
}

// Video utilities
function isVideoFile(url) {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
}

function getMediaType(item = {}) {
    if (!item || typeof item !== 'object') return 'image';

    if (item.isVideo === true) return 'video';
    if (item.isImage === true) return 'image';

    const normalize = (value) => typeof value === 'string' ? value.trim().toLowerCase() : '';
    const typeCandidates = [
        normalize(item.type),
        normalize(item.mediaType),
        normalize(item.resourceType),
        normalize(item.fileType),
        normalize(item.category),
        normalize(item.kind)
    ].filter(Boolean);

    for (const candidate of typeCandidates) {
        if (['video', 'videos', 'videoclip', 'clip'].includes(candidate)) return 'video';
        if (['image', 'images', 'photo', 'picture', 'photograph'].includes(candidate)) return 'image';
    }

    const mimeType = normalize(item.mimeType || item.contentType);
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('image/')) return 'image';

    const urlCandidates = [
        item.url,
        item.mediaUrl,
        item.secure_url,
        item.downloadURL,
        item.storagePath,
        item.previewUrl
    ].filter(Boolean);

    if (urlCandidates.some(candidate => isVideoFile(candidate))) {
        return 'video';
    }

    return 'image';
}

function isVideoMedia(item) {
    return getMediaType(item) === 'video';
}

function getMediaPoster(item = {}) {
    const posterCandidates = [
        item.posterUrl,
        item.poster,
        item.thumbnailUrl,
        item.thumbnail,
        item.previewImage,
        item.previewUrl,
        item.coverImage,
        item.coverUrl
    ];

    const poster = posterCandidates.find(candidate => typeof candidate === 'string' && candidate.trim() !== '');
    return poster ? poster : '';
}

function normalizeMediaItem(item = {}) {
    if (!item || typeof item !== 'object') return item;

    const normalizedType = getMediaType(item);
    const normalizedUrl = item.url || item.mediaUrl || item.secure_url || item.downloadURL || '';

    return {
        ...item,
        type: normalizedType,
        normalizedType,
        url: normalizedUrl,
        title: item.title || item.name || '',
        description: item.description || item.caption || '',
        posterUrl: getMediaPoster(item)
    };
}

function buildMediaElementHTML(item, options = {}) {
    const settings = {
        className: 'project-media',
        lazyLoadImages: true,
        controls: true,
        preload: 'metadata',
        autoplay: false,
        playsInline: true,
        ...options
    };

    if (!item) return '';

    const normalizedItem = normalizeMediaItem(item);
    const isVideo = isVideoMedia(normalizedItem);
    const safeUrl = sanitizeInput(normalizedItem.url || '');
    const safeTitle = sanitizeInput(normalizedItem.title || 'Project media');

    if (!safeUrl) {
        return `<div class="${settings.className} media-unavailable">Media unavailable</div>`;
    }

    if (isVideo) {
        const poster = sanitizeInput(getMediaPoster(normalizedItem));
        const posterAttr = poster ? ` poster="${poster}"` : '';
        const controlsAttr = settings.controls ? ' controls' : '';
        const autoplayAttr = settings.autoplay ? ' autoplay muted loop' : '';
        const playsInlineAttr = settings.playsInline ? ' playsinline' : '';
        const preloadAttr = settings.preload ? ` preload="${settings.preload}"` : '';

        return `<video src="${safeUrl}" class="${settings.className}"${controlsAttr}${preloadAttr}${playsInlineAttr}${posterAttr}${autoplayAttr}>
            <p>Your browser doesn't support video playback. <a href="${safeUrl}" target="_blank" rel="noopener">Download video</a>.</p>
        </video>`;
    }

    const loadingAttr = settings.lazyLoadImages ? ' loading="lazy"' : '';
    return `<img src="${safeUrl}" alt="${safeTitle}" class="${settings.className}"${loadingAttr}>`;
}

function getVideoThumbnail(videoElement) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        videoElement.addEventListener('loadeddata', () => {
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            ctx.drawImage(videoElement, 0, 0);
            resolve(canvas.toDataURL());
        });
        
        videoElement.currentTime = 1; // Get frame at 1 second
    });
}

function formatVideoDuration(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Call on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCurrentYear();
    lazyLoadImages();
});
