const themeToggle = document.getElementById('themeToggle');

// Load saved theme
document.body.classList.add(localStorage.getItem('theme') || 'light-mode');
updateThemeButton(document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode');

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
