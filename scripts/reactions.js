// ===================================================
// SHARED REACTIONS SYSTEM (Firebase)
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  
  const db = window.db;
  const auth = window.auth;
  
  const reactionBtns = document.querySelectorAll('.reaction-btn');
  if (reactionBtns.length === 0) return;
  
  // Get chapter ID
  const chapterId = window.location.pathname.split('/').pop().replace('.html', '');
  const reactionsRef = db.collection('reactions').doc(chapterId);
  
  // ===================================================
  // LOAD REACTIONS
  // ===================================================
  
  async function loadReactions() {
    try {
      const doc = await reactionsRef.get();
      
      if (doc.exists) {
        const data = doc.data();
        
        // Update counts
        Object.keys(data.counts || {}).forEach(type => {
          const countEl = document.getElementById(`count-${type}`);
          if (countEl) {
            countEl.textContent = data.counts[type] || 0;
          }
        });
        
        // Check if current user reacted
        const user = auth.currentUser;
        if (user && data.userReactions?.[user.uid]) {
          const userReaction = data.userReactions[user.uid];
          const btn = document.querySelector(`[data-reaction="${userReaction}"]`);
          if (btn) btn.classList.add('active');
        }
      }
      
    } catch (error) {
      console.error("Error loading reactions:", error);
    }
  }
  
  // ===================================================
  // ADD REACTION
  // ===================================================
  
  reactionBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const user = auth.currentUser;
      const reaction = btn.dataset.reaction;
      
      // Allow guest reactions with localStorage fallback
      if (!user) {
        handleGuestReaction(btn, reaction);
        return;
      }
      
      try {
        const doc = await reactionsRef.get();
        const data = doc.exists ? doc.data() : { counts: {}, userReactions: {} };
        
        const oldReaction = data.userReactions?.[user.uid];
        
        // Remove old reaction
        if (oldReaction) {
          data.counts[oldReaction] = Math.max(0, (data.counts[oldReaction] || 0) - 1);
          document.querySelector(`[data-reaction="${oldReaction}"]`)?.classList.remove('active');
          
          const oldCount = document.getElementById(`count-${oldReaction}`);
          if (oldCount) oldCount.textContent = data.counts[oldReaction];
        }
        
        // Toggle off if same reaction
        if (oldReaction === reaction) {
          delete data.userReactions[user.uid];
        } else {
          // Add new reaction
          data.counts[reaction] = (data.counts[reaction] || 0) + 1;
          data.userReactions[user.uid] = reaction;
          btn.classList.add('active');
          
          const newCount = document.getElementById(`count-${reaction}`);
          if (newCount) newCount.textContent = data.counts[reaction];
        }
        
        // Save to Firebase
        await reactionsRef.set(data, { merge: true });
        
        // Animate
        animateReaction(btn);
        
      } catch (error) {
        console.error("Error saving reaction:", error);
      }
    });
  });
  
  // ===================================================
  // GUEST REACTIONS (localStorage fallback)
  // ===================================================
  
  function handleGuestReaction(btn, reaction) {
    const storageKey = `guest-reaction-${chapterId}`;
    const oldReaction = localStorage.getItem(storageKey);
    
    // Remove old
    if (oldReaction) {
      document.querySelector(`[data-reaction="${oldReaction}"]`)?.classList.remove('active');
    }
    
    // Toggle
    if (oldReaction === reaction) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, reaction);
      btn.classList.add('active');
    }
    
    animateReaction(btn);
  }
  
  function animateReaction(btn) {
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 200);
  }
  
  // ===================================================
  // INITIALIZE
  // ===================================================
  
  // Load when auth state is ready
  auth.onAuthStateChanged(() => {
    loadReactions();
  });

});
