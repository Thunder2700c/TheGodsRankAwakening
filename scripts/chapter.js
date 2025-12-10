// ===================================================
// CHAPTER PAGE FUNCTIONALITY
// ===================================================

document.addEventListener('DOMContentLoaded', () => {

    // ===================================================
    // READING PROGRESS BAR
    // ===================================================
    
    const progressBar = document.getElementById('readingProgress');
    
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = progress + '%';
        });
    }

    // ===================================================
    // CHAPTER REACTIONS
    // ===================================================
    
    const reactionBtns = document.querySelectorAll('.reaction-btn');
    const chapterId = window.location.pathname; // Use URL as unique ID
    
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
                // Remove old reaction
                const oldReaction = localStorage.getItem(`reacted-${chapterId}`);
                const oldBtn = document.querySelector(`[data-reaction="${oldReaction}"]`);
                const oldCount = document.getElementById(`count-${oldReaction}`);
                
                if (oldBtn) oldBtn.classList.remove('active');
                if (chapterReactions[oldReaction] > 0) {
                    chapterReactions[oldReaction]--;
                    if (oldCount) oldCount.textContent = chapterReactions[oldReaction];
                }
                
                // If clicking same reaction, just remove it
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
            
            // Animation feedback
            btn.style.transform = 'scale(1.3)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 200);
        });
    });

});
