// Dark mode toggle for chapter pages
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // Update button text
    themeToggle.textContent = document.body.classList.contains('dark-mode')
      ? '☀️ Light Mode'
      : '🌙 Dark Mode';

    // Optional: subtle page flash for modern effect
    document.body.style.transition = 'background-color 0.3s, color 0.3s';
  });
}

// Optional: add glow effect to all pre elements on hover dynamically
const preBlocks = document.querySelectorAll('pre');
preBlocks.forEach(pre => {
  pre.addEventListener('mouseenter', () => pre.style.boxShadow = '0 0 40px #0ff inset, 0 0 30px #08f');
  pre.addEventListener('mouseleave', () => pre.style.boxShadow = '0 0 20px #0ff inset');
});
