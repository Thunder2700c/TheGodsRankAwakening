document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById('themeToggle');

  // Always load saved theme
  const savedTheme = localStorage.getItem('theme') || 'light-mode';
  document.body.classList.add(savedTheme);

  // If no toggle button (like some subpages), stop here
  if (!themeToggle) return;

  // Set button state based on current theme
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
    if (mode === 'dark-mode') {
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
    } else {
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i> Dark Mode';
    }
  }
});
