const chapters = [
  { id: 1, title: "PROLOGUE", file: "chapters/1-prologue.html" },
  { id: 2, title: "EPILOGUE 1", file: "chapters/2-epilogue-1.html" },
  { id: 3, title: "THE DAY HELL OPENED", file: "chapters/3-the-day-hell-opened.html" },
  { id: 4, title: "AWAKENING THE ANCIENTS", file: "chapters/4-awakening-the-ancients.html" },
  { id: 5, title: "COMING SOON", file: "chapters/5-coming-soon.html" }
];

const chaptersGrid = document.getElementById('chaptersGrid');

chapters.forEach(ch => {
  const card = document.createElement('a');
  card.href = ch.file;
  card.className = 'chapter-card';
  card.textContent = ch.title;
  chaptersGrid.appendChild(card);
});
