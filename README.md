# Impact Decor Limited - Professional Construction Company Website

A complete, professional, and visually stunning website for Impact Decor Limited, a premium construction company based in the United Kingdom.

## 🌟 Overview

This is a world-class, modern, and fully functional construction website featuring:
- Premium, trustworthy British design aesthetic
- Clean modern layout with generous white space
- Smooth animations and professional transitions
- Comprehensive admin dashboard for content management
- Firebase backend integration
- Cloudinary media storage
- Fully responsive across all devices

## 🎨 Design Features

### Color Palette
- **Royal Navy Blue**: #1a2a44
- **Platinum Grey**: #e5e7eb
- **Deep Gold**: #c8a54f
- **Pure White**: #ffffff

### Typography
- **Headings**: Poppins (Google Fonts)
- **Body Text**: Inter (Google Fonts)

### Visual Elements
- Subtle drop shadows and glassy overlays
- Smooth scroll animations with AOS library
- Image fade-ins and hover transitions
- Gradient buttons with hover effects

## 📁 Project Structure

```
Impactdecorltd/
├── index.html              # Homepage
├── about.html              # About page
├── services.html           # Services page
├── projects.html           # Projects overview page
├── contact.html            # Contact page
├── images.html             # Images gallery page
├── videos.html             # Videos gallery page
├── admin/
│   ├── admin-login.html    # Admin login page
│   └── admin-imdecltd.html # Admin dashboard
├── css/
│   ├── styles.css          # Main stylesheet
│   └── admin.css           # Admin-specific styles
├── js/
│   ├── firebase-config.js  # Firebase configuration
│   ├── utils.js            # Utility functions
│   ├── main.js             # Main JavaScript
│   ├── services.js         # Services page functionality
│   ├── projects.js         # Projects page functionality
│   ├── gallery.js          # Gallery pages functionality
│   ├── contact.js          # Contact form functionality
│   ├── admin-login.js      # Admin login functionality
│   └── admin-dashboard.js  # Admin dashboard functionality
├── assets/                 # Images, videos, favicon
└── README.md
```

## 🚀 Technologies Used

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom styles with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Modern JavaScript features
- **AOS.js**: Scroll animations

### Backend Services
- **Firebase Authentication**: Email/password and Google sign-in
- **Cloud Firestore**: NoSQL database for storing media metadata and contact submissions
- **Cloudinary**: Cloud-based media storage for images and videos

### APIs
- **Google Maps API**: Embedded map on contact page
- **Google Fonts API**: Poppins and Inter fonts

## 🛠️ Setup Instructions

### Prerequisites
- A modern web browser
- Firebase account
- Cloudinary account
- Basic understanding of HTML, CSS, and JavaScript

### Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Google Analytics (optional)

2. **Enable Authentication**
   - Navigate to Authentication > Sign-in method
   - Enable "Email/Password" authentication
   - Enable "Google" sign-in provider
   - Add your domain to authorized domains

3. **Create Firestore Database**
   - Navigate to Firestore Database
   - Click "Create database"
   - Start in production mode (or test mode for development)
   - Choose a Cloud Firestore location

4. **Set up Collections**
   - Create a `media` collection for storing image/video metadata
   - Create a `contacts` collection for contact form submissions

5. **Get Firebase Configuration**
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click on the web app icon (</>) to add a web app
   - Copy the Firebase configuration object
   - Paste it into `js/firebase-config.js`

### Cloudinary Setup

