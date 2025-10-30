// Contact Form JavaScript

const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const submitLoading = document.getElementById('submitLoading');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Disable submit button
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        submitLoading.style.display = 'inline';

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value || 'General Inquiry',
            message: document.getElementById('message').value,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'unread'
        };

        try {
            if (!db) {
                throw new Error('Database not initialized');
            }

            // Save to Firestore
            await db.collection('contacts').add(formData);

            // Show success message
            showToast('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');

            // Reset form
            contactForm.reset();

        } catch (error) {
            console.error('Error submitting form:', error);
            showToast('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitText.style.display = 'inline';
            submitLoading.style.display = 'none';
        }
    });
}

// Form validation
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

if (emailInput) {
    emailInput.addEventListener('blur', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value && !emailRegex.test(emailInput.value)) {
            emailInput.style.borderColor = '#ef4444';
        } else {
            emailInput.style.borderColor = '';
        }
    });
}

if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        if (phoneInput.value && !phoneRegex.test(phoneInput.value)) {
            phoneInput.style.borderColor = '#ef4444';
        } else {
            phoneInput.style.borderColor = '';
        }
    });
}
