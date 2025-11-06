// Quote Form JavaScript with Cloudinary Photo Upload Integration

// Cloudinary configuration (re-use globals from firebase-config to avoid redeclaration)
const QUOTE_CLOUDINARY_CLOUD_NAME = typeof CLOUDINARY_CLOUD_NAME !== 'undefined'
    ? CLOUDINARY_CLOUD_NAME
    : 'dsfobvsyg';
const QUOTE_CLOUDINARY_UPLOAD_PRESET = typeof CLOUDINARY_IMAGE_UPLOAD_PRESET !== 'undefined'
    ? CLOUDINARY_IMAGE_UPLOAD_PRESET
    : 'impact_images';
const QUOTE_CLOUDINARY_API_URL = typeof CLOUDINARY_API_URL !== 'undefined'
    ? CLOUDINARY_API_URL
    : `https://api.cloudinary.com/v1_1/${QUOTE_CLOUDINARY_CLOUD_NAME}`;

let uploadedPhotoUrls = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log('Quote form JavaScript loaded');
    
    const quoteForm = document.getElementById('quote-form');
    const photoInput = document.getElementById('photo');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', handleQuoteSubmit);
        console.log('Quote form event listener added');
    }
    
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoSelection);
        console.log('Photo input event listener added');
    }
});

// Handle Photo Selection and Preview
function handlePhotoSelection(e) {
    const files = e.target.files;
    const preview = document.getElementById('photo-preview');
    const status = document.getElementById('upload-status');
    const resetPreview = (message = '') => {
        preview.classList.remove('show');
        preview.innerHTML = '';
        preview.style.display = 'none';
        status.textContent = message;
        status.className = message ? 'upload-status info' : 'upload-status';
    };
    
    if (files.length === 0) {
        resetPreview();
        return;
    }
    
    // Validate number of files
    if (files.length > 5) {
        showToast('Maximum 5 photos allowed', 'error');
        e.target.value = '';
        resetPreview();
        return;
    }
    
    // Validate file sizes
    for (let file of files) {
        if (file.size > 10 * 1024 * 1024) { // 10MB
            showToast(`${file.name} is too large. Maximum 10MB per file.`, 'error');
            e.target.value = '';
            resetPreview();
            return;
        }
        
        if (!file.type.startsWith('image/')) {
            showToast(`${file.name} is not an image file.`, 'error');
            e.target.value = '';
            resetPreview();
            return;
        }
    }
    
    // Show preview
    preview.innerHTML = '';
    preview.classList.add('show');
    preview.style.display = 'grid';
    
    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'photo-preview-item';
            previewItem.innerHTML = `
                <img src="${event.target.result}" alt="Preview ${index + 1}">
                <span class="file-name">${file.name}</span>
            `;
            preview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });
    
    status.textContent = `${files.length} photo(s) selected and ready to upload`;
    status.className = 'upload-status info';
}

// Upload Photos to Cloudinary
async function uploadPhotos(files) {
    const urls = [];
    const status = document.getElementById('upload-status');
    
    // Cloudinary is now properly configured with real values
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        status.textContent = `Uploading photo ${i + 1} of ${files.length}...`;
        status.className = 'upload-status info';
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', QUOTE_CLOUDINARY_UPLOAD_PRESET);
            formData.append('folder', 'quotes');
            formData.append('tags', 'quote,impact-decor');
            
            const response = await fetch(`${QUOTE_CLOUDINARY_API_URL}/image/upload`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Upload failed: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
            }
            
            const data = await response.json();
            urls.push({
                url: data.secure_url,
                fileName: file.name,
                publicId: data.public_id
            });
            
        } catch (error) {
            console.error('Error uploading photo:', error);
            showToast(`Failed to upload ${file.name}: ${error.message}`, 'error');
        }
    }
    
    if (urls.length > 0) {
        status.textContent = `${urls.length} photo(s) uploaded successfully!`;
        status.className = 'upload-status success';
    } else if (files.length > 0) {
        status.textContent = 'Photo upload failed. You can still send your message and mention the photos.';
        status.className = 'upload-status error';
    }
    
    return urls;
}

