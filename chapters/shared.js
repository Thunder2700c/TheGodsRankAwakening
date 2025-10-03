const themeToggle = document.getElementById('themeToggle');

// Apply saved theme or default to light
document.body.classList.remove('light-mode', 'dark-mode');
document.body.classList.add(localStorage.getItem('theme') || 'light-mode');

// Update button icon text
updateButtonIcon(document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode');

// Theme toggle click
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
