// ===================================================
// COMMENTS SYSTEM
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  
  const db = window.db;
  const auth = window.auth;
  
  const commentsContainer = document.getElementById('commentsContainer');
  const commentForm = document.getElementById('commentForm');
  const commentInput = document.getElementById('commentInput');
  const commentCount = document.getElementById('commentCount');
  const loginToComment = document.getElementById('loginToComment');
  
  if (!commentsContainer) return;
  
  // Get chapter ID from URL
  const chapterId = window.location.pathname.split('/').pop().replace('.html', '');
  
  // ===================================================
  // AUTH STATE - Show/hide comment form
  // ===================================================
  
  auth.onAuthStateChanged((user) => {
    if (user) {
      if (commentForm) commentForm.style.display = 'block';
      if (loginToComment) loginToComment.style.display = 'none';
    } else {
      if (commentForm) commentForm.style.display = 'none';
      if (loginToComment) loginToComment.style.display = 'block';
    }
  });
  
  // ===================================================
  // LOAD COMMENTS
  // ===================================================
  
  async function loadComments() {
    try {
      const snapshot = await db.collection('comments')
        .where('chapterId', '==', chapterId)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();
      
      const comments = [];
      snapshot.forEach(doc => {
        comments.push({ id: doc.id, ...doc.data() });
      });
      
      renderComments(comments);
      
      if (commentCount) {
        commentCount.textContent = comments.length;
      }
      
    } catch (error) {
      console.error("Error loading comments:", error);
      commentsContainer.innerHTML = '<p class="error">Failed to load comments.</p>';
    }
  }
  
  function renderComments(comments) {
    if (comments.length === 0) {
      commentsContainer.innerHTML = `
        <div class="no-comments">
          <p>🗨️ No comments yet. Be the first to share your thoughts!</p>
        </div>
      `;
      return;
    }
    
    commentsContainer.innerHTML = comments.map(comment => `
      <div class="comment" data-id="${comment.id}">
        <div class="comment-header">
          <img 
            src="${comment.userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}" 
            alt="${comment.userName}" 
            class="comment-avatar"
          >
          <div class="comment-meta">
            <span class="comment-author">${escapeHtml(comment.userName)}</span>
            <span class="comment-date">${formatDate(comment.createdAt)}</span>
          </div>
          ${auth.currentUser?.uid === comment.userId ? `
            <button class="delete-comment" data-id="${comment.id}" title="Delete">
              <i class="fa-solid fa-trash"></i>
            </button>
          ` : ''}
        </div>
        <div class="comment-body">
          <p>${escapeHtml(comment.text)}</p>
        </div>
        <div class="comment-actions">
          <button class="like-comment" data-id="${comment.id}">
            <i class="fa-${comment.likes?.includes(auth.currentUser?.uid) ? 'solid' : 'regular'} fa-heart"></i>
            <span>${comment.likes?.length || 0}</span>
          </button>
          <button class="reply-comment" data-id="${comment.id}">
            <i class="fa-solid fa-reply"></i> Reply
          </button>
        </div>
      </div>
    `).join('');
    
    // Add event listeners
    addCommentEventListeners();
  }
  
  // ===================================================
  // POST COMMENT
  // ===================================================
  
  commentForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) {
      alert('Please login to comment!');
      return;
    }
    
    const text = commentInput.value.trim();
    if (!text) return;
    
    if (text.length > 1000) {
      alert('Comment is too long! Max 1000 characters.');
      return;
    }
    
    const submitBtn = commentForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';
    
    try {
      // Get user data
      const userDoc = await db.collection('users').doc(user.uid).get();
      const userData = userDoc.data() || {};
      
      // Add comment
      await db.collection('comments').add({
        chapterId: chapterId,
        userId: user.uid,
        userName: user.displayName || userData.username || 'Anonymous',
        userAvatar: user.photoURL || userData.avatar || null,
        text: text,
        likes: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      // Update user stats
      await db.collection('users').doc(user.uid).update({
        totalComments: firebase.firestore.FieldValue.increment(1)
      });
      
      // Clear input and reload
      commentInput.value = '';
      loadComments();
      
    } catch (error) {
      console.error("Error posting comment:", error);
      alert('Failed to post comment. Try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Post Comment';
    }
  });
  
  // ===================================================
  // COMMENT INTERACTIONS
  // ===================================================
  
  function addCommentEventListeners() {
    // Like buttons
    document.querySelectorAll('.like-comment').forEach(btn => {
      btn.addEventListener('click', async () => {
        const user = auth.currentUser;
        if (!user) {
          alert('Please login to like comments!');
          return;
        }
        
        const commentId = btn.dataset.id;
        const commentRef = db.collection('comments').doc(commentId);
        
        try {
          const doc = await commentRef.get();
          const likes = doc.data().likes || [];
          
          if (likes.includes(user.uid)) {
            // Unlike
            await commentRef.update({
              likes: firebase.firestore.FieldValue.arrayRemove(user.uid)
            });
          } else {
            // Like
            await commentRef.update({
              likes: firebase.firestore.FieldValue.arrayUnion(user.uid)
            });
          }
          
          loadComments();
          
        } catch (error) {
          console.error("Error liking comment:", error);
        }
      });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-comment').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this comment?')) return;
        
        const commentId = btn.dataset.id;
        
        try {
          await db.collection('comments').doc(commentId).delete();
          
          // Update user stats
          await db.collection('users').doc(auth.currentUser.uid).update({
            totalComments: firebase.firestore.FieldValue.increment(-1)
          });
          
          loadComments();
          
        } catch (error) {
          console.error("Error deleting comment:", error);
          alert('Failed to delete comment.');
        }
      });
    });
  }
  
  // ===================================================
  // HELPERS
  // ===================================================
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function formatDate(timestamp) {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
  
  // ===================================================
  // INITIALIZE
  // ===================================================
  
  loadComments();

});
