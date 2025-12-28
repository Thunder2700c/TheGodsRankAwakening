// ===================================================
// AUTHENTICATION SYSTEM
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  
  const auth = window.auth;
  const db = window.db;
  
  // ===================================================
  // AUTH STATE OBSERVER
  // ===================================================
  
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      console.log("✅ User logged in:", user.email);
      updateUIForLoggedInUser(user);
    } else {
      // User is signed out
      console.log("❌ User not logged in");
      updateUIForLoggedOutUser();
    }
  });
  
  // ===================================================
  // SIGN UP
  // ===================================================
  
  const signupForm = document.getElementById('signupForm');
  
  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;
    
    try {
      // Create user
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Update profile with username
      await user.updateProfile({
        displayName: username
      });
      
      // Save user data to Firestore
      await db.collection('users').doc(user.uid).set({
        username: username,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        bio: '',
        chaptersRead: [],
        totalReactions: 0,
        totalComments: 0
      });
      
      showMessage('success', '🎉 Account created! Welcome to TGRA!');
      
      // Redirect to home
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
      
    } catch (error) {
      console.error("Signup error:", error);
      showMessage('error', getErrorMessage(error.code));
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
  
  // ===================================================
  // LOGIN
  // ===================================================
  
  const loginForm = document.getElementById('loginForm');
  
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    try {
      await auth.signInWithEmailAndPassword(email, password);
      
      showMessage('success', '✅ Welcome back!');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
      
    } catch (error) {
      console.error("Login error:", error);
      showMessage('error', getErrorMessage(error.code));
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
  
  // ===================================================
  // GOOGLE SIGN IN
  // ===================================================
  
  const googleBtn = document.getElementById('googleSignIn');
  
  googleBtn?.addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;
      
      // Check if new user
      const userDoc = await db.collection('users').doc(user.uid).get();
      
      if (!userDoc.exists) {
        // Create user document for new Google users
        await db.collection('users').doc(user.uid).set({
          username: user.displayName || 'Reader',
          email: user.email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          bio: '',
          chaptersRead: [],
          totalReactions: 0,
          totalComments: 0
        });
      }
      
      showMessage('success', '✅ Signed in with Google!');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
      
    } catch (error) {
      console.error("Google sign in error:", error);
      showMessage('error', getErrorMessage(error.code));
    }
  });
  
  // ===================================================
  // LOGOUT
  // ===================================================
  
  const logoutBtn = document.getElementById('logoutBtn');
  
  logoutBtn?.addEventListener('click', async () => {
    try {
      await auth.signOut();
      showMessage('success', '👋 Logged out successfully!');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
      
    } catch (error) {
      console.error("Logout error:", error);
      showMessage('error', 'Failed to logout. Try again.');
    }
  });
  
  // ===================================================
  // PASSWORD RESET
  // ===================================================
  
  const forgotPasswordLink = document.getElementById('forgotPassword');
  
  forgotPasswordLink?.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    
    if (!email) {
      showMessage('error', 'Please enter your email first!');
      return;
    }
    
    try {
      await auth.sendPasswordResetEmail(email);
      showMessage('success', '📧 Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error("Reset error:", error);
      showMessage('error', getErrorMessage(error.code));
    }
  });
  
  // ===================================================
  // UI HELPERS
  // ===================================================
  
  function updateUIForLoggedInUser(user) {
    // Update header/nav with user info
    const authButtons = document.querySelectorAll('.auth-required');
    const guestButtons = document.querySelectorAll('.guest-only');
    const userDisplays = document.querySelectorAll('.user-display');
    
    authButtons.forEach(el => el.style.display = 'flex');
    guestButtons.forEach(el => el.style.display = 'none');
    userDisplays.forEach(el => {
      el.textContent = user.displayName || user.email;
    });
    
    // Update avatar
    const avatarEls = document.querySelectorAll('.user-avatar');
    avatarEls.forEach(el => {
      el.src = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
    });
  }
  
  function updateUIForLoggedOutUser() {
    const authButtons = document.querySelectorAll('.auth-required');
    const guestButtons = document.querySelectorAll('.guest-only');
    
    authButtons.forEach(el => el.style.display = 'none');
    guestButtons.forEach(el => el.style.display = 'flex');
  }
  
  function showMessage(type, message) {
    // Remove existing messages
    document.querySelectorAll('.auth-message').forEach(el => el.remove());
    
    const msgEl = document.createElement('div');
    msgEl.className = `auth-message ${type}`;
    msgEl.textContent = message;
    
    const form = document.querySelector('.auth-form.active') || document.querySelector('.auth-form');
    form?.appendChild(msgEl);
    
    // Auto remove after 5 seconds
    setTimeout(() => msgEl.remove(), 5000);
  }
  
  function getErrorMessage(code) {
    const messages = {
      'auth/email-already-in-use': 'Email already registered. Try logging in!',
      'auth/invalid-email': 'Invalid email address.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Try again.',
      'auth/too-many-requests': 'Too many attempts. Please wait a moment.',
      'auth/popup-closed-by-user': 'Sign in cancelled.',
    };
    return messages[code] || 'Something went wrong. Please try again.';
  }
  
  // ===================================================
  // FORM TOGGLE (Login ↔ Signup)
  // ===================================================
  
  const showSignup = document.getElementById('showSignup');
  const showLogin = document.getElementById('showLogin');
  const loginFormContainer = document.getElementById('loginFormContainer');
  const signupFormContainer = document.getElementById('signupFormContainer');
  
  showSignup?.addEventListener('click', (e) => {
    e.preventDefault();
    loginFormContainer?.classList.remove('active');
    signupFormContainer?.classList.add('active');
  });
  
  showLogin?.addEventListener('click', (e) => {
    e.preventDefault();
    signupFormContainer?.classList.remove('active');
    loginFormContainer?.classList.add('active');
  });

});
