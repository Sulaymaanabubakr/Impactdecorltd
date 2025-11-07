# Impact Decor Ltd - Professional Painters & Decorators Website

A premium, fully functional website for Impact Decor Ltd, a professional painting, decorating, and property renovation company based in Brighton and Sussex, UK.

## 🎨 Branding

**Company Name:** Impact Decor Ltd  
**Slogan:** *Innovation. Integrity. Impact.*  
**Location:** Brighton and Sussex, United Kingdom  
**Experience:** 17+ years

### Design Palette
- **Primary Color:** Deep Royal Blue (#002B5B)
- **Accent Color:** Dulux "Sun Flare" (#FFD166) - warm golden-yellow
- **Base Colors:** Pure White (#FFFFFF), Warm Grey (#F4F5F7)
- **Font:** Montserrat (all text)

### Style
Minimalist, elegant, distinctly British. Smooth transitions, high-quality imagery, and balanced white space.

## 📁 Project Structure

```
Impactdecorltd/
├── index.html              # Homepage
├── about.html              # About Us page
├── services.html           # Services page with modals
├── gallery.html            # Gallery with images/videos tabs
├── testimonials.html       # Customer reviews
├── contact.html            # Contact form with map
├── quote.html              # Quote request form
├── admin/
│   ├── admin-login.html    # Admin authentication
│   └── admin-imdecltd.html # Admin dashboard
├── css/
│   ├── styles.css          # Main stylesheet
│   └── admin.css           # Admin-specific styles
├── js/
│   ├── firebase-config.js  # Firebase configuration
│   ├── utils.js            # Utility functions
│   ├── main.js             # Main JavaScript
│   ├── services.js         # Services page functionality
│   ├── gallery.js          # Gallery functionality
│   ├── contact.js          # Contact form handling
│   ├── quote.js            # Quote form handling
│   ├── admin-login.js      # Admin login functionality
│   └── admin-dashboard.js  # Admin dashboard functionality
├── assets/
│   └── favicon.svg         # Site favicon
└── README.md
```

## 🚀 Features

### Public Pages

#### Home Page
- Hero section with background image/video
- Company introduction
- Services overview grid (8 services)
- Recent projects preview (10 most recent)
- Customer testimonials
- Call-to-action sections
- Footer with full contact details

#### About Us
- Company story and history
- Core values: Innovation, Integrity, Impact
- Mission, Vision, and Values
- Expertise and qualifications (NVQ, City & Guilds)
- 17 years of experience highlighted

#### Services
- 8 comprehensive services:
  1. Interior & Exterior Painting
  2. Wallpapper, Mural & Wall Panel Installation
  3. Domestic Plumbing
  4. Tiling (Kitchens, Bathrooms, Floors)
  5. Coving & Moulding
  6. Surface Preparation & Plaster Repair
  7. Carpentry & Flatpacks Fitting
  8. Property Maintenance & Renovation
- Each service opens in a modal with detailed information

#### Gallery/Portfolio
- Tabbed interface (Images & Videos)
- Dynamic loading from Firebase
- Lightbox view with navigation
- Displays title, description, and upload date

#### Testimonials/Reviews
- Customer reviews with star ratings
- Real client names and locations
- Review platform badges (MyBuilder, Checkatrade, Google)

#### Contact Page
- Contact form (Name, Email, Phone, Message)
- Form submissions saved to Firebase
- Google Maps embedded
- WhatsApp floating button
- Click-to-call links
- Business hours displayed

#### Quote Request Page
- Comprehensive quote form
- Service dropdown selection
- Photo upload capability (up to 5 photos)
- Cloudinary integration for photo storage
- Visual preview before upload
- Success confirmation with redirect

### Admin Dashboard

#### Login (`admin/admin-login.html`)
- Email/password authentication
- Google Sign-In option
- Secure Firebase Auth integration
- Not publicly linked (direct URL access only)

#### Dashboard (`admin/admin-imdecltd.html`)
- Authentication guard (redirects if not logged in)
- Tabbed interface (Images & Videos)
- Upload functionality:
  - Title and description fields
  - File preview before upload
  - Progress indicators
  - Cloudinary integration
  - Automatic Firestore metadata storage
- Media management:
  - Grid display of all uploaded media
  - Delete functionality with confirmation modal
  - Sorted by upload date (newest first)
- Logout button
- Custom toast notifications

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom styles with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Vanilla JavaScript, no frameworks
- **AOS.js**: Scroll animations library

### Backend Services
- **Firebase Authentication**: Email/password and Google sign-in
- **Cloud Firestore**: NoSQL database for media metadata, contacts, and quotes
- **Cloudinary**: Cloud storage for images and videos

### APIs
- **Google Maps API**: Embedded map on contact page
- **Google Fonts API**: Montserrat font family

## 📦 Setup Instructions

### Prerequisites
- Modern web browser
- Firebase account (https://firebase.google.com/)
- Cloudinary account (https://cloudinary.com/)
- Text editor or IDE

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Follow the setup wizard

2. **Enable Authentication**
   - Navigate to Authentication > Sign-in method
   - Enable "Email/Password"
   - Enable "Google" provider
   - Add your domain to authorized domains

3. **Create Firestore Database**
   - Navigate to Firestore Database
   - Click "Create database"
   - Start in production mode
   - Choose a location

4. **Set up Collections**
   - Collections will be created automatically:
     - `media` - for images and videos
     - `contacts` - for contact form submissions
     - `quotes` - for quote requests

5. **Configure Firestore Security Rules**
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
       match /quotes/{document} {
         allow create: if true;
         allow read, update, delete: if request.auth != null;
       }
     }
   }
   ```

6. **Get Firebase Configuration**
   - Go to Project Settings > General
   - Scroll to "Your apps"
   - Click web app icon (</>)
   - Copy the configuration object
   - Update `js/firebase-config.js`:
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

7. **Create Admin User**
   - Go to Authentication > Users
   - Click "Add user"
   - Enter email and password
   - This user can access the admin dashboard

### Cloudinary Setup

1. **Create Cloudinary Account**
   - Sign up at [Cloudinary](https://cloudinary.com/)
   - Note your Cloud Name from dashboard

2. **Create Upload Preset**
   - Navigate to Settings > Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Set signing mode to "Unsigned"
   - Configure folder structure (optional)
   - Save and note the preset name

3. **Update Configuration**
   - Open `js/firebase-config.js`
   - Update Cloudinary settings:
   ```javascript
   const CLOUDINARY_CLOUD_NAME = 'your_cloud_name';
   const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset';
   ```

### Local Development

1. **Clone/Download Project**
   ```bash
   git clone https://github.com/Sulaymaanabubakr/Impactdecorltd.git
   cd Impactdecorltd
   ```

2. **Run Local Server**
   
   The site requires a local server due to Firebase integration.
   
   **Option 1: Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Option 2: Node.js**
   ```bash
   npm install -g http-server
   http-server
   ```
   
   **Option 3: VS Code Live Server**
   - Install "Live Server" extension
   - Right-click `index.html`
   - Select "Open with Live Server"

3. **Access the Website**
   - Open browser to `http://localhost:8000`
   - Admin panel: `http://localhost:8000/admin/admin-login.html`

### Contact Information

Update placeholder contact details throughout the site:
- Search for: `+44 1273 123 456`
- Search for: `info@impactdecor.co.uk`
- Replace with actual contact information

## 🌐 Deployment Options

### Option 1: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

### Option 2: Netlify

1. Create account at [Netlify](https://www.netlify.com/)
2. Connect GitHub repository or drag & drop folder
3. Configure and deploy

### Option 3: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Option 4: GitHub Pages

1. Push code to GitHub repository
2. Go to Settings > Pages
3. Select branch and root folder
4. Save and wait for deployment

## 🔐 Security Features

- Admin pages not publicly linked
- Firebase Authentication guards
- Firestore security rules
- Input validation and sanitization
- HTTPS required for Firebase
- Environment-based configuration recommended for production

## ♿ Accessibility Features

- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Sufficient color contrast (WCAG compliant)
- Alt text for images
- Responsive font sizes

## 📊 SEO Features

- Meta descriptions on all pages
- Open Graph tags for social sharing
- Semantic HTML structure
- Descriptive alt text
- Clean URL structure
- Mobile-responsive (Google mobile-first indexing)
- Fast loading times

## 🎯 Performance Optimizations

- Lazy loading for images
- Optimized CSS and JavaScript
- Cloudinary auto-optimization
- Minimal external dependencies
- Efficient Firebase queries
- CSS animations with GPU acceleration

## 🔧 Customization

### Changing Colors

Edit `css/styles.css`:
```css
:root {
    --deep-royal-blue: #002B5B;
    --sun-flare: #FFD166;
    --pure-white: #FFFFFF;
    --warm-grey: #F4F5F7;
}
```

### Changing Fonts

Update Google Fonts link in HTML files and CSS:
```css
body {
    font-family: 'YourFont', sans-serif;
}
```

### Adding Services

Edit `services.html`:
1. Add service card in grid
2. Create corresponding modal
3. Update modal JavaScript functions

## 🐛 Troubleshooting

### Firebase Not Connecting
- Verify Firebase configuration in `firebase-config.js`
- Check Firebase project is active
- Review browser console for errors
- Confirm authorized domains in Firebase

### Images/Videos Not Uploading
- Check Cloudinary configuration
- Verify upload preset is unsigned
- Confirm file size limits
- Check network connection

### Admin Can't Login
- Verify user exists in Firebase Authentication
- Check authentication methods are enabled
- Clear browser cache
- Try incognito mode

### Content Not Displaying
- Review Firestore security rules
- Verify collection names match code
- Check browser console for errors
- Ensure data exists in Firestore

## 📞 Support

For technical issues:
- Check browser console for errors
- Review Firebase and Cloudinary logs
- Verify all configuration settings
- Test in different browsers

## 📄 License

Copyright © 2024 Impact Decor Ltd. All rights reserved.

## 🙏 Acknowledgments

- Google Fonts for Montserrat typeface
- AOS library for scroll animations
- Firebase for backend services
- Cloudinary for media storage
- Dulux for color inspiration

---

**Built with ❤️ for Impact Decor Ltd**  
*Innovation. Integrity. Impact.*
