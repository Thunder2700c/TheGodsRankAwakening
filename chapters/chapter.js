document.addEventListener("DOMContentLoaded", () => {
  // Firebase Setup – Your Config
  const firebaseConfig = {
    apiKey: "AIzaSyBBXkjCGj9xb-4mHFQW0UzubwrGRW2nULE",
    authDomain: "gods-rank-awakening.firebaseapp.com",
    projectId: "gods-rank-awakening",
    storageBucket: "gods-rank-awakening.firebasestorage.app",
    messagingSenderId: "465243225805",
    appId: "1:465243225805:web:7a9a749c2817c51185b384"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const auth = firebase.auth();

  // Optional glowing highlight for readability – with mobile/touch support
  const paragraphs = document.querySelectorAll('.chapter-text, .chapter-content p');
  paragraphs.forEach((p, index) => {
    const addGlow = () => p.style.textShadow = '0 0 10px currentColor';
    const removeGlow = () => p.style.textShadow = 'none';
    p.addEventListener('mouseenter', addGlow);
    p.addEventListener('mouseleave', removeGlow);

    let touchTimer;
    p.addEventListener('touchstart', (e) => {
      touchTimer = setTimeout(addGlow, 500);
    });
    p.addEventListener('touchend', () => {
      clearTimeout(touchTimer);
      removeGlow();
    });

    window.addEventListener('scroll', () => {
      const rect = p.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        p.style.opacity = '1';
      }
    }, { once: true, passive: true });
  });

  // Progress Sync – Firebase Firestore
  const chapterId = window.location.pathname.split('/').pop().split('.')[0] || 'prologue';
  const userId = localStorage.getItem('userId') || 'guest';
  let lastPercent = parseInt(localStorage.getItem(`${chapterId}_progress`) || '0');
  let syncTimeout;
  async function syncProgress(currentPercent) {
    if (Math.abs(currentPercent - lastPercent) < 10) return;
    try {
      await db.collection('progress').doc(chapterId).set({ [userId]: currentPercent }, { merge: true });
      console.log(`Progress synced: ${currentPercent}% for ${chapterId}`);
      lastPercent = currentPercent;
      localStorage.setItem(`${chapterId}_progress`, currentPercent);
    } catch (err) { 
      console.log('Offline – local save');
      localStorage.setItem(`${chapterId}_progress`, currentPercent);
    }
  }

  window.addEventListener('scroll', () => {
    clearTimeout(syncTimeout);
    const scrolled = Math.round((window.pageYOffset / (document.body.offsetHeight - window.innerHeight)) * 100);
    syncTimeout = setTimeout(() => syncProgress(scrolled), 500);
  }, { passive: true });

  const savedPercent = parseInt(localStorage.getItem(`${chapterId}_progress`) || '0');
  if (savedPercent > 10) {
    window.scrollTo(0, (document.body.offsetHeight * savedPercent / 100));
    console.log(`Resumed at ${savedPercent}% for ${chapterId}`);
  }

  // Reset button (testing)
  const resetBtn = document.createElement('button');
  resetBtn.innerHTML = 'Reset Progress';
  resetBtn.className = 'btn';
  resetBtn.onclick = () => {
    localStorage.removeItem(`${chapterId}_progress`);
    window.scrollTo(0, 0);
    console.log('Progress reset');
  };
  document.querySelector('.chapter-nav')?.appendChild(resetBtn);

  // Progress bar
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrolled = (window.pageYOffset / (document.body.offsetHeight - window.innerHeight)) * 100;
    const progress = document.getElementById('progress');
    if (progress) progress.style.width = scrolled + '%';
    lastScroll = window.pageYOffset;
  }, { passive: true });

  // Comments Functionality – Firebase Firestore (ENHANCED REFRESH)
  const commentsList = document.getElementById('commentsList');
  const commentForm = document.getElementById('commentForm');
  const commentText = document.getElementById('commentText');

  async function loadComments() {
    if (!commentsList) return;
    try {
      console.log(`Fetching comments for ${chapterId}...`);
      const snapshot = await db.collection('comments').where('chapterId', '==', chapterId).orderBy('date', 'desc').get();
      console.log(`Loaded ${snapshot.size} comments`);
      commentsList.innerHTML = '';
      if (snapshot.empty) {
        commentsList.innerHTML = '<li class="comment-item"><p>No comments yet – be the first!</p></li>';
      }
      snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement('li');
        li.className = 'comment-item';
        li.innerHTML = `<strong>${data.user} (${data.date ? data.date.toDate().toLocaleDateString() : 'Just now'})</strong><p>${data.text}</p>`;
        commentsList.appendChild(li);
      });
    } catch (err) {
      console.error('Comments fetch failed:', err);
      commentsList.innerHTML = '<li class="comment-item"><p>Comments loading... (check console)</p></li>';
    }
  }

  if (commentForm) {
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = commentText.value.trim();
      if (!text) return;
      try {
        console.log('Posting comment...');
        await db.collection('comments').add({
          chapterId,
          text,
          user: userId,
          date: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('Posted!');
        commentText.value = '';
        loadComments(); // Force refresh
      } catch (err) {
        console.error('Post failed:', err);
        alert('Post failed – try again! (Check console for details)');
      }
    });
  }

  // Load on start
  loadComments();
});
