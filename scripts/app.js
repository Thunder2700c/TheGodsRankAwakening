document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. THEME LOGIC (Works everywhere) ---
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;
  
  // Check storage on load
  const savedTheme = localStorage.getItem('theme') || 'light';
  htmlEl.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // --- 2. HOME PAGE LOGIC (Only runs if 'chaptersGrid' exists) ---
  const chaptersGrid = document.getElementById('chaptersGrid');
  if (chaptersGrid) {
    // Your Chapter Data
    const chapters = [
      { title: "Prologue: Defiant Stand", url: "chapters/1-prologue.html", date: "Oct 21", teaser: "Aditya's roar against Kanasura..." },
      { title: "Epilogue 1: Revelations", url: "chapters/2-epilogue-1.html", date: "Oct 22", teaser: "Quiet moments shatter..." },
      { title: "The Day Hell Opened", url: "chapters/3-the-day-hell-opened.html", date: "Oct 23", teaser: "Portals ignite..." },
      { title: "Awakening Ancients", url: "chapters/4-awakening-the-ancients.html", date: "Oct 24", teaser: "God-ranks stir..." },
      { title: "Coming Soon...", url: "chapters/5-coming-soon.html", date: "Soon", teaser: "Stay tuned!" }
    ];

    const renderChapters = (filter = "") => {
      chaptersGrid.innerHTML = '';
      chapters.forEach(chap => {
        if (chap.title.toLowerCase().includes(filter.toLowerCase())) {
          const card = document.createElement('a');
          card.href = chap.url;
          card.className = 'chapter-card';
          card.innerHTML = `
            <h3>${chap.title}</h3>
            <p style="font-size:0.9rem; opacity:0.8; margin:0.5rem 0;">${chap.teaser}</p>
            <small>${chap.date}</small>
          `;
          chaptersGrid.appendChild(card);
        }
      });
    };
    
    renderChapters(); // Initial Load

    // Search Bar Logic
    const searchBox = document.getElementById('searchChapters'); // ID must match HTML
    if (searchBox) {
      searchBox.addEventListener('input', (e) => renderChapters(e.target.value));
    }
  }

  // --- 3. CHAPTER PAGE LOGIC (Only runs if 'progressBar' exists) ---
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    // Scroll Progress
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    });

    // Keyboard Navigation (Previous/Next)
    document.addEventListener('keydown', (e) => {
      if (e.key === "ArrowRight") {
        const next = document.querySelector('.nav-btn.next'); // Class must match HTML
        if (next) next.click();
      }
      if (e.key === "ArrowLeft") {
        const prev = document.querySelector('.nav-btn.prev');
        if (prev) prev.click();
      }
    });
  }
});
