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
      const currentTheme = document.body.classList.contains('light-mode') ? 'light-mode' : 'dark-mode';
      const newTheme = e.matches ? 'dark-mode' : 'light-mode';
      if (currentTheme !== newTheme) {
        document.body.classList.remove(currentTheme);
        document.body.classList.add(newTheme);
        updateButton(newTheme);
      }
    }
  });

  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    const newTheme = isLight ? 'dark-mode' : 'light-mode';
    // Safe flip: Remove current, add new
    document.body.classList.remove('light-mode', 'dark-mode'); // Clear both first
    document.body.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    updateButton(newTheme);
    
    // Trigger CSS transition
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

  // Bonus: Disable nav buttons on first/last chapters
  const prevBtn = document.querySelector('.nav-btn.prev');
  const nextBtn = document.querySelector('.nav-btn.next');
  if (prevBtn && window.location.pathname.includes('1-prologue')) prevBtn.style.opacity = '0.5';
  if (nextBtn && window.location.pathname.includes('5-coming-soon')) nextBtn.style.opacity = '0.5';

  // --- MODERN READING PROGRESS BAR LOGIC (ADDED) ---
  function updateReadingProgress() {
    const progressBar = document.getElementById("progress");
    if (!progressBar) return; 

    const scrollPosition = document.body.scrollTop || document.documentElement.scrollTop;
    // totalHeight is the scrollable height of the document
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (totalHeight > 0) {
      const progress = (scrollPosition / totalHeight) * 100;
      progressBar.style.width = progress + "%";
    } else {
      progressBar.style.width = "0%";
    }
  }

  // Attach to scroll and resize events for live update
  window.addEventListener('scroll', updateReadingProgress);
  window.addEventListener('resize', updateReadingProgress);
  // Run on load for initial positioning (in case the page is already scrolled)
  document.addEventListener('DOMContentLoaded', updateReadingProgress);
});
