// small shared utilities used by main.js and chapter.js
(function () {
  window.shared = {
    formatTitle(idx, title) {
      return `chapter ${idx + 1} — ${title}`;
    },
    showNotification(text, timeout = 2200) {
      const el = document.getElementById('notification');
      if (!el) return;
      el.textContent = text;
      el.classList.remove('hidden');
      clearTimeout(window._notifyTimer);
      window._notifyTimer = setTimeout(() => el.classList.add('hidden'), timeout);
    },
    saveBookmark(index) {
      localStorage.setItem('gods_bookmark', String(index));
      this.showNotification('chapter bookmarked ⭐');
    },
    getBookmark() {
      const v = localStorage.getItem('gods_bookmark');
      return v === null ? null : Number(v);
    },
    saveTheme(theme) {
      localStorage.setItem('gods_theme', theme);
    },
    loadTheme() {
      return localStorage.getItem('gods_theme') || 'dark';
    },
    saveFont(sizeKey) {
      localStorage.setItem('gods_font_size', sizeKey);
    },
    loadFont() {
      return localStorage.getItem('gods_font_size') || 'normal';
    }
  };
})();
