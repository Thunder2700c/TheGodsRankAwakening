document.addEventListener('DOMContentLoaded', () => {

  // --- 1. THEME LOGIC (Handles Theme Toggle and Progress Bar) ---
  const themeToggle = document.getElementById('themeToggle');
  const progressBar = document.getElementById('progress');

  // Theme Logic
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    document.body.classList.add(savedTheme);

    const updateButton = (theme) => {
      if (theme === 'dark-mode') {
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
      } else {
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i> Dark Mode';
      }
    };
    updateButton(savedTheme);
    
    themeToggle.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-mode');
      const newTheme = isLight ? 'dark-mode' : 'light-mode';
      document.body.classList.remove('light-mode', 'dark-mode');
      document.body.classList.add(newTheme);
      localStorage.setItem('theme', newTheme);
      updateButton(newTheme);
    });
  }

  // Progress Bar Logic
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        progressBar.style.width = ((scrollTop / scrollHeight) * 100) + '%';
      }
    });

    // Navigation Key Bindings (Arrow Left/Right)
    document.addEventListener('keydown', (e) => {
      if (e.key === "ArrowRight") document.querySelector('.nav-btn.next')?.click();
      // Added :not(.home-link) to ensure we skip the "Home" button
      if (e.key === "ArrowLeft") document.querySelector('.nav-btn.prev:not(.home-link)')?.click(); 
    });
  }

  // --- 2. COMMENTS LOGIC (Firebase Fix) ---
  if (typeof firebase !== 'undefined') {
    const firebaseConfig = {
      apiKey: "AIzaSyBBXkjCGj9xb-4mHFQW0UzubwrGRW2nULE",
      authDomain: "gods-rank-awakening.firebaseapp.com",
      projectId: "gods-rank-awakening",
      storageBucket: "gods-rank-awakening.firebasestorage.app",
      messagingSenderId: "465243225805",
      appId: "1:465243225805:web:7a9a749c2817c51185b384"
    };

    try {
      if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
      const db = firebase.firestore();

      // Get Chapter ID (e.g., "3-the-day-hell-opened")
      const path = window.location.pathname;
      const chapterId = path.split('/').pop().replace('.html', '') || 'general';

      const commentForm = document.getElementById('commentForm');
      const commentText = document.getElementById('commentText'); 
      const commentsList = document.getElementById('commentsList');

      if (commentForm && commentsList) {
        // REAL-TIME LISTENER
        db.collection('comments')
          .where('chapterId', '==', chapterId)
          .orderBy('date', 'desc') // Ensure date is used for ordering
          .limit(20)
          .onSnapshot((snapshot) => {
            commentsList.innerHTML = '';
            if (snapshot.empty) {
              commentsList.innerHTML = '<li style="opacity:0.6; padding:1rem;">No comments yet. Be the first!</li>';
              return;
            }
            snapshot.forEach(doc => {
              const data = doc.data();
              const dateString = data.date ? new Date(data.date.toDate()).toLocaleDateString() : 'Just now';
              const li = document.createElement('li');
              li.style.cssText = "background:var(--glass-bg); padding:1rem; margin-bottom:0.8rem; border-radius:8px; border-left: 3px solid var(--accent-color); list-style:none;";
              li.innerHTML = `
                <div style="font-size:0.8rem; opacity:0.7; margin-bottom:0.3rem;">
                  <i class="fa-solid fa-user"></i> Reader • ${dateString}
                </div>
                <div>${data.text}</div>
              `;
              commentsList.appendChild(li);
            });
          }, (error) => {
            console.error("Firebase Read Error: You must update Firestore Security Rules.", error);
            commentsList.innerHTML = '<li style="color:red; padding:1rem;">Error loading comments. Please check your Firebase Rules.</li>';
          });

        // POST COMMENT
        commentForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const text = commentText.value.trim();
          if (text) {
            const btn = commentForm.querySelector('button');
            const oldText = btn.innerText;
            btn.disabled = true;
            btn.innerText = "Posting...";

            db.collection('comments').add({
              chapterId: chapterId,
              text: text,
              date: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
              commentText.value = '';
              btn.disabled = false;
              btn.innerText = oldText;
            }).catch((err) => {
              console.error("Firebase Write Error:", err);
              alert("Failed to post comment. Check console for error details.");
              btn.disabled = false;
              btn.innerText = oldText;
            });
          }
        });
      }
    } catch (e) {
      console.error("Firebase Initialization Failed (Is the CDN script included?):", e);
    }
  }

  // --- 3. HOME PAGE LOGIC (If this file is used on index.html) ---
  const chaptersGrid = document.getElementById('chaptersGrid');
  if (chaptersGrid) {
    // You will need to copy the chapter data and search logic from your main.js into this section if you use this app.js on your index.html
    console.warn("Home page logic not included. If using app.js on index.html, ensure chapter data and search logic are added here.");
  }
});
