// ===================================================
// CHAPTER PAGE FUNCTIONALITY - TGRA
// ===================================================

document.addEventListener('DOMContentLoaded', () => {

    // ===================================================
    // DARK MODE TOGGLE
    // ===================================================
    
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
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
    // READING PROGRESS BAR
    // ===================================================
    
    const progressBar = document.getElementById('readingProgress');
    const scrollPercent = document.getElementById('scrollPercent');
    
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.round((scrollTop / docHeight) * 100);
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        if (scrollPercent) {
            scrollPercent.textContent = progress + '%';
        }
    }
    
    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call

    // ===================================================
    // READING SETTINGS
    // ===================================================
    
    const settingsToggle = document.getElementById('settingsToggle');
    const settingsPanel = document.getElementById('settingsPanel');
    const chapterContent = document.getElementById('chapterContent');
    const readerContainer = document.querySelector('.reader-container');
    
    // Toggle settings panel
    settingsToggle?.addEventListener('click', () => {
        settingsToggle.classList.toggle('active');
        settingsPanel.classList.toggle('active');
    });
    
    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!settingsPanel?.contains(e.target) && !settingsToggle?.contains(e.target)) {
            settingsPanel?.classList.remove('active');
            settingsToggle?.classList.remove('active');
        }
    });
    
    // Font Size Controls
    const fontIncrease = document.getElementById('fontIncrease');
    const fontDecrease = document.getElementById('fontDecrease');
    const currentSizeEl = document.getElementById('currentSize');
    
    let fontSize = parseInt(localStorage.getItem('fontSize')) || 18;
    applyFontSize(fontSize);
    
    fontIncrease?.addEventListener('click', () => {
        if (fontSize < 28) {
            fontSize += 2;
            applyFontSize(fontSize);
        }
    });
    
    fontDecrease?.addEventListener('click', () => {
        if (fontSize > 14) {
            fontSize -= 2;
            applyFontSize(fontSize);
        }
    });
    
    function applyFontSize(size) {
        if (chapterContent) {
            chapterContent.style.fontSize = size + 'px';
        }
        if (currentSizeEl) {
            currentSizeEl.textContent = size;
        }
        localStorage.setItem('fontSize', size);
    }
    
    // Width Controls
    const widthBtns = document.querySelectorAll('.width-btn');
    const savedWidth = localStorage.getItem('readerWidth') || '700';
    
    widthBtns.forEach(btn => {
        if (btn.dataset.width === savedWidth) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', () => {
            widthBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const width = btn.dataset.width;
            if (readerContainer) {
                readerContainer.style.maxWidth = width + 'px';
            }
            localStorage.setItem('readerWidth', width);
        });
    });
    
    // Apply saved width
    if (readerContainer && savedWidth) {
        readerContainer.style.maxWidth = savedWidth + 'px';
    }

    // ===================================================
    // CHAPTER REACTIONS
    // ===================================================
    
    const reactionBtns = document.querySelectorAll('.reaction-btn');
    const chapterId = window.location.pathname;
    
    // Load saved reactions
    const savedReactions = JSON.parse(localStorage.getItem('reactions') || '{}');
    const chapterReactions = savedReactions[chapterId] || {};
    
    // Update counts
    Object.keys(chapterReactions).forEach(reaction => {
        const countEl = document.getElementById(`count-${reaction}`);
        if (countEl) {
            countEl.textContent = chapterReactions[reaction] || 0;
        }
    });
    
    // Check if user already reacted
    const userReacted = localStorage.getItem(`reacted-${chapterId}`);
    if (userReacted) {
        const btn = document.querySelector(`[data-reaction="${userReacted}"]`);
        if (btn) btn.classList.add('active');
    }
    
    reactionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const reaction = btn.dataset.reaction;
            const countEl = document.getElementById(`count-${reaction}`);
            
            // Check if already reacted
            if (localStorage.getItem(`reacted-${chapterId}`)) {
                const oldReaction = localStorage.getItem(`reacted-${chapterId}`);
                const oldBtn = document.querySelector(`[data-reaction="${oldReaction}"]`);
                const oldCount = document.getElementById(`count-${oldReaction}`);
                
                if (oldBtn) oldBtn.classList.remove('active');
                if (chapterReactions[oldReaction] > 0) {
                    chapterReactions[oldReaction]--;
                    if (oldCount) oldCount.textContent = chapterReactions[oldReaction];
                }
                
                if (oldReaction === reaction) {
                    localStorage.removeItem(`reacted-${chapterId}`);
                    savedReactions[chapterId] = chapterReactions;
                    localStorage.setItem('reactions', JSON.stringify(savedReactions));
                    return;
                }
            }
            
            // Add new reaction
            btn.classList.add('active');
            chapterReactions[reaction] = (chapterReactions[reaction] || 0) + 1;
            countEl.textContent = chapterReactions[reaction];
            
            // Save
            localStorage.setItem(`reacted-${chapterId}`, reaction);
            savedReactions[chapterId] = chapterReactions;
            localStorage.setItem('reactions', JSON.stringify(savedReactions));
            
            // Animation
            btn.style.transform = 'scale(1.3)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        });
    });

    // ===================================================
    // SAVE READING PROGRESS
    // ===================================================
    
    // Get chapter info from the page
    const chapterTitle = document.querySelector('.chapter-title')?.textContent || 'Unknown';
    const chapterNum = document.querySelector('.chapter-number')?.textContent || '??';
    const chapterFile = window.location.pathname.split('/').pop();
    
    // Save as last read chapter
    localStorage.setItem('lastChapter', JSON.stringify({
        id: parseInt(chapterFile.split('-')[0]) || 1,
        title: `${chapterNum}: ${chapterTitle}`,
        file: chapterFile
    }));

    // ===================================================
    // FLOATING DOCK SCROLL BEHAVIOR
    // ===================================================
    
    const dock = document.getElementById('floatingDock');
    
    if (dock) {
        let lastScrollTop = 0;
        let scrollTimeout;

        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                dock.classList.add('hidden');
            } else {
                dock.classList.remove('hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                dock.classList.remove('hidden');
            }, 800);
        };

        window.addEventListener('scroll', handleScroll);
    }

    // ===================================================
    // KEYBOARD SHORTCUTS
    // ===================================================
    
    document.addEventListener('keydown', (e) => {
        // Left arrow = previous chapter
        if (e.key === 'ArrowLeft') {
            const prevLink = document.querySelector('.nav-btn.prev');
            if (prevLink) window.location.href = prevLink.href;
        }
        // Right arrow = next chapter
        if (e.key === 'ArrowRight') {
            const nextLink = document.querySelector('.nav-btn.next');
            if (nextLink) window.location.href = nextLink.href;
        }
    });

});
