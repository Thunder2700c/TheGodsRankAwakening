document.addEventListener('DOMContentLoaded', () => {

  // --- 1. THEME LOGIC (Handles Theme Toggle and Progress Bar) ---
  const themeToggle = document.getElementById('themeToggle');
  const progressBar = document.getElementById('progress');

  // Theme Logic
  if (themeToggle) {
    // Use the theme attribute on the body for styling
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    // Ensure body has one of the theme classes on load
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

  // Progress Bar Logic (applies to chapter pages)
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
      if (e.key === "ArrowLeft") document.querySelector('.nav-btn.prev:not(.home-link)')?.click(); 
    });
  }

  // --- 2. COMMENTS LOGIC (Firebase Fix) ---
  // Only runs if firebase CDN scripts are correctly included in the HTML (as above)
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

      // Get Chapter ID from URL (e.g., "3-the-day-hell-opened")
      const path = window.location.pathname;
      const chapterId = path.split('/').pop().replace('.html', '') || 'general';

      const commentForm = document.getElementById('commentForm');
      const commentText = document.getElementById('commentText'); 
      const commentsList = document.getElementById('commentsList');

      if (commentForm && commentsList) {
        // REAL-TIME LISTENER
        db.collection('comments')
          .where('chapterId', '==', chapterId)
          .orderBy('date', 'desc') 
          .limit(20)
          .onSnapshot((snapshot) => {
            commentsList.innerHTML = '';
            if (snapshot.empty) {
              commentsList.innerHTML = '<li style="opacity:0.6; padding:1rem;">No comments yet. Be the first!</li>';
              return;
            }
            snapshot.forEach(doc => {
              const data = doc.data();
              // Handle potential null date from serverTimestamp if rules are strict
              const dateObj = data.date && data.date.toDate ? data.date.toDate() : new Date();
              const dateString = dateObj.toLocaleDateString();
              
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
            console.error("Firebase Read Error. Security Rules are likely too strict.", error);
            commentsList.innerHTML = '<li style="color:red; padding:1rem;">Error loading comments. You MUST update your Firestore Security Rules to allow read access.</li>';
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
              user: 'Reader', // Default user
              date: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
              commentText.value = '';
              btn.disabled = false;
              btn.innerText = oldText;
            }).catch((err) => {
              console.error("Firebase Write Error:", err);
              alert("Failed to post comment. Check console for error details or verify your Firebase Security Rules allow writing.");
              btn.disabled = false;
              btn.innerText = oldText;
            });
          }
        });
      }
    } catch (e) {
      console.error("Firebase Initialization Failed:", e);
    }
  }

  // --- 3. HOME PAGE LOGIC (From main.js - kept for completeness) ---
  const chaptersGrid = document.getElementById('chaptersGrid');
  if (chaptersGrid) {
    const chapters = [
      { title: "Prologue: Defiant Stand", file: "1-prologue.html", teaser: "No way in hell... Aditya's roar against Kanasura's spear.", date: "Oct 21, 2120" },
      { title: "Epilogue I: Tea & Revelations", file: "2-epilogue-1.html", teaser: "Quiet moments shatter with Venta's cosmic truth.", date: "TBA" },
      { title: "The Day Hell Opened", file: "3-the-day-hell-opened.html", teaser: "Portals ignite—timeline fractures in hell's fury.", date: "TBA" },
      { title: "Awakening the Ancients", file: "4-awakening-the-ancients.html", teaser: "God-ranks stir from eons of slumber.", date: "TBA" },
      { title: "Coming Soon...", file: "5-coming-soon.html", teaser: "The rank wars escalate—teaser drops weekly!", date: "Soon™" }
    ];

    const renderChapters = (filter = "") => {
      chaptersGrid.innerHTML = '';
      const filteredChapters = chapters.filter(chap => chap.title.toLowerCase().includes(filter.toLowerCase()));

      filteredChapters.forEach(chap => {
        const card = document.createElement('a');
        card.href = `chapters/${chap.file}`;
        card.className = 'chapter-card';
        card.innerHTML = `<h3>${chap.title}</h3><p class="teaser">${chap.teaser}</p><small class="date">${chap.date}</small>`;
        chaptersGrid.appendChild(card);
      });
      // Add "More Chapters Incoming" card
      const moreLink = document.createElement('a');
      moreLink.href = '#';
      moreLink.className = 'chapter-card upcoming';
      moreLink.innerHTML = '<h3>More Chapters Incoming</h3><p>Subscribe for alerts!</p>';
      chaptersGrid.appendChild(moreLink);
    };

    renderChapters();
    
    const searchBox = document.getElementById('searchChapters');
    if (searchBox) searchBox.addEventListener('input', (e) => renderChapters(e.target.value));
  }
});
