document.addEventListener('DOMContentLoaded', () => {

    // ===================================================
    // LOADING SCREEN
    // ===================================================
    
    const loader = document.getElementById('loader');
    if (loader) {
        // Hide loader after animation completes
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1800); // 1.5s loading + 0.3s buffer
    }

    // ===================================================
    // DARK MODE TOGGLE
    // ===================================================
    
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            // Update icon
            if (document.body.classList.contains('dark-mode')) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // ===================================================
    // CHAPTER DATA (with reading time)
    // ===================================================
    
    const chapters = [
      { 
        id: 1,
        title: "Prologue: Defiant Stand", 
        file: "1-prologue.html", 
        teaser: "No way in hell... Aditya's roar against Kanasura's spear.", 
        date: "Oct 21, 2120",
        readTime: "3 min"
      },
      { 
        id: 2,
        title: "Epilogue I: Tea & Revelations", 
        file: "2-epilogue-1.html", 
        teaser: "Quiet moments shatter with Venta's cosmic truth.", 
        date: "TBA",
        readTime: "5 min"
      },
      { 
        id: 3,
        title: "The Day Hell Opened", 
        file: "3-the-day-hell-opened.html", 
        teaser: "Portals ignite—timeline fractures in hell's fury.", 
        date: "TBA",
        readTime: "7 min"
      },
      { 
        id: 4,
        title: "Awakening the Ancients", 
        file: "4-awakening-the-ancients.html", 
        teaser: "God-ranks stir from eons of slumber.", 
        date: "TBA",
        readTime: "6 min"
      },
      { 
        id: 5,
        title: "Coming Soon...", 
        file: "5-coming-soon.html", 
        teaser: "The rank wars escalate—teaser drops weekly!", 
        date: "Soon™",
        readTime: "? min"
      }
    ];
  
    const grid = document.getElementById('chaptersGrid');
    const dock = document.getElementById('floatingDock');
    
    if (!grid) {
      console.error('Chapters grid not found—main.js stopped execution.');
      return;
    }
  
    grid.innerHTML = '';

    // ===================================================
    // GENERATE CHAPTER CARDS
    // ===================================================
  
    chapters.forEach((chap) => {
      const link = document.createElement('a');
      link.href = `chapters/${chap.file}`; 
      link.className = 'chapter-card liquid-glass';
      link.dataset.chapterId = chap.id;
      link.innerHTML = `
        <div class="content-wrapper">
            <h3>${chap.title}</h3>
            <p class="teaser">${chap.teaser}</p>
            <span class="read-time">
              <i class="fa-regular fa-clock"></i> ${chap.readTime} read
            </span>
        </div>
        <small class="meta">${chap.date}</small>
      `;
      
      // Save reading progress when clicked
      link.addEventListener('click', () => {
        localStorage.setItem('lastChapter', JSON.stringify({
          id: chap.id,
          title: chap.title,
          file: chap.file
        }));
      });
      
      grid.appendChild(link);
    });

    // ===================================================
    // CONTINUE READING FEATURE
    // ===================================================
    
    const continueSection = document.getElementById('continueSection');
    const continueTitle = document.getElementById('continueTitle');
    const continueLink = document.getElementById('continueLink');
    
    const lastChapter = localStorage.getItem('lastChapter');
    
    if (lastChapter && continueSection) {
      const chapterData = JSON.parse(lastChapter);
      continueSection.style.display = 'block';
      continueTitle.textContent = chapterData.title;
      continueLink.href = `chapters/${chapterData.file}`;
    }
  
    // ===================================================
    // SEARCH FUNCTIONALITY
    // ===================================================
    
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

    // ===================================================
    // FLOATING DOCK ACTIONS
    // ===================================================
    
    document.getElementById('latest-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        // Find latest chapter (first non-TBA)
        const latestChapter = chapters.find(ch => ch.date !== "TBA" && ch.date !== "Soon™");
        if (latestChapter) {
            window.location.href = `chapters/${latestChapter.file}`;
        } else {
            alert('No chapters available yet!');
        }
    });

    document.getElementById('library-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert('📚 Library feature coming soon!\n\nYou\'ll be able to save and organize your favorite chapters.');
    });

    // ===================================================
    // FLOATING DOCK SCROLL BEHAVIOR
    // ===================================================
    
    if (dock) {
        let lastScrollTop = 0;
        let scrollTimeout;

        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 50) {
                dock.classList.add('hidden');
            } else {
                dock.classList.remove('hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                dock.classList.remove('hidden');
            }, 500);
        };

        window.addEventListener('scroll', handleScroll);
        
        if (window.scrollY > 100) {
            dock.classList.add('hidden');
        } else {
            dock.classList.remove('hidden');
        }
    }

});
