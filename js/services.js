// Services Page JavaScript

// Open Service Modal
function openServiceModal(serviceId) {
    const modal = document.getElementById(serviceId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Close Service Modal
function closeServiceModal(serviceId) {
    const modal = document.getElementById(serviceId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                modal.classList.remove('show');
            });
            document.body.style.overflow = 'auto';
        }
    });
});