// Handle Quote Form Submission
async function handleQuoteSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.textContent;
    const photoInput = document.getElementById('photo');
    const preview = document.getElementById('photo-preview');
    const status = document.getElementById('upload-status');
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        service: document.getElementById('service').value,
        message: document.getElementById('message').value.trim()
    };
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.message) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    if (!isValidEmail(formData.email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    try {
        let photoUrls = [];
        
        // Handle photo uploads if any
        if (photoInput.files.length > 0) {
            submitBtn.textContent = 'Uploading photos...';
            showToast('Uploading photos to cloud storage...', 'info');
            
            photoUrls = await uploadPhotos(photoInput.files);
            
            if (photoUrls.length === 0 && photoInput.files.length > 0) {
                showToast('Failed to upload photos. Continue without photos or try again.', 'error');
                // Give user option to continue
                const continueWithoutPhotos = confirm('Photo upload failed. Would you like to continue without photos?');
                if (!continueWithoutPhotos) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    return;
                }
            }
        }
        
        // Create WhatsApp message with photos
        submitBtn.textContent = 'Preparing WhatsApp message...';
        const whatsappMessage = createQuoteWhatsAppMessage(formData, photoUrls);
        
        // WhatsApp number (replace with actual business number)
        const whatsappNumber = '447760979306'; // UK format without +
        
        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Show success message
        showToast('Opening WhatsApp with your quote request...', 'success');

        const newTab = window.open(whatsappURL, '_blank');
        if (!newTab) {
            window.location.href = whatsappURL;
        }
        
        // Also save to Firestore as backup if available
        if (typeof db !== 'undefined' && db) {
            db.collection('quotes').add({
                ...formData,
                photoUrls: photoUrls.map(p => ({ url: p.url, fileName: p.fileName })),
                submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
                type: 'quote',
                status: 'pending',
                sentVia: 'whatsapp',
                hasPhotos: photoUrls.length > 0
            }).catch(error => {
                console.error('Error saving backup quote:', error);
            });
        }
        
        // Reset form after successful submission
        e.target.reset();
        if (preview) {
            preview.classList.remove('show');
            preview.innerHTML = '';
            preview.style.display = 'none';
        }
        if (status) {
            status.textContent = '';
            status.className = 'upload-status';
        }
        uploadedPhotoUrls = photoUrls;
        
    } catch (error) {
        console.error('Error processing quote submission:', error);
        showToast('Something went wrong. Please try calling us directly.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Create formatted WhatsApp message for quote
function createQuoteWhatsAppMessage(formData, photoUrls = []) {
    const submittedAt = new Date().toLocaleString('en-GB');
    const lines = [];

    lines.push('Impact Decor Ltd - New Quote Request');
    lines.push('');
    lines.push(`Name: ${formData.name}`);
    lines.push(`Email: ${formData.email}`);
    lines.push(`Phone: ${formData.phone}`);

    if (formData.address) {
        lines.push(`Address: ${formData.address}`);
    }

    lines.push('');
    lines.push(`Service Needed: ${getServiceDisplayName(formData.service)}`);
    lines.push('');
    lines.push('Project Details:');
    lines.push(formData.message);

    if (photoUrls && photoUrls.length > 0) {
        lines.push('');
        lines.push(`Project Photos (${photoUrls.length}):`);
        photoUrls.forEach((photo, index) => {
            const fileName = photo.fileName.length > 60
                ? `${photo.fileName.slice(0, 57)}...`
                : photo.fileName;
            lines.push(`${index + 1}. ${fileName}`);
            lines.push(photo.url);
        });
    }

    lines.push('');
    lines.push(`Submitted: ${submittedAt}`);
    lines.push('Source: Impact Decor Quote Form');
    lines.push('');
    lines.push('Thank you! Please let me know the next steps.');

    return lines.join('\n');
}

// Get service display name
function getServiceDisplayName(serviceValue) {
    const serviceNames = {
        'interior-painting': 'Interior Painting',
        'exterior-painting': 'Exterior Painting',
        'wallpaper': 'Wallpaper Installation',
        'plumbing': 'Domestic Plumbing',
        'tiling': 'Tiling (Kitchens, Bathrooms, Floors)',
        'coving': 'Coving & Moulding',
        'surface-prep': 'Surface Preparation & Plaster Repair',
        'carpentry': 'Carpentry & Fittings',
        'property-maintenance': 'Property Maintenance & Renovation',
        'other': 'Other (see project details)'
    };
    return serviceNames[serviceValue] || serviceValue;
}

// Note: showToast and isValidEmail functions are imported from utils.js
