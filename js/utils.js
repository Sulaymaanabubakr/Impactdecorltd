// Utility Functions

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Format date
function formatDate(date) {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('en-GB', options);
}

// Upload to Cloudinary
async function uploadToCloudinary(file, resourceType = 'auto') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
    
    const endpoint = resourceType === 'video' 
        ? `${CLOUDINARY_API_URL}/video/upload`
        : `${CLOUDINARY_API_URL}/image/upload`;
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        
        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
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

// Set current year in footer
function setCurrentYear() {
    const yearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setCurrentYear();
    lazyLoadImages();
});
