document.addEventListener('DOMContentLoaded', () => {

  // --- 1. THEME LOGIC ---
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'light';
  htmlEl.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // --- 2. HOME PAGE LOGIC ---
  const chaptersGrid = document.getElementById('chaptersGrid');
  if (chaptersGrid) {
    const chapters = [
      { title: "Prologue: Defiant Stand", url: "chapters/1-prologue.html", date: "Oct 21", teaser: "Aditya's roar against Kanasura..." },
      { title: "Epilogue 1: Revelations", url: "chapters/2-epilogue-1.html", date: "Oct 22", teaser: "Quiet moments shatter..." },
      { title: "The Day Hell Opened", url: "chapters/3-the-day-hell-opened.html", date: "Oct 23", teaser: "Portals ignite..." },
      { title: "Awakening Ancients", url: "chapters/4-awakening-the-ancients.html", date: "Oct 24", teaser: "God-ranks stir..." },
      { title: "Coming Soon...", url: "chapters/5-coming-soon.html", date: "Soon", teaser: "Stay tuned!" }
    ];

    const renderChapters = (filter = "") => {
      chaptersGrid.innerHTML = '';
      chapters.forEach(chap => {
        if (chap.title.toLowerCase().includes(filter.toLowerCase())) {
          const card = document.createElement('a');
          card.href = chap.url;
          card.className = 'chapter-card';
          card.innerHTML = `<h3>${chap.title}</h3><p style="font-size:0.9rem; opacity:0.8; margin:0.5rem 0;">${chap.teaser}</p><small>${chap.date}</small>`;
          chaptersGrid.appendChild(card);
        }
      });
    };
    renderChapters();
    
    const searchBox = document.getElementById('searchChapters');
    if (searchBox) searchBox.addEventListener('input', (e) => renderChapters(e.target.value));
  }

  // --- 3. CHAPTER LOGIC (Progress & Keys) ---
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      progressBar.style.width = ((scrollTop / docHeight) * 100) + '%';
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === "ArrowRight") document.querySelector('.next')?.click();
      if (e.key === "ArrowLeft") document.querySelector('.prev')?.click();
    });
  }

  // --- 4. COMMENTS LOGIC (Firebase) ---
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

      // Get Chapter ID
      const path = window.location.pathname;
      const chapterId = path.split('/').pop().replace('.html', '') || 'general';

      const commentForm = document.getElementById('commentForm');
      const commentsList = document.getElementById('commentsList');

      if (commentForm && commentsList) {
        // Listener
        db.collection('comments')
          .where('chapterId', '==', chapterId)
          .orderBy('timestamp', 'desc')
          .limit(20)
          .onSnapshot((snapshot) => {
            commentsList.innerHTML = '';
            if (snapshot.empty) {
              commentsList.innerHTML = '<li style="opacity:0.5; padding:1rem;">No comments yet. Be the first!</li>';
              return;
            }
            snapshot.forEach(doc => {
              const data = doc.data();
              const li = document.createElement('li');
              li.className = 'comment-item';
              li.style.cssText = "background:var(--glass-bg); padding:1rem; margin-bottom:0.8rem; border-radius:8px; border-left: 3px solid var(--accent-color); list-style:none;";
              li.innerHTML = `
                <div style="font-size:0.8rem; opacity:0.7; margin-bottom:0.3rem;">
                  <i class="fa-solid fa-user"></i> User • ${data.timestamp ? new Date(data.timestamp.toDate()).toLocaleDateString() : 'Just now'}
                </div>
                <div>${data.text}</div>
              `;
              commentsList.appendChild(li);
            });
          }, (error) => {
            console.error("Firebase Read Error:", error);
            commentsList.innerHTML = '<li style="color:red;">Error loading comments. Check console.</li>';
          });

        // Post
        commentForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const input = document.getElementById('commentInput');
          const text = input.value.trim();
          if (text) {
            const btn = commentForm.querySelector('button');
            const oldText = btn.innerText;
            btn.disabled = true;
            btn.innerText = "Posting...";

            db.collection('comments').add({
              chapterId: chapterId,
              text: text,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
              input.value = '';
              btn.disabled = false;
              btn.innerText = oldText;
            }).catch((err) => {
              console.error("Firebase Write Error:", err);
              alert("Failed to post: " + err.message);
              btn.disabled = false;
              btn.innerText = oldText;
            });
          }
        });
      }
    } catch (e) {
      console.error("Firebase Init Failed:", e);
    }
  }
});
