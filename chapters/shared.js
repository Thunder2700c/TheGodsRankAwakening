export const chapterLinks = [
  { id: 1, path: '/chapters/1-prologue.html' },
  { id: 2, path: '/chapters/2-epilogue-1.html' },
  { id: 3, path: '/chapters/3-the-day-hell-opened.html' },
  { id: 4, path: '/chapters/4-awakening-the-ancients.html' },
  { id: 5, path: '/chapters/5-coming-soon.html' },
];

export function setupThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('bc_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);
  if (btn) btn.textContent = initial === 'dark' ? '☀️' : '🌙';
  if (btn) btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('bc_theme', next);
    btn.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}

export function setupBookmarks(chapterId) {
  const btn = document.getElementById('bmToggle');
  if (!btn || !chapterId) return;
  const key = 'bc_bookmarks';
  const get = () => new Set(JSON.parse(localStorage.getItem(key) || '[]'));
  const set = (s) => localStorage.setItem(key, JSON.stringify([...s]));
  const sync = () => {
    const s = get();
    btn.textContent = s.has(chapterId) ? '⭐ Bookmarked' : '🔖 Bookmark';
  };
  sync();
  btn.addEventListener('click', () => {
    const s = get();
    if (s.has(chapterId)) s.delete(chapterId); else s.add(chapterId);
    set(s);
    sync();
  });
}
