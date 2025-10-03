const themeToggle = document.getElementById('themeToggle');

if (!document.body.classList.contains('dark-mode')) {
  document.body.classList.add('light-mode');
}

themeToggle.addEventListener('click', () => {
  const icon = themeToggle.querySelector('i');
  if (document.body.classList.contains('light-mode')) {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    icon.className = 'fa-solid fa-sun';
    themeToggle.innerHTML = `<i class="${icon.className}"></i> Light Mode`;
  } else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    icon.className = 'fa-solid fa-moon';
    themeToggle.innerHTML = `<i class="${icon.className}"></i> Dark Mode`;
  }
});
