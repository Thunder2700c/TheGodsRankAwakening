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
      await fetch('https://your-vercel-app.vercel.app/api/progress', { // Replace with Vercel URL
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

  // Comments Functionality
const chapterId = window.location.pathname.split('/').pop().split('.')[0] || 'prologue';
const userId = localStorage.getItem('userId') || 'guest';
const commentsList = document.getElementById('commentsList');
const commentForm = document.getElementById('commentForm');
const commentText = document.getElementById('commentText');

// Fetch comments
async function loadComments() {
  try {
    const res = await fetch(`https://your-vercel-app.vercel.app/api/comments/${chapterId}`); // Vercel URL
    const comments = await res.json();
    commentsList.innerHTML = '';
    comments.forEach(comment => {
      const li = document.createElement('li');
      li.className = 'comment-item';
      li.innerHTML = `<strong>${comment.user} (${new Date(comment.date).toLocaleDateString()})</strong><p>${comment.text}</p>`;
      commentsList.appendChild(li);
    });
  } catch (err) {
    console.log('Comments offline – empty for now');
  }
}

// Post comment
  if (commentForm) {
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = commentText.value.trim();
      if (!text) return;
      try {
        await fetch('https://your-vercel-app.vercel.app/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chapterId, text, user: userId })
        });
        commentText.value = '';
        loadComments(); // Refresh list
      } catch (err) {
        alert('Post failed – try again!');
      }
    });
  }
  
  // Load on start
  loadComments();

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
});
