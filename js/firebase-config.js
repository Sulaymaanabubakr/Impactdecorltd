// Firebase Configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKJx0pBoc3MDipvt1FVfkOpoFCKNA6ODI",
  authDomain: "impact-decor.firebaseapp.com",
  projectId: "impact-decor",
  storageBucket: "impact-decor.firebasestorage.app",
  messagingSenderId: "448250089095",
  appId: "1:448250089095:web:56dc26bbcc07dcf7e37222",
  measurementId: "G-S4BFCYSYE6"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// Initialize Firebase services
const auth = firebase.auth ? firebase.auth() : null;
const db = firebase.firestore ? firebase.firestore() : null;

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = 'dsfobvsyg';
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}`;
const CLOUDINARY_IMAGE_UPLOAD_PRESET = 'impact_images';
const CLOUDINARY_VIDEO_UPLOAD_PRESET = 'impact_videos';

const getCloudinaryUploadPreset = (resourceType = 'image') =>
    resourceType === 'video' ? CLOUDINARY_VIDEO_UPLOAD_PRESET : CLOUDINARY_IMAGE_UPLOAD_PRESET;