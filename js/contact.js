// Contact Form JavaScript

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

// Handle Contact Form Submission
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.textContent;
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        message: document.getElementById('message').value.trim(),
        submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
        type: 'contact'
    };
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    if (!isValidEmail(formData.email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    try {
        // Save to Firestore
        if (db) {
            await db.collection('contacts').add(formData);
            
            showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
            
            // Reset form
            e.target.reset();
        } else {
            throw new Error('Database not initialized');
        }
        
    } catch (error) {
        console.error('Error submitting contact form:', error);
        showToast('Failed to send message. Please try again or call us directly.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}
