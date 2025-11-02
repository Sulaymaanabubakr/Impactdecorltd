// Quote Form JavaScript

let uploadedPhotoUrls = [];

document.addEventListener('DOMContentLoaded', () => {
    const quoteForm = document.getElementById('quote-form');
    const photoInput = document.getElementById('photo');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', handleQuoteSubmit);
    }
    
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoSelection);
    }
});

// Handle Photo Selection and Preview
function handlePhotoSelection(e) {
    const files = e.target.files;
    const preview = document.getElementById('photo-preview');
    const status = document.getElementById('upload-status');
    
    if (files.length === 0) return;
    
    // Validate number of files
    if (files.length > 5) {
        showToast('Maximum 5 photos allowed', 'error');
        e.target.value = '';
        return;
    }
    
    // Validate file sizes
    for (let file of files) {
        if (file.size > 10 * 1024 * 1024) { // 10MB
            showToast(`${file.name} is too large. Maximum 10MB per file.`, 'error');
            e.target.value = '';
            return;
        }
    }
    
    // Show preview
    preview.innerHTML = '';
    preview.style.display = 'block';
    
    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '200px';
            img.style.marginRight = '10px';
            img.style.marginBottom = '10px';
            img.style.borderRadius = '8px';
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
    
    status.textContent = `${files.length} photo(s) selected`;
}

// Upload Photos to Cloudinary
async function uploadPhotos(files) {
    const urls = [];
    const status = document.getElementById('upload-status');
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        status.textContent = `Uploading photo ${i + 1} of ${files.length}...`;
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', getCloudinaryUploadPreset('image'));
            formData.append('folder', 'quotes');
            
            const response = await fetch(`${CLOUDINARY_API_URL}/image/upload`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Upload failed');
            }
            
            const data = await response.json();
            urls.push(data.secure_url);
            
        } catch (error) {
            console.error('Error uploading photo:', error);
            showToast(`Failed to upload ${file.name}`, 'error');
        }
    }
    
    status.textContent = urls.length > 0 ? `${urls.length} photo(s) uploaded successfully` : '';
    return urls;
}

// Handle Quote Form Submission
async function handleQuoteSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.textContent;
    const photoInput = document.getElementById('photo');
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        service: document.getElementById('service').value,
        message: document.getElementById('message').value.trim(),
        photoUrls: [],
        submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
        type: 'quote',
        status: 'pending'
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
    submitBtn.textContent = 'Submitting...';
    
    try {
        // Upload photos if any
        if (photoInput.files.length > 0) {
            submitBtn.textContent = 'Uploading photos...';
            formData.photoUrls = await uploadPhotos(photoInput.files);
        }
        
        submitBtn.textContent = 'Saving...';
        
        // Save to Firestore
        if (db) {
            await db.collection('quotes').add(formData);
            
            showToast('Your quote request has been submitted successfully! We\'ll contact you within 24 hours.', 'success');
            
            // Reset form
            e.target.reset();
            document.getElementById('photo-preview').style.display = 'none';
            document.getElementById('upload-status').textContent = '';
            
            // Redirect to thank you or home page after 3 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        } else {
            throw new Error('Database not initialized');
        }
        
    } catch (error) {
        console.error('Error submitting quote:', error);
        showToast('Failed to submit quote. Please try again or call us directly.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}
