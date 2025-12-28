// ===================================================
// AUTHENTICATION SYSTEM - TGRA
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  
  // Check Firebase
  if (typeof firebase === 'undefined' || !window.auth || !window.db) {
    console.error('Firebase not ready!');
    showMessage('error', '❌ Firebase not loaded. Please refresh the page.');
    return;
  }
  
  const auth = window.auth;
  const db = window.db;

  // ===================================================
  // FORM TOGGLE
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

  // ===================================================
  // SIGNUP
  // ===================================================
  
  const signupForm = document.getElementById('signupForm');
  
  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    // Validation
    if (username.length < 3) {
      showMessage('error', '❌ Username must be at least 3 characters');
      return;
    }
    
    if (password.length < 6) {
      showMessage('error', '❌ Password must be at least 6 characters');
      return;
    }
    
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    setLoading(submitBtn, true);
    
    try {
      // Create user
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Update profile
      await user.updateProfile({
        displayName: username,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      });
      
      // Create Firestore document
      await db.collection('users').doc(user.uid).set({
        username: username,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      });
      
      showMessage('success', '🎉 Account created! Redirecting...');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
      
    } catch (error) {
      console.error('Signup error:', error);
      showMessage('error', getErrorMessage(error.code));
    } finally {
      setLoading(submitBtn, false);
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
    
    if (!email || !password) {
      showMessage('error', '❌ Please enter email and password');
      return;
    }
    
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    setLoading(submitBtn, true);
    
    try {
      await auth.signInWithEmailAndPassword(email, password);
      
      showMessage('success', '✅ Welcome back! Redirecting...');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
      
    } catch (error) {
      console.error('Login error:', error);
      showMessage('error', getErrorMessage(error.code));
    } finally {
      setLoading(submitBtn, false);
    }
  });

  // ===================================================
  // GOOGLE SIGN IN
  // ===================================================
  
  const googleBtns = document.querySelectorAll('[id^="googleSignIn"]');
  
  googleBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      setLoading(btn, true);
      
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        
        // Check if new user
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
          await db.collection('users').doc(user.uid).set({
            username: user.displayName || 'Reader',
            email: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`
          });
        }
        
        showMessage('success', '✅ Signed in! Redirecting...');
        
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
        
      } catch (error) {
        console.error('Google error:', error);
        if (error.code !== 'auth/popup-closed-by-user') {
          showMessage('error', getErrorMessage(error.code));
        }
      } finally {
        setLoading(btn, false);
      }
    });
  });

  // ===================================================
  // FORGOT PASSWORD
  // ===================================================
  
  const forgotPasswordLink = document.getElementById('forgotPassword');
  
  forgotPasswordLink?.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    
    if (!email) {
      showMessage('info', '📧 Enter your email first, then click forgot password');
      return;
    }
    
    try {
      await auth.sendPasswordResetEmail(email);
      showMessage('success', '📧 Password reset email sent!');
    } catch (error) {
      showMessage('error', getErrorMessage(error.code));
    }
  });

  // ===================================================
  // REDIRECT IF ALREADY LOGGED IN
  // ===================================================
  
  auth.onAuthStateChanged((user) => {
    if (user && window.location.pathname.includes('login')) {
      window.location.href = 'index.html';
    }
  });

  // ===================================================
  // HELPER FUNCTIONS
  // ===================================================
  
  function setLoading(button, isLoading) {
    if (!button) return;
    button.disabled = isLoading;
    button.classList.toggle('loading', isLoading);
  }
  
  function showMessage(type, message) {
    // Remove old messages
    document.querySelectorAll('.auth-message').forEach(el => el.remove());
    
    // Create new message
    const msgEl = document.createElement('div');
    msgEl.className = `auth-message ${type}`;
    msgEl.textContent = message;
    
    // Add to active form
    const activeForm = document.querySelector('.auth-form.active');
    if (activeForm) {
      activeForm.appendChild(msgEl);
      
      // Auto remove
      if (type !== 'error') {
        setTimeout(() => msgEl.remove(), 5000);
      }
    }
  }
  
  function getErrorMessage(code) {
    const messages = {
      'auth/email-already-in-use': '📧 Email already registered. Try logging in!',
      'auth/invalid-email': '❌ Invalid email address',
      'auth/weak-password': '🔐 Password must be at least 6 characters',
      'auth/user-not-found': '❌ No account with this email',
      'auth/wrong-password': '❌ Wrong password',
      'auth/invalid-credential': '❌ Wrong email or password',
      'auth/invalid-login-credentials': '❌ Wrong email or password',
      'auth/too-many-requests': '⏳ Too many attempts. Wait a moment.',
      'auth/popup-closed-by-user': 'Popup closed',
      'auth/popup-blocked': '🚫 Popup blocked! Allow popups.',
      'auth/network-request-failed': '🌐 Network error. Check connection.',
    };
    return messages[code] || `Error: ${code}`;
  }

});