1. **Create a Cloudinary Account**
   - Sign up at [Cloudinary](https://cloudinary.com/)
   - Get your Cloud Name from the dashboard

2. **Create Upload Preset**
   - Navigate to Settings > Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Set signing mode to "Unsigned"
   - Configure folder and transformations as needed
   - Save the preset name

3. **Configure Application**
   - Open `js/firebase-config.js`
   - Replace `YOUR_CLOUD_NAME` with your Cloudinary cloud name
   - Replace `YOUR_UPLOAD_PRESET` with your upload preset name

### Configuration

1. **Clone or Download the Project**
   ```bash
   git clone https://github.com/Sulaymaanabubakr/Impactdecorltd.git
   cd Impactdecorltd
   ```

2. **Update Firebase Configuration**
   - Open `js/firebase-config.js`
   - Replace the placeholder values with your Firebase configuration:
     ```javascript
     const firebaseConfig = {
         apiKey: "YOUR_API_KEY",
         authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
         projectId: "YOUR_PROJECT_ID",
         storageBucket: "YOUR_PROJECT_ID.appspot.com",
         messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
         appId: "YOUR_APP_ID"
     };
     ```

3. **Update Cloudinary Configuration**
   - In the same file, update:
     ```javascript
     const CLOUDINARY_CLOUD_NAME = 'your_cloud_name';
     const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset';
     ```

4. **Add Assets**
   - Place your logo in `assets/` directory
   - Add a favicon.png to `assets/` directory
   - Optionally add a hero video as `assets/hero-video.mp4`

5. **Update Contact Information**
   - Search for placeholder contact details across all HTML files
   - Update with actual company information:
     - Address
     - Email
     - Phone number
     - Social media links

### Running Locally

1. **Using a Local Server**
   
   The website requires a local server to work properly due to Firebase and API integrations.

   **Option 1: Python Simple Server**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Option 2: Node.js http-server**
   ```bash
   npm install -g http-server
   http-server
   ```

   **Option 3: VS Code Live Server Extension**
   - Install "Live Server" extension
   - Right-click on `index.html`
   - Select "Open with Live Server"

2. **Access the Website**
   - Open your browser
   - Navigate to `http://localhost:8000` (or the port shown by your server)

## 📱 Features

### Public Pages

#### Homepage
- Hero section with video background
- Company introduction
- Recent projects preview (10 most recent images and videos)
- Services overview with icons
- Client testimonials
- Call-to-action section
- Footer with contact information

#### About Page
- Company background and story
- Mission and values
- Certifications and compliance badges
- Team gallery

#### Services Page
- Detailed service descriptions
- Construction, refurbishment, painting, interior design, project management, property maintenance
- Service modals with additional information

#### Projects Page
- Preview of image and video projects
- "View All" buttons linking to dedicated galleries

#### Images Gallery
- Full gallery of uploaded images
- Modal view with navigation
- Lazy loading for performance

#### Videos Gallery
- Full gallery of uploaded videos
- Modal player with controls
- Lazy loading for performance

#### Contact Page
- Contact form with validation
- Google Maps integration
- Business hours and contact information
- Form submissions saved to Firestore

### Admin Dashboard

#### Login Page (`admin/admin-login.html`)
- Email/password authentication
- Google sign-in option
- Responsive design
- Not publicly linked (direct URL access only)

#### Dashboard (`admin/admin-imdecltd.html`)
- **Authentication Guard**: Redirects unauthorized users
- **Two Tabs**: Images and Videos
- **Upload Features**:
  - Title and description fields
  - File preview before upload
  - Progress indicators
  - Cloudinary integration
  - Automatic Firestore metadata storage
- **Media Management**:
  - List of all uploaded media
  - Thumbnails/previews
  - Edit functionality (title and description)
  - Delete with confirmation modal
  - Sorted by upload date (newest first)
- **Custom Toast Notifications**: No browser alerts
- **Logout Button**: Clears session and redirects

## 🔐 Security Features

1. **Admin Pages Not Publicly Linked**
   - Admin login page not in navigation
   - Access only through direct URL

2. **Authentication Guards**
   - Admin dashboard checks authentication status
   - Redirects unauthorized users to login

3. **Firestore Security Rules** (Recommended)
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

4. **Environment Variables**
   - For production, consider using environment variables for sensitive data
   - Never commit actual API keys to public repositories

## 🌐 Deployment

### Option 1: Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory (use `.` for root)
   - Configure as single-page app: No
   - Set up automatic builds: No

4. **Deploy**
   ```bash
   firebase deploy
   ```

### Option 2: Netlify

1. **Create account at** [Netlify](https://www.netlify.com/)
2. **Connect repository** or drag and drop the project folder
3. **Configure build settings** (none required for static site)
4. **Deploy**

### Option 3: Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

### Option 4: GitHub Pages

1. **Push code to GitHub repository**
2. **Go to repository Settings > Pages**
3. **Select branch** (usually `main` or `master`)
4. **Select root folder**
5. **Save and wait for deployment**

## 👨‍💼 Admin Access Instructions

### First-Time Setup

1. **Create Admin User**
   - Go to Firebase Console > Authentication
   - Click "Add user"
   - Enter email and password
   - Save the user

2. **Access Admin Panel**
   - Navigate to `https://yourdomain.com/admin/admin-login.html`
   - Sign in with the credentials you created
   - You'll be redirected to the dashboard

3. **Upload Content**
   - Use the Images or Videos tabs
   - Fill in title and description
   - Select file and preview
   - Click upload
   - Wait for success notification

### Daily Operations

- **Login**: `https://yourdomain.com/admin/admin-login.html`
- **Upload**: Use dashboard tabs to upload new content
- **Edit**: Click edit button on any media item
- **Delete**: Click delete button and confirm
- **Logout**: Click logout button in header

## 📊 SEO Features

- Semantic HTML5 markup
- Meta descriptions on all pages
- Open Graph tags for social sharing
- Descriptive alt text for images
- Clean URL structure
- Sitemap ready
- Mobile-responsive (Google mobile-first indexing)

## ♿ Accessibility Features

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Sufficient color contrast
- Alt text for images
- Responsive font sizes

## 🎯 Performance Optimizations

- Lazy loading for images and videos
- Optimized CSS and JavaScript
- Cloudinary auto-optimization for media
- Minimal external dependencies
- Efficient Firebase queries
- CSS animations with GPU acceleration

## 🔧 Customization

### Changing Colors

Edit `css/styles.css` and update CSS variables:
```css
:root {
    --primary-navy: #1a2a44;
    --platinum-grey: #e5e7eb;
    --deep-gold: #c8a54f;
    --pure-white: #ffffff;
}
```

### Changing Fonts

Update the Google Fonts link in all HTML files:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
```

Then update the CSS:
```css
h1, h2, h3, h4, h5, h6 {
    font-family: 'YourHeadingFont', sans-serif;
}

body {
    font-family: 'YourBodyFont', sans-serif;
}
```

### Adding New Pages

1. Create new HTML file
2. Copy header and footer from existing pages
3. Update navigation links
4. Add specific content
5. Link necessary CSS and JS files

## 🐛 Troubleshooting

### Firebase Not Connecting
- Check Firebase configuration in `firebase-config.js`
- Ensure Firebase project is active
- Check browser console for errors
- Verify authorized domains in Firebase

### Images/Videos Not Uploading
- Verify Cloudinary configuration
- Check file size limits
- Ensure upload preset is unsigned
- Check network connection

### Admin Can't Login
- Verify user exists in Firebase Authentication
- Check if authentication methods are enabled
- Clear browser cache and cookies
- Try incognito/private browsing mode

### Content Not Displaying
- Check Firestore security rules
- Verify collection names match code
- Check browser console for errors
- Ensure data exists in Firestore

## 📞 Support

For issues or questions:
- Check the troubleshooting section above
- Review Firebase and Cloudinary documentation
- Check browser console for error messages
- Verify all configuration settings

## 📄 License

Copyright © 2024 Impact Decor Limited. All rights reserved.

## 🙏 Acknowledgments

- Google Fonts for Poppins and Inter typefaces
- AOS library for scroll animations
- Firebase for backend services
- Cloudinary for media storage
- All open-source contributors

---

**Built with ❤️ for Impact Decor Limited**