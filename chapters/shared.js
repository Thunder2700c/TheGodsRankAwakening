const themeToggle = document.getElementById('themeToggle');

// Default: light mode
if (!document.body.classList.contains('dark-mode') && !document.body.classList.contains('light-mode')) {
  document.body.classList.add('light-mode');
}

// Restore saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.body.classList.remove('light-mode', 'dark-mode');
  document.body.classList.add(savedTheme);
  updateButtonIcon(savedTheme);
}

// Click listener
themeToggle.addEventListener('click', () => {
  if (document.body.classList.contains('light-mode')) {
    document.body.classList.replace('light-mode', 'dark-mode');
    localStorage.setItem('theme', 'dark-mode');
    updateButtonIcon('dark-mode');
  } else {
    document.body.classList.replace('dark-mode', 'light-mode');
    localStorage.setItem('theme', 'light-mode');
    updateButtonIcon('light-mode');
  }
});

function updateButtonIcon(mode) {
  const icon = themeToggle.querySelector('i');
  if (mode === 'dark-mode') {
    icon.className = 'fa-solid fa-sun';
    themeToggle.childNodes[1].nodeValue = ' Light Mode';
  } else {
    icon.className = 'fa-solid fa-moon';
    themeToggle.childNodes[1].nodeValue = ' Dark Mode';
  }
}
