document.addEventListener("DOMContentLoaded", () => {
  // Optional glowing highlight for readability – with mobile/touch support
  const paragraphs = document.querySelectorAll('.chapter-text, .chapter-content p'); // Fallback to all <p>
  paragraphs.forEach((p, index) => {
    // Desktop hover
    const addGlow = () => p.style.textShadow = '0 0 10px currentColor';
    const removeGlow = () => p.style.textShadow = 'none';
    p.addEventListener('mouseenter', addGlow);
    p.addEventListener('mouseleave', removeGlow);

    // Mobile touch (S23 FE): Long-press glow
    let touchTimer;
    p.addEventListener('touchstart', (e) => {
      touchTimer = setTimeout(addGlow, 500); // 0.5s hold
    });
    p.addEventListener('touchend', () => {
      clearTimeout(touchTimer);
      removeGlow();
    });

    // Bonus: Progressive highlight on scroll (unfurl like awakening)
    window.addEventListener('scroll', () => {
      const rect = p.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        p.style.opacity = '1'; // Fade-in if starting hidden
      }
    }, { once: true, passive: true }); // One-time, perf-friendly
  });

  // Backend Sync (progress/comments) – FIXED VERSION
  const chapterId = window.location.pathname.split('/').pop().split('.')[0] || 'prologue'; // Auto-detect chapter ID from URL
  const userId = localStorage.getItem('userId') || 'guest';
  let lastPercent = parseInt(localStorage.getItem(`${chapterId}_progress`) || '0'); // Track last saved %
  let syncTimeout;
  async function syncProgress(currentPercent) {
    if (Math.abs(currentPercent - lastPercent) < 10) return; // Only sync if >10% change – no spam
    try {
      await fetch('https://your-vercel-app.vercel.app/api/progress', { // REPLACE WITH YOUR VERCEL URL, e.g., https://gods-backend-abc123.vercel.app/api/progress
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId, userId, percent: currentPercent })
      });
      console.log(`Progress synced: ${currentPercent}% for ${chapterId}`);
      lastPercent = currentPercent;
      localStorage.setItem(`${chapterId}_progress`, currentPercent); // Local backup
    } catch (err) { 
      console.log('Offline – local save');
      localStorage.setItem(`${chapterId}_progress`, currentPercent);
    }
  }

  // Call on scroll end (throttled)
  window.addEventListener('scroll', () => {
    clearTimeout(syncTimeout);
    const scrolled = Math.round((window.pageYOffset / (document.body.offsetHeight - window.innerHeight)) * 100);
    syncTimeout = setTimeout(() => syncProgress(scrolled), 500); // Sync every 0.5s after stop
  }, { passive: true });

  // Load saved progress on start – FIXED: Default 0, ignore <10%
  const savedPercent = parseInt(localStorage.getItem(`${chapterId}_progress`) || '0');
  if (savedPercent > 10) { // Only jump if meaningful progress
    window.scrollTo(0, (document.body.offsetHeight * savedPercent / 100));
    console.log(`Resumed at ${savedPercent}% for ${chapterId}`);
  }

  // Optional: Reset button (for testing – add to nav if wanted)
  const resetBtn = document.createElement('button');
  resetBtn.innerHTML = 'Reset Progress';
  resetBtn.className = 'btn';
  resetBtn.onclick = () => {
    localStorage.removeItem(`${chapterId}_progress`);
    window.scrollTo(0, 0);
    console.log('Progress reset');
  };
  document.querySelector('.chapter-nav')?.appendChild(resetBtn); // Add to nav

  // Optional: Reading progress bar
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrolled = (window.pageYOffset / (document.body.offsetHeight - window.innerHeight)) * 100;
    const progress = document.getElementById('progress');
    if (progress) progress.style.width = scrolled + '%';
    lastScroll = window.pageYOffset;
  }, { passive: true });

  // Comments Functionality – FIXED WITH ERROR HANDLING & REFRESH
  const commentsList = document.getElementById('commentsList');
  const commentForm = document.getElementById('commentForm');
  const commentText = document.getElementById('commentText');

  // Fetch comments
  async function loadComments() {
    if (!commentsList) return; // No section = skip
    try {
      console.log(`Fetching comments for ${chapterId}...`);
      const res = await fetch(`https://your-vercel-app.vercel.app/api/comments/${chapterId}`); // REPLACE WITH YOUR VERCEL URL, e.g., https://gods-backend-abc123.vercel.app/api/comments/${chapterId}
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const comments = await res.json();
      console.log(`Loaded ${comments.length} comments`);
      commentsList.innerHTML = '';
      if (comments.length === 0) {
        commentsList.innerHTML = '<li class="comment-item"><p>No comments yet – be the first!</p></li>'; // Empty state
      }
      comments.forEach(comment => {
        const li = document.createElement('li');
        li.className = 'comment-item';
        li.innerHTML = `<strong>${comment.user} (${new Date(comment.date).toLocaleDateString()})</strong><p>${comment.text}</p>`;
        commentsList.appendChild(li);
      });
    } catch (err) {
      console.error('Comments fetch failed:', err);
      commentsList.innerHTML = '<li class="comment-item"><p>Comments loading... (check console)</p></li>'; // Fallback UI
    }
  }

  // Post comment – FIXED: Always refresh after
  if (commentForm) {
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = commentText.value.trim();
      if (!text) return;
      try {
        console.log('Posting comment...');
        const res = await fetch('https://your-vercel-app.vercel.app/api/comments', { // REPLACE WITH YOUR VERCEL URL
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chapterId, text, user: userId })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        console.log('Posted!');
        commentText.value = '';
        loadComments(); // Force refresh – shows new comment
      } catch (err) {
        console.error('Post failed:', err);
        alert('Post failed – try again! (Check console for details)');
      }
    });
  }

  // Load on start
  loadComments();
});
