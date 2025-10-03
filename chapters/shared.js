const themeToggle = document.getElementById('themeToggle');

// Default: light mode
if (!document.body.classList.contains('dark-mode')) {
  document.body.classList.add('light-mode');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('light-mode')) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      themeToggle.textContent = '☀️ Light Mode';
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      themeToggle.textContent = '🌙 Dark Mode';
    }
  });
}
