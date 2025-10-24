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

  // Optional: Reading progress bar (add <div id="progress"></div> to chapter.html if wanted)
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrolled = (window.pageYOffset / (document.body.offsetHeight - window.innerHeight)) * 100;
    const progress = document.getElementById('progress');
    if (progress) progress.style.width = scrolled + '%';
    lastScroll = window.pageYOffset;
  }, { passive: true });
});
