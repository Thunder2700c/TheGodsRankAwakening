document.addEventListener('DOMContentLoaded', () => {
    // Chapter data array
    const chapters = [
      { title: "Prologue: Defiant Stand", file: "1-prologue.html", teaser: "No way in hell... Aditya's roar against Kanasura's spear.", date: "Oct 21, 2120" },
      { title: "Epilogue I: Tea & Revelations", file: "2-epilogue-1.html", teaser: "Quiet moments shatter with Venta's cosmic truth.", date: "TBA" },
      { title: "The Day Hell Opened", file: "3-the-day-hell-opened.html", teaser: "Portals ignite—timeline fractures in hell's fury.", date: "TBA" },
      { title: "Awakening the Ancients", file: "4-awakening-the-ancients.html", teaser: "God-ranks stir from eons of slumber.", date: "TBA" },
      { title: "Coming Soon...", file: "5-coming-soon.html", teaser: "The rank wars escalate—teaser drops weekly!", date: "Soon™" }
    ];
  
    const grid = document.getElementById('chaptersGrid');
    
    if (!grid) {
      console.error('Chapters grid not found—main.js stopped execution.');
      return;
    }
  
    grid.innerHTML = '';
  
    // 1. Generate Chapter Cards
    chapters.forEach((chap, index) => {
      const link = document.createElement('a');
      // IMPORTANT: The script assumes your chapter files (1-prologue.html, etc.) 
      // are located in a folder named 'chapters' next to index.html.
      link.href = `chapters/${chap.file}`; 
      link.className = 'chapter-card liquid-glass'; 
      link.innerHTML = `
        <div class="content-wrapper">
            <h3>${chap.title}</h3>
            <p class="teaser">${chap.teaser}</p>
        </div>
        <small class="meta">${chap.date}</small>
      `;
      grid.appendChild(link);
    });
  
    // 2. Search Functionality
    const searchInput = document.getElementById('searchChapters');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.chapter-card');
        
        cards.forEach(card => {
          const text = card.innerText.toLowerCase();
          card.style.display = text.includes(query) ? 'flex' : 'none';
        });
      });
    }

    // 3. Floating Dock Actions
    document.getElementById('latest-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert('LATEST: Redirecting to the newest chapter.');
    });

    document.getElementById('library-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert('LIBRARY: Placeholder for your saved chapters/read list.');
    });
});
