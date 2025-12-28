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

// Make available globally
window.auth = auth;
window.db = db;
window.firebase = firebase;

console.log("🔥 Firebase initialized successfully!");

// ===================================================
// AUTH STATE LISTENER (Global)
// ===================================================

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("✅ User logged in:", user.displayName || user.email);
    document.body.classList.add('user-logged-in');
    document.body.classList.remove('user-logged-out');
    
    // Update UI elements
    updateGlobalAuthUI(user);
  } else {
    console.log("👤 User not logged in");
    document.body.classList.add('user-logged-out');
    document.body.classList.remove('user-logged-in');
    
    updateGlobalAuthUI(null);
  }
});

// ===================================================
// UPDATE UI BASED ON AUTH STATE
// ===================================================

function updateGlobalAuthUI(user) {
  // Elements that show when logged in
  const authRequired = document.querySelectorAll('.auth-required');
  // Elements that show when logged out
  const guestOnly = document.querySelectorAll('.guest-only');
  // User name displays
  const userNames = document.querySelectorAll('.user-name');
  // User avatars
  const userAvatars = document.querySelectorAll('.user-avatar');
  
  if (user) {
    // Show auth-required elements
    authRequired.forEach(el => {
      el.style.display = '';
      el.classList.add('visible');
    });
    
    // Hide guest-only elements
    guestOnly.forEach(el => {
      el.style.display = 'none';
      el.classList.remove('visible');
    });
    
    // Update user displays
    userNames.forEach(el => {
      el.textContent = user.displayName || user.email.split('@')[0];
    });
    
    userAvatars.forEach(el => {
      el.src = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
      el.alt = user.displayName || 'User';
    });
    
  } else {
    // Hide auth-required elements
    authRequired.forEach(el => {
      el.style.display = 'none';
      el.classList.remove('visible');
    });
    
    // Show guest-only elements
    guestOnly.forEach(el => {
      el.style.display = '';
      el.classList.add('visible');
    });
  }
}

// Make function globally available
window.updateGlobalAuthUI = updateGlobalAuthUI;
