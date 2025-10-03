const chapters = [
  { id: 1, slug: 'prologue', title: 'PROLOGUE', desc: 'Fight scene.', path: '/chapters/1-prologue.html' },
  { id: 2, slug: 'epilogue-1', title: 'EPILOGUE 1', desc: 'The Future.', path: '/chapters/2-epilogue-1.html' },
  { id: 3, slug: 'the-day-hell-opened', title: 'The Day Hell Opened', desc: 'A story begins', path: '/chapters/3-the-day-hell-opened.html' },
  { id: 4, slug: 'awakening-the-ancients', title: 'Awakening the Ancients: Shadows of Patala', desc: 'Work-in-progress', path: '/chapters/4-awakening-the-ancients.html' },
  { id: 5, slug: 'coming-soon', title: 'Coming Soon', desc: 'Coming Soon', path: '/chapters/5-coming-soon.html' },
];

const els = {
  grid: document.getElementById('chaptersGrid'),
  bookmarksGrid: document.getElementById('bookmarksGrid'),
  themeToggle: document.getElementById('themeToggle'),
};

function getBookmarks() {
  try { return new Set(JSON.parse(localStorage.getItem('bc_bookmarks') || '[]')); }
  catch { return new Set(); }
}
function setBookmarks(set) {
  localStorage.setItem('bc_bookmarks', JSON.stringify([...set]));
}

function renderChapters() {
  if (!els.grid) return;
  els.grid.innerHTML = chapters.map(ch => `
    <article class="card">
      <a href="${ch.path}" aria-label="Open ${ch.title}">
        <div class="badge">Chapter ${ch.id}</div>
        <h3 class="title">${ch.title}</h3>
        <p class="desc">${ch.desc}</p>
      </a>
      <div style="display:flex; gap:8px; margin-top:10px;">
        <a class="btn outline" href="${ch.path}">Read</a>
        <button class="btn" data-bm="${ch.id}">🔖 Bookmark</button>
      </div>
    </article>
  `).join('');
  bindBookmarkButtons();
}

function renderBookmarks() {
  if (!els.bookmarksGrid) return;
  const bm = getBookmarks();
  const items = chapters.filter(c => bm.has(c.id));
  if (items.length === 0) {
    els.bookmarksGrid.classList.add('empty-state');
    els.bookmarksGrid.innerHTML = '<p>No bookmarks yet.</p>';
    return;
  }
  els.bookmarksGrid.classList.remove('empty-state');
  els.bookmarksGrid.innerHTML = items.map(ch => `
    <article class="card">
      <a href="${ch.path}">
        <div class="badge">Chapter ${ch.id}</div>
        <h3 class="title">${ch.title}</h3>
        <p class="desc">${ch.desc}</p>
      </a>
    </article>
  `).join('');
}

function bindBookmarkButtons() {
  document.querySelectorAll('button[data-bm]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-bm'));
      const bm = getBookmarks();
      if (bm.has(id)) bm.delete(id); else bm.add(id);
      setBookmarks(bm);
      renderBookmarks();
      btn.textContent = bm.has(id) ? '⭐ Bookmarked' : '🔖 Bookmark';
    });
  });
}

function initTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem('bc_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);
  if (els.themeToggle) els.themeToggle.textContent = initial === 'dark' ? '☀️' : '🌙';
  if (els.themeToggle) {
    els.themeToggle.addEventListener('click', () => {
      const cur = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', cur);
      localStorage.setItem('bc_theme', cur);
      els.themeToggle.textContent = cur === 'dark' ? '☀️' : '🌙';
    });
  }
}

function init() {
  initTheme();
  renderChapters();
  renderBookmarks();
}

document.addEventListener('DOMContentLoaded', init);
