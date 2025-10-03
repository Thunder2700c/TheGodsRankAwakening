import { setupThemeToggle, setupBookmarks, chapterLinks } from './shared.js';

const meta = {
  id: detectIdFromPath(),
};

function detectIdFromPath() {
  const m = location.pathname.match(//chapters/(d+)-/);
  return m ? Number(m[1]) : null;
}

function bindPrevNext() {
  const prev = document.getElementById('prevLink');
  const next = document.getElementById('nextLink');
  const prevB = document.getElementById('prevLinkBottom');
  const nextB = document.getElementById('nextLinkBottom');

  const idx = chapterLinks.findIndex(c => c.id === meta.id);
  const prevCh = idx > 0 ? chapterLinks[idx - 1] : null;
  const nextCh = idx < chapterLinks.length - 1 ? chapterLinks[idx + 1] : null;

  [prev, prevB].forEach(a => {
    if (!a) return;
    if (prevCh) { a.href = prevCh.path; a.removeAttribute('aria-disabled'); }
    else { a.href = '#'; a.setAttribute('aria-disabled', 'true'); a.classList.add('outline'); }
  });
  [next, nextB].forEach(a => {
    if (!a) return;
    if (nextCh) { a.href = nextCh.path; a.removeAttribute('aria-disabled'); }
    else { a.href = '#'; a.setAttribute('aria-disabled', 'true'); }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && prevCh) location.href = prevCh.path;
    if (e.key === 'ArrowRight' && nextCh) location.href = nextCh.path;
    if (e.key === 'Escape') location.href = '/';
  });
}

function setupFontToggle() {
  const btn = document.getElementById('fontToggle');
  const content = document.querySelector('.chapter-content');
  if (!btn || !content) return;
  const key = `bc_font_${meta.id}`;
  const saved = localStorage.getItem(key);
  if (saved === 'large') content.classList.add('large');

  btn.addEventListener('click', () => {
    content.classList.toggle('large');
    localStorage.setItem(key, content.classList.contains('large') ? 'large' : 'normal');
  });
}

function init() {
  setupThemeToggle();
  setupBookmarks(meta.id);
  setupFontToggle();
  bindPrevNext();
}
document.addEventListener('DOMContentLoaded', init);
