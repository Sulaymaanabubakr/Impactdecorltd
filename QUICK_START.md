# ⚡ Quick Start Guide - Impact Decor Limited Website

Get your website live in under 1 hour!

---

## 🚀 Step 1: Firebase Setup (15 minutes)

### Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click **"Add project"**
3. Name: `Impact Decor Website`
4. Click **"Create project"**

### Enable Authentication
1. Click **"Authentication"** in sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"** ✅
5. Enable **"Google"** ✅ (set support email)

### Create Firestore Database
1. Click **"Firestore Database"** in sidebar
2. Click **"Create database"**
3. Select **"Start in test mode"**
4. Choose location (closest to users)
5. Click **"Enable"**

### Set Security Rules
1. In Firestore, go to **"Rules"** tab
2. Paste this:
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
3. Click **"Publish"**

### Get Config
1. Click ⚙️ > **"Project settings"**
2. Scroll to **"Your apps"**
3. Click web icon `</>`
4. Register app: `Impact Decor Web`
5. **COPY the firebaseConfig object**

---

## ☁️ Step 2: Cloudinary Setup (5 minutes)

### Create Account
1. Go to https://cloudinary.com/
2. Sign up (free tier is fine)
3. Verify email and login

### Get Cloud Name
1. On dashboard, copy your **"Cloud name"**
   - Example: `dxxxxx123`

### Create Upload Preset
1. Click ⚙️ **Settings** > **Upload**
2. Scroll to **"Upload presets"**
3. Click **"Add upload preset"**
4. Set **"Signing Mode"** to **"Unsigned"**
5. Name: `impact_decor_uploads`
6. (Optional) Set **"Folder"** to `impact-decor`
7. Click **"Save"**
8. **COPY the preset name**

---

## 🔧 Step 3: Update Config (2 minutes)

### Edit firebase-config.js
1. Open `js/firebase-config.js` in text editor
2. Replace `YOUR_API_KEY` etc. with your Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};
```

3. Replace Cloudinary values:
```javascript
const CLOUDINARY_CLOUD_NAME = 'dxxxxx123'; // Your cloud name
const CLOUDINARY_UPLOAD_PRESET = 'impact_decor_uploads'; // Your preset
```

4. **SAVE the file**

---

## 👤 Step 4: Create Admin User (2 minutes)

1. Go to Firebase Console > **Authentication** > **Users**
2. Click **"Add user"**
3. Email: `admin@impactdecor.co.uk` (or your email)
4. Password: Create a strong password
5. Click **"Add user"**
6. **SAVE your credentials securely**

---

## 🧪 Step 5: Test Locally (5 minutes)

### Start Local Server

**Option A - Python:**
```bash
cd Impactdecorltd
python3 -m http.server 8000
```

**Option B - Node.js:**
```bash
npm install -g http-server
cd Impactdecorltd
http-server
```

**Option C - VS Code:**
- Install "Live Server" extension
- Right-click `index.html` > "Open with Live Server"

### Test Website
1. Open browser: http://localhost:8000
2. Check homepage loads ✅
3. Click through pages ✅
4. Test navigation ✅

### Test Admin
1. Go to: http://localhost:8000/admin/admin-login.html
2. Login with your admin credentials
3. Try uploading a test image ✅
4. Verify it appears in the list ✅
5. Check homepage shows the image ✅

---

## 🌐 Step 6: Deploy (10 minutes)

### Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting
# Select: your project
# Public directory: . (dot)
# Single-page app: No
# GitHub actions: No

# Deploy
firebase deploy
```

Your site is live at: `https://your-project-id.web.app` 🎉

### Alternative: Netlify (Easiest)
1. Go to https://app.netlify.com/
2. Sign up/login
3. Drag and drop your project folder
4. Done! Site is live in 2 minutes 🚀

---

## 📝 Step 7: Customize (30 minutes)

### Update Contact Info
Search and replace in all HTML files:
- **Email:** `info@impactdecor.co.uk` → your email
- **Phone:** `+44 20 1234 5678` → your phone
- **Address:** Update in footer

### Add Your Logo
1. Add logo file to `assets/` folder
2. Update logo references in HTML files

### Add Hero Video (Optional)
1. Add video as `assets/hero-video.mp4`
2. Should be optimized for web (< 10MB)

---

## ✅ Final Checklist

Before going live:
- [ ] Firebase configured and working
- [ ] Cloudinary configured and working
- [ ] Admin user created
- [ ] Tested locally
- [ ] Contact info updated
- [ ] Deployed to hosting
- [ ] Domain configured (if custom)
- [ ] SSL enabled (auto with Firebase/Netlify)
- [ ] Uploaded at least 3-5 project images
- [ ] Tested on mobile device

---

## 🎯 Admin Daily Use

### To Add New Projects

1. Go to: `https://yourdomain.com/admin/admin-login.html`
2. Login with your credentials
3. Click **Images** or **Videos** tab
4. Fill in:
   - Title (e.g., "Kitchen Renovation - Chelsea")
   - Description (e.g., "Complete modern kitchen transformation")
   - Select file and preview
5. Click **"Upload Image"** or **"Upload Video"**
6. Wait for success notification ✅
7. Image/video automatically appears on website!

### To Edit Projects
- Click **Edit** button on any item
- Update title or description
- Click **Save Changes**

### To Delete Projects
- Click **Delete** button
- Confirm deletion
- Item removed from website

---

## 💡 Pro Tips

1. **Optimize Images** before upload (use TinyPNG.com)
2. **Video size:** Keep under 50MB for best performance
3. **Backup admin password:** Store securely
4. **Regular updates:** Add new projects monthly
5. **Monitor contact form:** Check Firebase Console regularly

---

## 🆘 Quick Troubleshooting

**Can't login to admin?**
- Check user exists in Firebase Console > Authentication
- Try password reset in Firebase
- Clear browser cache

**Upload not working?**
- Verify Cloudinary preset is "Unsigned"
- Check file size (max 10MB for images, 50MB for videos)
- Try different browser

**Contact form not saving?**
- Check Firestore security rules
- Verify Firebase is initialized
- Check browser console for errors

---

## 📚 Need More Help?

- **Detailed Setup:** See `SETUP_GUIDE.md`
- **Full Documentation:** See `README.md`
- **Technical Details:** See `PROJECT_SUMMARY.md`

---

## 🎉 You're Done!

Your professional construction website is now live! 

**Remember to:**
- Keep your admin credentials secure
- Upload quality project images regularly
- Update content as your business grows
- Monitor the contact form for inquiries

**Admin URL:** https://yourdomain.com/admin/admin-login.html  
(Don't share this publicly - bookmark it!)

---

**Welcome to your new online presence!** 🏗️✨
