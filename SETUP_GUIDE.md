# Quick Setup Guide for Impact Decor Limited Website

This guide will help you get the website up and running quickly.

## Prerequisites

Before you begin, make sure you have:
- [ ] A Firebase account ([create one here](https://firebase.google.com/))
- [ ] A Cloudinary account ([create one here](https://cloudinary.com/))
- [ ] A modern web browser
- [ ] A text editor (VS Code recommended)

## Step-by-Step Setup

### Step 1: Firebase Configuration (15 minutes)

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add project"
   - Name it "Impact Decor Website" (or your preferred name)
   - Disable Google Analytics (optional)
   - Click "Create project"

2. **Get Firebase Config**
   - In your Firebase project, click the gear icon ⚙️ > Project settings
   - Scroll down to "Your apps"
   - Click the Web icon `</>`
   - Register your app with a nickname (e.g., "Impact Decor Web")
   - Copy the `firebaseConfig` object

3. **Enable Authentication**
   - In Firebase Console, go to "Authentication" in the left menu
   - Click "Get started"
   - Go to "Sign-in method" tab
   - Enable "Email/Password" - toggle it on
   - Enable "Google" - toggle it on, set support email
   - Save changes

4. **Create Firestore Database**
   - Go to "Firestore Database" in the left menu
   - Click "Create database"
   - Choose "Start in test mode" (for development)
   - Select your preferred location (choose closest to your users)
   - Click "Enable"

5. **Set Firestore Security Rules**
   - In Firestore, go to "Rules" tab
   - Replace the rules with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /media/{document} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       match /contacts/{document} {
         allow create: if true;
         allow read, update, delete: if request.auth != null;
       }
     }
   }
   ```
   - Click "Publish"

### Step 2: Cloudinary Configuration (5 minutes)

1. **Create Cloudinary Account**
   - Sign up at https://cloudinary.com/
   - Verify your email
   - Log in to your dashboard

2. **Get Your Cloud Name**
   - On the dashboard, you'll see your "Cloud name" (e.g., "dxxxxx")
   - Copy this value

3. **Create Upload Preset**
   - Go to Settings (gear icon) > Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Set "Signing Mode" to "Unsigned"
   - Set "Preset name" to something like "impact_decor_uploads"
   - (Optional) Set "Folder" to "impact-decor" to organize uploads
   - Click "Save"
   - Copy the preset name

### Step 3: Update Configuration Files (2 minutes)

1. **Open the Project**
   - Open the project folder in your text editor

2. **Update Firebase Config**
   - Open `js/firebase-config.js`
   - Replace the placeholder values with your Firebase config:
   ```javascript
   const firebaseConfig = {
       apiKey: "AIza...", // Paste your actual values here
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "123456789",
       appId: "1:123:web:abc123"
   };
   ```

3. **Update Cloudinary Config**
   - In the same file, update:
   ```javascript
   const CLOUDINARY_CLOUD_NAME = 'your_cloud_name'; // e.g., 'dxxxxx'
   const CLOUDINARY_UPLOAD_PRESET = 'impact_decor_uploads'; // Your preset name
   ```

4. **Save the file**

### Step 4: Create Admin User (2 minutes)

1. **Go to Firebase Console**
   - Navigate to Authentication > Users
   - Click "Add user"
   - Enter your email (e.g., admin@impactdecor.co.uk)
   - Enter a strong password
   - Click "Add user"

### Step 5: Test Locally (5 minutes)

1. **Start a Local Server**
   
   Choose one method:

   **Option A: Python (if installed)**
   ```bash
   cd /path/to/Impactdecorltd
   python3 -m http.server 8000
   ```

   **Option B: VS Code Live Server**
   - Install "Live Server" extension
   - Right-click `index.html`
   - Select "Open with Live Server"

   **Option C: Node.js http-server**
   ```bash
   npm install -g http-server
   cd /path/to/Impactdecorltd
   http-server
   ```

2. **Open in Browser**
   - Go to http://localhost:8000 (or the port shown)
   - You should see the homepage

3. **Test Admin Login**
   - Navigate to http://localhost:8000/admin/admin-login.html
   - Login with the email/password you created
   - You should be redirected to the dashboard

4. **Test Upload**
   - Try uploading a test image
   - Check if it appears in the dashboard
   - Verify it's stored in Cloudinary
   - Check if it shows on the homepage

### Step 6: Deploy to Production (10 minutes)

#### Option A: Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init hosting
# Select your project
# Public directory: . (current directory)
# Single-page app: No
# GitHub actions: No

# Deploy
firebase deploy
```

Your site will be live at: `https://your-project-id.web.app`

#### Option B: Netlify (Easiest)

1. Go to https://app.netlify.com/
2. Sign up/Login
3. Click "Add new site" > "Deploy manually"
4. Drag and drop your project folder
5. Site will be live in minutes

#### Option C: GitHub Pages

1. Push code to GitHub
2. Go to repository Settings > Pages
3. Select branch and root folder
4. Save and wait for deployment

## Post-Deployment Checklist

- [ ] Update Firebase authorized domains (Add your production domain)
- [ ] Update contact information in HTML files
- [ ] Add your company logo to assets folder
- [ ] Test all forms and functionality
- [ ] Upload initial project images through admin dashboard
- [ ] Test on mobile devices
- [ ] Check all pages load correctly
- [ ] Verify admin login works
- [ ] Test image and video uploads

## Common Issues

### "Firebase not defined"
- Make sure you're running on a local server, not opening HTML directly
- Check that Firebase CDN scripts are loading

### "Can't upload to Cloudinary"
- Verify your upload preset is set to "Unsigned"
- Check your cloud name is correct
- Ensure you have internet connection

### "Admin can't login"
- Verify user exists in Firebase Authentication
- Check Firebase config is correct
- Try clearing browser cache

### "Firestore permission denied"
- Check Firestore security rules are set correctly
- Verify user is authenticated for write operations

## Next Steps

1. **Customize Content**
   - Update all text content to match your company
   - Replace placeholder contact info
   - Add your actual address and phone number

2. **Add Media**
   - Upload company logo
   - Add hero video (optional)
   - Upload initial project images through admin

3. **Customize Styling**
   - Adjust colors in `css/styles.css` if needed
   - Update fonts if desired

4. **SEO Optimization**
   - Update meta descriptions
   - Add Google Analytics (optional)
   - Submit sitemap to search engines

## Support

If you encounter any issues:
1. Check the main README.md file
2. Review Firebase and Cloudinary documentation
3. Check browser console for error messages
4. Verify all configuration values are correct

## Security Reminder

🔐 **Important**: Never commit your actual API keys to public repositories!

---

**You're all set!** Your website is now ready to use. Don't forget to share the admin URL only with authorized personnel.
