// ===================================================
// FIREBASE CONFIGURATION - TGRA
// ===================================================

const firebaseConfig = {
  apiKey: "AIzaSyAvFxqMFGUfFpD72rkGVUCIO4saUrW7a9E",
  authDomain: "tgra-backend.firebaseapp.com",
  projectId: "tgra-backend",
  storageBucket: "tgra-backend.firebasestorage.app",
  messagingSenderId: "685326018298",
  appId: "1:685326018298:web:f8e97ff8e68da625fb8b43",
  measurementId: "G-BLLZTVYHSL"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Make globally available
window.auth = auth;
window.db = db;
window.firebase = firebase;

console.log("🔥 Firebase ready!");

// ===================================================
// AUTH STATE LISTENER
// ===================================================

auth.onAuthStateChanged((user) => {
  // Update body classes
  if (user) {
    document.body.classList.add('user-logged-in');
    document.body.classList.remove('user-logged-out');
    
    // Update UI elements
    document.querySelectorAll('.user-avatar').forEach(el => {
      el.src = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
    });
    
    document.querySelectorAll('.user-name').forEach(el => {
      el.textContent = user.displayName || user.email.split('@')[0];
    });
    
    document.querySelectorAll('.user-email').forEach(el => {
      el.textContent = user.email;
    });
    
    // Show/hide elements
    document.querySelectorAll('.auth-required').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.guest-only').forEach(el => el.classList.remove('visible'));
    
  } else {
    document.body.classList.add('user-logged-out');
    document.body.classList.remove('user-logged-in');
    
    // Show/hide elements
    document.querySelectorAll('.auth-required').forEach(el => el.classList.remove('visible'));
    document.querySelectorAll('.guest-only').forEach(el => el.classList.add('visible'));
  }
});
