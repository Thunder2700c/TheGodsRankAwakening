// scripts/main.js

// ==================
// Chapter Data
// ==================
const chapters = [
  { id: 1, title: "Prologue", file: "1-prologue.html", description: "The beginning of everything." },
  { id: 2, title: "Epilogue 1", file: "2-epilogue-1.html", description: "Shadows of the future." },
  { id: 3, title: "The Day Hell Opened", file: "3-the-day-hell-opened.html", description: "Chaos descends upon the world." },
  { id: 4, title: "Awakening the Ancient", file: "4-awakening-the-ancient.html", description: "A power long forgotten rises again." },
  { id: 5, title: "Coming Soon", file: "5-coming-soon.html", description: "The next chapter awaits..." }
];

// Elements
const homepage = document.getElementById("homepage");
const chapterView = document.getElementById("chapterView");
const chaptersGrid = document.getElementById("chaptersGrid");
const chapterTitle = document.getElementById("chapterTitle");
const chapterDescription = document.getElementById("chapterDescription");
const chapterContent = document.getElementById("chapterContent");
const backBtn = document.getElementById("backToChapters");
const prevBtn = document.getElementById("prevChapter");
const nextBtn = document.getElementById("nextChapter");
const currentChapterSpan = document.getElementById("currentChapter");
const totalChaptersSpan = document.getElementById("totalChapters");

let currentIndex = 0;

// ==================
// Render Chapters Grid
// ==================
function renderChapters() {
  chaptersGrid.innerHTML = "";
  chapters.forEach((ch, i) => {
    const card = document.createElement("div");
    card.className = "chapter-card";
    card.innerHTML = `
      <h4>${ch.title}</h4>
      <p>${ch.description}</p>
    `;
    card.addEventListener("click", () => loadChapter(i));
    chaptersGrid.appendChild(card);
  });
  totalChaptersSpan.textContent = chapters.length;
}

// ==================
// Load Chapter
// ==================
async function loadChapter(index) {
  currentIndex = index;
  const ch = chapters[index];

  try {
    const res = await fetch(`chapters/${ch.file}`);
    const html = await res.text();

    chapterTitle.textContent = ch.title;
    chapterDescription.textContent = ch.description;
    chapterContent.innerHTML = html;

    homepage.classList.remove("active");
    chapterView.classList.add("active");

    updateNav();
  } catch (err) {
    chapterContent.innerHTML = "<p style='color:red'>Error loading chapter.</p>";
  }
}

// ==================
// Navigation
// ==================
function updateNav() {
  currentChapterSpan.textContent = currentIndex + 1;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === chapters.length - 1;
}

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) loadChapter(currentIndex - 1);
});
nextBtn.addEventListener("click", () => {
  if (currentIndex < chapters.length - 1) loadChapter(currentIndex + 1);
});
backBtn.addEventListener("click", () => {
  homepage.classList.add("active");
  chapterView.classList.remove("active");
});

// ==================
// Init
// ==================
renderChapters();
