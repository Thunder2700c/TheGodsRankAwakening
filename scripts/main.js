// main app logic
(function () {
  // elements
  const chaptersGrid = document.getElementById('chaptersGrid');
  const totalChaptersSmall = document.getElementById('totalChaptersSmall');
  const totalChapters = document.getElementById('totalChapters');
  const currentIndexEl = document.getElementById('currentIndex');
  const chapterTitle = document.getElementById('chapterTitle');
  const chapterDesc = document.getElementById('chapterDesc');
  const chapterContent = document.getElementById('chapterContent');

  const chaptersView = document.getElementById('chaptersView');
  const readerView = document.getElementById('readerView');

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const backBtn = document.getElementById('backBtn');
  const bookmarkBtn = document.getElementById('bookmarkBtn');
  const startReading = document.getElementById('startReading');
  const showBookmarks = document.getElementById('showBookmarks');

  const themeToggle = document.getElementById('themeToggle');
  const fontToggle = document.getElementById('fontToggle');

  const SECTIONS = window.CHAPTERS || [];
  let current = 0;

  // init
  function init() {
    renderGrid();
    applyTheme(shared.loadTheme());
    applyFont(shared.loadFont());
    totalChaptersSmall.textContent = `${SECTIONS.length} chapters`;
    totalChapters.textContent = String(SECTIONS.length || 0);

    // events
    prevBtn.addEventListener('click', () => openChapter(current - 1));
    nextBtn.addEventListener('click', () => openChapter(current + 1));
    backBtn.addEventListener('click', showChaptersView);
    bookmarkBtn.addEventListener('click', () => {
      shared.saveBookmark(current);
      shared.showNotification('bookmarked ✨');
    });
    startReading.addEventListener('click', () => openChapter(0));
    showBookmarks.addEventListener('click', goToBookmark);

    themeToggle.addEventListener('click', toggleTheme);
    fontToggle.addEventListener('click', cycleFont);

    // load bookmark highlight
    const bk = shared.getBookmark();
    if (bk !== null && Number.isInteger(bk) && bk >= 0 && bk < SECTIONS.length) {
      // highlight in grid
      setTimeout(() => highlightCard(bk), 450);
    }
  }

  function renderGrid() {
    chaptersGrid.innerHTML = '';
    if (!SECTIONS.length) {
      chaptersGrid.innerHTML = '<p class="muted">no chapters found. add chapters in <code>chapters/chapter.js</code></p>';
      return;
    }
    SECTIONS.forEach((c, i) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.setAttribute('data-index', i);
      card.innerHTML = `
        <h4>${shared.formatTitle(i, escapeHtml(c.title))}</h4>
        <p class="muted">${escapeHtml(c.description || '')}</p>
        <div class="meta">chapter ${i + 1}</div>
        <div style="margin-top:10px"><button class="btn" data-open-index="${i}">read →</button></div>
      `;
      chaptersGrid.appendChild(card);

      card.querySelector('button[data-open-index]').addEventListener('click', (ev) => {
        const idx = Number(ev.currentTarget.getAttribute('data-open-index'));
        openChapter(idx);
      });
    });
  }

  function openChapter(index) {
    if (index < 0 || index >= SECTIONS.length) return;
    current = index;
    // set UI
    chapterTitle.textContent = shared.formatTitle(index, SECTIONS[index].title);
    chapterDesc.textContent = SECTIONS[index].description || '';
    chapterContent.innerHTML = SECTIONS[index].content || '<p class="muted">no content</p>';
    currentIndexEl.textContent = String(index + 1);
    totalChapters.textContent = String(SECTIONS.length);

    // enable/disable nav
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === SECTIONS.length - 1;

    // toggle views
    chaptersView.classList.add('hidden');
    readerView.classList.remove('hidden');
    readerView.setAttribute('aria-hidden', 'false');
    chaptersView.setAttribute('aria-hidden', 'true');

    // focus content for keyboard readers
    chapterContent.focus();

    // smooth scroll
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showChaptersView() {
    readerView.classList.add('hidden');
    chaptersView.classList.remove('hidden');
    chaptersView.setAttribute('aria-hidden', 'false');
    readerView.setAttribute('aria-hidden', 'true');
  }

  function goToBookmark() {
    const b = shared.getBookmark();
    if (b === null) {
      shared.showNotification('no bookmark set');
      return;
    }
    if (b >= 0 && b < SECTIONS.length) openChapter(b);
  }

  // theme & font
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.style.setProperty('--bg', '#f7f8fb');
      document.documentElement.style.setProperty('--text', '#0b1221');
      document.body.classList.add('light');
      themeToggle.textContent = '☀️';
    } else {
      // dark defaults
      document.documentElement.style.setProperty('--bg', '#05060a');
      document.body.classList.remove('light');
      themeToggle.textContent = '🌙';
    }
    shared.saveTheme(theme);
  }
  function toggleTheme() {
    const currentTheme = shared.loadTheme();
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }

  function applyFont(sizeKey) {
    if (sizeKey === 'small') {
      document.documentElement.style.setProperty('font-size', '14px');
    } else if (sizeKey === 'large') {
      document.documentElement.style.setProperty('font-size', '18px');
    } else {
      document.documentElement.style.setProperty('font-size', '16px');
    }
    shared.saveFont(sizeKey);
  }
  function cycleFont() {
    const cur = shared.loadFont();
    const next = cur === 'normal' ? 'large' : cur === 'large' ? 'small' : 'normal';
    applyFont(next);
    shared.showNotification(`font: ${next}`);
  }

  // small helpers
  function escapeHtml(s = '') {
    return String(s).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function highlightCard(index) {
    const card = chaptersGrid.querySelector(`.card[data-index="${index}"]`);
    if (!card) return;
    card.style.boxShadow = '0 24px 60px rgba(0,255,238,0.12)';
    setTimeout(() => card.style.boxShadow = '', 2000);
  }

  // initialize
  document.addEventListener('DOMContentLoaded', init);
})();
