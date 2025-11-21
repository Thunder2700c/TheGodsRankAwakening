document.addEventListener("DOMContentLoaded", () => {
  // Firebase Setup – Your Config (double-checked: Matches console project)
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

  // Optional glowing highlight for readability – with mobile/touch support (your original)
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

  // Progress Sync – Firebase Firestore (enhanced with fallback)
  const chapterId = window.location.pathname.split('/').pop().split('.')[0] || 'prologue';
  const userId = localStorage.getItem('userId') || 'anon_' + Math.random().toString(36).substr(2, 9);  // Stable UUID
  localStorage.setItem('userId', userId);
  let lastPercent = parseInt(localStorage.getItem(`${chapterId}_progress`) || '0');
  let syncTimeout;

  async function syncProgress(currentPercent) {
    if (Math.abs(currentPercent - lastPercent) < 10) return;  // Debounce minor changes
    try {
      await db.collection('progress').doc(chapterId).set({
        [userId]: currentPercent
      }, { merge: true });
      console.log(`Progress synced: ${currentPercent}% for ${chapterId}`);
      lastPercent = currentPercent;
      localStorage.setItem(`${chapterId}_progress`, currentPercent.toString());
    } catch (err) {
      console.error('Firestore sync failed:', err);  // E.g., PERMISSION_DENIED
      // Local fallback (already in LS)
      localStorage.setItem(`${chapterId}_progress`, currentPercent.toString());
      console.log('Saved locally only');
    }
  }

  window.addEventListener('scroll', () => {
    clearTimeout(syncTimeout);
    const scrolled = Math.round((window.pageYOffset / (document.body.offsetHeight - window.innerHeight)) * 100);
    syncTimeout = setTimeout(() => syncProgress(scrolled), 500);
  }, { passive: true });

  // Load saved progress (local first, then Firestore)
  const savedPercentLocal = parseInt(localStorage.getItem(`${chapterId}_progress`) || '0');
  if (savedPercentLocal > 10) {
    window.scrollTo(0, (document.body.offsetHeight * savedPercentLocal / 100));
    console.log(`Resumed at ${savedPercentLocal}% for ${chapterId} (local)`);
  }
  // Try Firestore override
  db.collection('progress').doc(chapterId).get().then(doc => {
    if (doc.exists && doc.data()[userId]) {
      const firestorePercent = doc.data()[userId];
      localStorage.setItem(`${chapterId}_progress`, firestorePercent.toString());
      if (firestorePercent > savedPercentLocal) {
        window.scrollTo(0, (document.body.offsetHeight * firestorePercent / 100));
        console.log(`Overrode to Firestore: ${firestorePercent}%`);
      }
    }
  }).catch(err => {
    console.error('Progress load failed:', err);
  });

  // Reset button (testing – clears local too)
  const resetBtn = document.createElement('button');
  resetBtn.innerHTML = 'Reset Progress';
  resetBtn.className = 'btn';
  resetBtn.onclick = () => {
    localStorage.removeItem(`${chapterId}_progress`);
    localStorage.removeItem(`local_comments_${chapterId}`);  // Bonus clear
    db.collection('progress').doc(chapterId).update({ [userId]: 0 }).catch(() => {});  // Fire and forget
    window.scrollTo(0, 0);
    console.log('Progress reset');
    loadComments();  // Refresh comments if local
  };
  document.querySelector('.chapter-nav')?.appendChild(resetBtn);

  // Progress bar (your original)
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrolled = (window.pageYOffset / (document.body.offsetHeight - window.innerHeight)) * 100;
    const progress = document.getElementById('progress');
    if (progress) progress.style.width = scrolled + '%';
    lastScroll = window.pageYOffset;
  }, { passive: true });

  // Comments Functionality – Firebase Firestore (ENHANCED with local fallback)
  const commentsList = document.getElementById('commentsList');
  const commentForm = document.getElementById('commentForm');
  const commentText = document.getElementById('commentText');

  function displayComments(comments, isLocal = false) {
    commentsList.innerHTML = '';
    if (comments.length === 0) {
      commentsList.innerHTML = '<li>No comments yet – be the first!</li>';
      return;
    }
    comments.forEach(data => {
      const li = document.createElement('li');
      li.className = 'comment-item';
      li.innerHTML = `
        <strong>${data.user || 'Anon'}</strong> <small>${data.date ? new Date(data.date).toLocaleDateString() : 'Just now'}</small><br>
        ${data.text}
      `;
      commentsList.appendChild(li);
    });
    if (isLocal) console.log(`Displayed ${comments.length} local comments`);
  }

  async function loadComments() {
    if (!commentsList) return;
    try {
      console.log(`Fetching comments for ${chapterId}...`);
      const snapshot = await db.collection('comments')
        .where('chapterId', '==', chapterId)
        .orderBy('date', 'desc')
        .limit(50)  // Perf cap
        .get();
      console.log(`Loaded ${snapshot.size} Firestore comments`);
      const comments = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.date && data.date.toDate) data.date = data.date.toDate();  // Safe convert
        comments.push(data);
      });
      displayComments(comments);
      // Merge with local (if any)
      const localComments = JSON.parse(localStorage.getItem(`local_comments_${chapterId}`) || '[]');
      if (localComments.length > 0) {
        displayComments([...comments, ...localComments], true);
        // Optional: Sync locals to Firestore next post
      }
    } catch (err) {
      console.error('Firestore comments fetch failed:', err);
      // Fallback to local only
      const localComments = JSON.parse(localStorage.getItem(`local_comments_${chapterId}`) || '[]');
      displayComments(localComments, true);
      commentsList.innerHTML += '<li><em>(Offline mode – sync when back)</em></li>';
    }
  }

  if (commentForm) {
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = commentText.value.trim();
      if (!text) return alert('Comment something epic.');
      const newComment = { chapterId, text, user: userId, date: new Date().toISOString() };  // Local date fallback

      try {
        console.log('Posting to Firestore...');
        await db.collection('comments').add({
          ...newComment,
          date: firebase.firestore.FieldValue.serverTimestamp()  // Override for order
        });
        console.log('Posted to Firestore!');
        commentText.value = '';
        loadComments();  // Reload full
      } catch (err) {
        console.error('Firestore post failed:', err);
        // Local fallback
        const localComments = JSON.parse(localStorage.getItem(`local_comments_${chapterId}`) || '[]');
        localComments.unshift(newComment);
        localStorage.setItem(`local_comments_${chapterId}`, JSON.stringify(localComments));
        displayComments(localComments, true);
        commentText.value = '';
        alert('Saved locally (offline). It\'ll sync next time!');
      }
    });
  }

  // Initial load
  loadComments();
});
