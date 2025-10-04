document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'light-mode';
  document.body.classList.add(savedTheme);
  updateThemeButton(savedTheme);

  // Toggle theme on click
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    document.body.classList.toggle('light-mode', !isLight);
    document.body.classList.toggle('dark-mode', isLight);
    const newTheme = isLight ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
  });

  function updateThemeButton(mode) {
    const icon = themeToggle.querySelector('i');
    if (!icon) return;

    if (mode === 'dark-mode') {
      icon.className = 'fa-solid fa-sun';
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
    } else {
      icon.className = 'fa-solid fa-moon';
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i> Dark Mode';
    }
  }
});
