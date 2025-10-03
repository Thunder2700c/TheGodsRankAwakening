document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  const icon = themeToggle.querySelector('i');
  const textSpan = themeToggle.querySelector('span'); // Use a span for text

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'light-mode';
  document.body.classList.add(savedTheme);
  updateThemeButton(savedTheme);

  // Toggle on click
  themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('light-mode')) {
      document.body.classList.replace('light-mode', 'dark-mode');
      localStorage.setItem('theme', 'dark-mode');
      updateThemeButton('dark-mode');
    } else {
      document.body.classList.replace('dark-mode', 'light-mode');
      localStorage.setItem('theme', 'light-mode');
      updateThemeButton('light-mode');
    }
  });

  function updateThemeButton(mode) {
    if (!icon || !textSpan) return;

    if (mode === 'dark-mode') {
      icon.className = 'fa-solid fa-sun';
      textSpan.textContent = ' Light Mode';
    } else {
      icon.className = 'fa-solid fa-moon';
      textSpan.textContent = ' Dark Mode';
    }
  }
});
