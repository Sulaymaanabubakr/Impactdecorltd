// Admin Login JavaScript

const loginForm = document.getElementById('loginForm');
const googleSignInBtn = document.getElementById('googleSignIn');
const loginBtn = document.getElementById('loginBtn');
const loginText = document.getElementById('loginText');
const loginLoading = document.getElementById('loginLoading');
const errorMessage = document.getElementById('errorMessage');

// Check if user is already logged in
if (auth) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, redirect to dashboard
            window.location.href = 'admin-imdecltd.html';
        }
    });
}

// Email/Password Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Disable button
        loginBtn.disabled = true;
        loginText.style.display = 'none';
        loginLoading.style.display = 'inline';
        errorMessage.style.display = 'none';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            if (!auth) {
                throw new Error('Authentication not initialized');
            }

            await auth.signInWithEmailAndPassword(email, password);
            showToast('Login successful! Redirecting...', 'success');
            
            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = 'admin-imdecltd.html';
            }, 1000);

        } catch (error) {
            console.error('Login error:', error);
            let errorMsg = 'Login failed. Please check your credentials.';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMsg = 'No account found with this email address.';
                    break;
                case 'auth/wrong-password':
                    errorMsg = 'Incorrect password. Please try again.';
                    break;
                case 'auth/invalid-email':
                    errorMsg = 'Invalid email address format.';
                    break;
                case 'auth/user-disabled':
                    errorMsg = 'This account has been disabled.';
                    break;
                case 'auth/too-many-requests':
                    errorMsg = 'Too many failed login attempts. Please try again later.';
                    break;
            }
            
            errorMessage.textContent = errorMsg;
            errorMessage.style.display = 'block';

            // Re-enable button
            loginBtn.disabled = false;
            loginText.style.display = 'inline';
            loginLoading.style.display = 'none';
        }
    });
}

// Google Sign-In
if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', async () => {
        try {
            if (!auth) {
                throw new Error('Authentication not initialized');
            }

            const provider = new firebase.auth.GoogleAuthProvider();
            await auth.signInWithPopup(provider);
            
            showToast('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'admin-imdecltd.html';
            }, 1000);

        } catch (error) {
            console.error('Google sign-in error:', error);
            let errorMsg = 'Google sign-in failed. Please try again.';
            
            if (error.code === 'auth/popup-closed-by-user') {
                errorMsg = 'Sign-in cancelled.';
            } else if (error.code === 'auth/popup-blocked') {
                errorMsg = 'Pop-up blocked. Please allow pop-ups for this site.';
            }
            
            errorMessage.textContent = errorMsg;
            errorMessage.style.display = 'block';
        }
    });
}
