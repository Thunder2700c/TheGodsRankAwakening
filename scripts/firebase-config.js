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
// AUTH STATE LISTENER
// ===================================================

auth.onAuthStateChanged((user) => {
  const loginNavBtn = document.getElementById('loginNavBtn');
  const userMenuContainer = document.getElementById('userMenuContainer');
  
  if (user) {
    // User logged in
    console.log("✅ User logged in:", user.displayName || user.email);
    document.body.classList.add('user-logged-in');
    document.body.classList.remove('user-logged-out');
    
    // Hide login, show user menu
    loginNavBtn?.classList.remove('visible');
    userMenuContainer?.classList.add('visible');
    
    // Update user info in menu
    const avatarUrl = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
    const userName = user.displayName || user.email.split('@')[0];
    
    document.querySelectorAll('.user-avatar').forEach(el => {
      el.src = avatarUrl;
    });
    
    document.querySelectorAll('.user-name').forEach(el => {
      el.textContent = userName;
    });
    
    document.querySelectorAll('.user-email').forEach(el => {
      el.textContent = user.email;
    });
    
  } else {
    // User not logged in
    console.log("👤 User not logged in");
    document.body.classList.add('user-logged-out');
    document.body.classList.remove('user-logged-in');
    
    // Show login, hide user menu
    loginNavBtn?.classList.add('visible');
    userMenuContainer?.classList.remove('visible');
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

// ===================================================
// USER MENU FUNCTIONALITY
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  
  const loginNavBtn = document.getElementById('loginNavBtn');
  const userMenuContainer = document.getElementById('userMenuContainer');
  const userMenuBtn = document.getElementById('userMenuBtn');
  const userDropdown = document.getElementById('userDropdown');
  const navLogoutBtn = document.getElementById('navLogoutBtn');
  
  // Show login button after page loads
  setTimeout(() => {
    if (loginNavBtn && !document.body.classList.contains('user-logged-in')) {
      loginNavBtn.classList.add('visible');
    }
  }, 1000);
  
  // Toggle dropdown
  userMenuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    userMenuContainer.classList.toggle('open');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!userMenuContainer?.contains(e.target)) {
      userMenuContainer?.classList.remove('open');
    }
  });
  
  // Logout
  navLogoutBtn?.addEventListener('click', async () => {
    try {
      await window.auth.signOut();
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  });
  
});
