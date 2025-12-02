document.addEventListener('DOMContentLoaded', () => {
    const chapters = [
      { title: "Prologue: Defiant Stand", file: "1-prologue.html", teaser: "No way in hell... Aditya's roar against Kanasura's spear.", date: "Oct 21, 2120" },
      { title: "Epilogue I: Tea & Revelations", file: "2-epilogue-1.html", teaser: "Quiet moments shatter with Venta's cosmic truth.", date: "TBA" },
      { title: "The Day Hell Opened", file: "3-the-day-hell-opened.html", teaser: "Portals ignite—timeline fractures in hell's fury.", date: "TBA" },
      { title: "Awakening the Ancients", file: "4-awakening-the-ancients.html", teaser: "God-ranks stir from eons of slumber.", date: "TBA" },
      { title: "Coming Soon...", file: "5-coming-soon.html", teaser: "The rank wars escalate—teaser drops weekly!", date: "Soon™" }
    ];
  
    const grid = document.getElementById('chaptersGrid');
    
    // Safety check
    if (!grid) return;
  
    // Clear content
    grid.innerHTML = '';
  
    // 1. Generate Glass Cards
    chapters.forEach(chap => {
      const link = document.createElement('a');
      link.href = `chapters/${chap.file}`;
      // Note: We add 'liquid-glass' class here for the material effect
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
          if (text.includes(query)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }
  });
