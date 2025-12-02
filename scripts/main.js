
document.addEventListener('DOMContentLoaded', () => {
    // Chapter data array (remains the same)
    const chapters = [
      { title: "Prologue: Defiant Stand", file: "1-prologue.html", teaser: "No way in hell... Aditya's roar against Kanasura's spear.", date: "Oct 21, 2120" },
      { title: "Epilogue I: Tea & Revelations", file: "2-epilogue-1.html", teaser: "Quiet moments shatter with Venta's cosmic truth.", date: "TBA" },
      { title: "The Day Hell Opened", file: "3-the-day-hell-opened.html", teaser: "Portals ignite—timeline fractures in hell's fury.", date: "TBA" },
      { title: "Awakening the Ancients", file: "4-awakening-the-ancients.html", teaser: "God-ranks stir from eons of slumber.", date: "TBA" },
      { title: "Coming Soon...", file: "5-coming-soon.html", teaser: "The rank wars escalate—teaser drops weekly!", date: "Soon™" }
    ];
  
    const grid = document.getElementById('chaptersGrid');
    const dock = document.getElementById('floatingDock'); // Get the dock element
    
    if (!grid) {
      console.error('Chapters grid not found—main.js stopped execution.');
      return;
    }
  
    grid.innerHTML = '';
  
    // 1. Generate Chapter Cards (unchanged)
    chapters.forEach((chap) => {
      const link = document.createElement('a');
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
  
    // 2. Search Functionality (unchanged)
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

    // 3. Floating Dock Actions (unchanged)
    document.getElementById('latest-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert('LATEST: Redirecting to the newest chapter.');
    });

    document.getElementById('library-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert('LIBRARY: Placeholder for your saved chapters/read list.');
    });


    // 4. Floating Dock Slide-In/Out Logic (NEW ANIMATION CODE)
    if (dock) {
        let lastScrollTop = 0;
        let scrollTimeout;

        // Function to hide the dock when scrolling down
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            
            // Hide on scroll down (scrolling away from content)
            if (scrollTop > lastScrollTop && scrollTop > 50) { // Check scrollTop > 50 to avoid hiding immediately at top
                dock.classList.add('hidden');
            } else {
                // Show on scroll up (scrolling back towards content)
                dock.classList.remove('hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For mobile/safari

            // Hide/Show after user stops scrolling (for a subtle effect)
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                dock.classList.remove('hidden'); // Show dock when scroll stops
            }, 500); // Wait 500ms after scrolling stops
        };

        window.addEventListener('scroll', handleScroll);
        
        // Initial state: hide dock if we load already scrolled down
        if (window.scrollY > 100) {
            dock.classList.add('hidden');
        } else {
            // Show dock immediately if user is at the very top
            dock.classList.remove('hidden');
        }
    }
});
