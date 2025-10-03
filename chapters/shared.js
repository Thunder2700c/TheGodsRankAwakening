document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById('themeToggle');

  if(!themeToggle) return;

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'light-mode';
  document.body.classList.add(savedTheme);
  updateThemeButton(savedTheme);

  // Toggle on click
  themeToggle.addEventListener('click', () => {
    if(document.body.classList.contains('light-mode')){
      document.body.classList.replace('light-mode','dark-mode');
      localStorage.setItem('theme','dark-mode');
      updateThemeButton('dark-mode');
    } else {
      document.body.classList.replace('dark-mode','light-mode');
      localStorage.setItem('theme','light-mode');
      updateThemeButton('light-mode');
    }
  });

  function updateThemeButton(mode){
    const icon = themeToggle.querySelector('i');
    if(mode==='dark-mode'){
      icon.className='fa-solid fa-sun';
      themeToggle.childNodes[1].nodeValue=' Light Mode';
    } else {
      icon.className='fa-solid fa-moon';
      themeToggle.childNodes[1].nodeValue=' Dark Mode';
    }
  }
});
