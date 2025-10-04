document.addEventListener('DOMContentLoaded', () => {
  const chapters = [
    { title: "Prologue", file: "1-prologue.html" },
    { title: "Epilogue I", file: "2-epilogue-1.html" },
    { title: "The Day Hell Opened", file: "3-the-day-hell-opened.html" },
    { title: "Awakening the Ancients", file: "4-awakening-the-ancients.html" },
    { title: "Coming Soon...", file: "5-coming-soon.html" }
  ];

  const grid = document.getElementById('chaptersGrid');

  chapters.forEach(chap => {
    const link = document.createElement('a');
    link.href = `chapters/${chap.file}`;
    link.className = 'chapter-card';
    link.textContent = chap.title;
    grid.appendChild(link);
  });
});
