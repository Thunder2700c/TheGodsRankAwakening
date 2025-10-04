document.addEventListener("DOMContentLoaded", () => {
  // Optional glowing highlight for readability
  const paragraphs = document.querySelectorAll('.chapter-text');
  paragraphs.forEach(p => {
    p.addEventListener('mouseenter', () => p.style.textShadow = '0 0 10px currentColor');
    p.addEventListener('mouseleave', () => p.style.textShadow = 'none');
  });
});
