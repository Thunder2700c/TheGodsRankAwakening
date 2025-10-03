// =========================
// Chapter.js - modern version
// =========================

// 1️⃣ Theme Toggle (works like shared.js)
const themeToggle = document.getElementById('themeToggle');

// Apply saved theme or default to light
document.body.classList.remove('light-mode', 'dark-mode');
document.body.classList.add(localStorage.getItem('theme') || 'light-mode');

// Update button icon/text
updateThemeButton(document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('light-mode')) {
      document.body.classList.replace('light-mode', 'dark-mode');
      localStorage.setItem('theme', 'dark-mode');
      updateThemeButton('dark-mode');
    } else {
      document.body.classList.replace('dark-mode', 'light-mode');
      localStorage.setItem('theme', 'light-mode');
      updateThemeButton('light-mode');
    }
  });
}

function updateThemeButton(mode) {
  const icon = themeToggle.querySelector('i');
  if (mode === 'dark-mode') {
    icon.className = 'fa-solid fa-sun';
    themeToggle.childNodes[1].nodeValue = ' Light Mode';
  } else {
    icon.className = 'fa-solid fa-moon';
    themeToggle.childNodes[1].nodeValue = ' Dark Mode';
  }
}

// 2️⃣ Optional: glow effect for <pre> blocks
const preBlocks = document.querySelectorAll('pre');
preBlocks.forEach(pre => {
  pre.addEventListener('mouseenter', () => pre.style.boxShadow = '0 0 40px #0ff inset, 0 0 30px #08f');
  pre.addEventListener('mouseleave', () => pre.style.boxShadow = '0 0 20px #0ff inset');
});

// 3️⃣ Optional: Chapter Navigation (Next / Previous)
const chapters = [
  { id: 1, title: "PROLOGUE", file: "1-prologue.html" },
  { id: 2, title: "EPILOGUE 1", file: "2-epilogue-1.html" },
  { id: 3, title: "THE DAY HELL OPENED", file: "3-the-day-hell-opened.html" },
  { id: 4, title: "AWAKENING THE ANCIENTS", file: "4-awakening-the-ancients.html" },
  { id: 5, title: "COMING SOON", file: "5-coming-soon.html" }
];

const currentFile = window.location.pathname.split("/").pop();
const currentIndex = chapters.findIndex(c => c.file === currentFile);

const prevBtn = document.getElementById("prevChapter");
const nextBtn = document.getElementById("nextChapter");

if (prevBtn) {
  prevBtn.disabled = currentIndex <= 0;
  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) window.location.href = chapters[currentIndex - 1].file;
  });
}

if (nextBtn) {
  nextBtn.disabled = currentIndex >= chapters.length - 1;
  nextBtn.addEventListener("click", () => {
    if (currentIndex < chapters.length - 1) window.location.href = chapters[currentIndex + 1].file;
  });
}
