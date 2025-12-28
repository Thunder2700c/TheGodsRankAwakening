// ===================================================
// FIREBASE CONFIGURATION
// ===================================================

// Import Firebase (using CDN version for simplicity)
// These are loaded from index.html

// Your Firebase configuration (replace with your values!)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "tgra-backend.firebaseapp.com",
  projectId: "tgra-backend",
  storageBucket: "tgra-backend.appspot.com",
  messagingSenderId: "123456789",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Export for other files
window.auth = auth;
window.db = db;

console.log("🔥 Firebase initialized!");
