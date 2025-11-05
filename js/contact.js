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
        message: document.getElementById('message').value.trim()
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
    submitBtn.textContent = 'Preparing WhatsApp...';
    
    try {
        // Create WhatsApp message
        const whatsappMessage = createWhatsAppMessage(formData);
        
        // WhatsApp number (replace with actual business number)
        const whatsappNumber = '447760979306'; // UK format without +
        
        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Show success message
        showToast('Redirecting to WhatsApp...', 'success');
        
        // Small delay for user feedback
        setTimeout(() => {
            // Open WhatsApp
            window.open(whatsappURL, '_blank');
            
            // Reset form after successful submission
            e.target.reset();
        }, 1000);
        
        // Also save to Firestore as backup if available
        if (db) {
            await db.collection('contacts').add({
                ...formData,
                submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
                type: 'contact',
                sentVia: 'whatsapp'
            });
        }
        
    } catch (error) {
        console.error('Error preparing WhatsApp message:', error);
        showToast('Something went wrong. Please try calling us directly.', 'error');
    } finally {
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 2000);
    }
}

// Create formatted WhatsApp message
function createWhatsAppMessage(formData) {
    let message = `🏠 *New Contact Form Submission*\n\n`;
    message += `👤 *Name:* ${formData.name}\n`;
    message += `📧 *Email:* ${formData.email}\n`;
    
    if (formData.phone) {
        message += `📱 *Phone:* ${formData.phone}\n`;
    }
    
    message += `\n💬 *Message:*\n${formData.message}\n\n`;
    message += `📅 *Submitted:* ${new Date().toLocaleString('en-GB')}\n`;
    message += `🌐 *Via:* Impact Decor Website Contact Form`;
    
    return message;
}
