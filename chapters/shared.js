document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  // Detect system pref as fallback
  const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-mode' : 'light-mode';
  const savedTheme = localStorage.getItem('theme') || systemPref;
  
  document.body.classList.add(savedTheme);
  updateButton(savedTheme);

  // Listen for system changes (e.g., OS toggle)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) { // Only if no user override
      const newTheme = e.matches ? 'dark-mode' : 'light-mode';
      document.body.classList.replace(savedTheme, newTheme);
      updateButton(newTheme);
    }
  });

  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    const newTheme = isLight ? 'dark-mode' : 'light-mode';
    document.body.classList.toggle('light-mode', isLight);
    document.body.classList.toggle('dark-mode', !isLight);
    localStorage.setItem('theme', newTheme);
    updateButton(newTheme);
    
    // Optional: Trigger CSS transition explicitly
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => { document.body.style.transition = ''; }, 300);
  });

  function updateButton(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark-mode') {
      icon.className = 'fa-solid fa-sun';
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
    } else {
      icon.className = 'fa-solid fa-moon';
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i> Dark Mode';
    }
  }

  // Bonus: Disable nav buttons on first/last chapters (if .prev/.next classes exist)
  const prevBtn = document.querySelector('.nav-btn.prev');
  const nextBtn = document.querySelector('.nav-btn.next');
  if (prevBtn && window.location.pathname.includes('1-prologue')) prevBtn.style.opacity = '0.5';
  if (nextBtn && window.location.pathname.includes('5-coming-soon')) nextBtn.style.opacity = '0.5';
});
