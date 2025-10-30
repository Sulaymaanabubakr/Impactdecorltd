// Admin Login JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    if (auth) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                // Redirect to dashboard if already logged in
                window.location.href = 'admin-imdecltd.html';
            }
        });
    }
    
    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleEmailLogin);
    }
    
    // Handle Google login
    const googleBtn = document.getElementById('google-login-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', handleGoogleLogin);
    }
});

// Handle Email/Password Login
async function handleEmailLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('login-btn');
    const originalText = loginBtn.textContent;
    
    if (!email || !password) {
        showToast('Please enter email and password', 'error');
        return;
    }
    
    loginBtn.disabled = true;
    loginBtn.textContent = 'Signing in...';
    
    try {
        if (!auth) {
            throw new Error('Authentication not initialized');
        }
        
        await auth.signInWithEmailAndPassword(email, password);
        
        showToast('Login successful!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'admin-imdecltd.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        
        let errorMessage = 'Login failed. Please try again.';
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email.';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many failed attempts. Please try again later.';
        }
        
        showToast(errorMessage, 'error');
        
        loginBtn.disabled = false;
        loginBtn.textContent = originalText;
    }
}

// Handle Google Login
async function handleGoogleLogin() {
    const googleBtn = document.getElementById('google-login-btn');
    const originalText = googleBtn.textContent;
    
    googleBtn.disabled = true;
    googleBtn.textContent = 'Signing in with Google...';
    
    try {
        if (!auth) {
            throw new Error('Authentication not initialized');
        }
        
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
        
        showToast('Login successful!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'admin-imdecltd.html';
        }, 1000);
        
    } catch (error) {
        console.error('Google login error:', error);
        
        let errorMessage = 'Google sign-in failed. Please try again.';
        
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Sign-in cancelled.';
        } else if (error.code === 'auth/popup-blocked') {
            errorMessage = 'Pop-up blocked. Please allow pop-ups for this site.';
        }
        
        showToast(errorMessage, 'error');
        
        googleBtn.disabled = false;
        googleBtn.textContent = originalText;
    }
}
