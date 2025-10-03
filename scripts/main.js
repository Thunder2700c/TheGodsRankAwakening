// Chapters array
const chapters = [
  { title: "PROLOGUE", file: "chapters/1-prologue.html" },
  { title: "EPILOGUE 1", file: "chapters/2-epilogue-1.html" },
  { title: "THE DAY HELL OPENED", file: "chapters/3-the-day-hell-opened.html" },
  { title: "AWAKENING THE ANCIENTS", file: "chapters/4-awakening-the-ancients.html" },
  { title: "COMING SOON", file: "chapters/5-coming-soon.html" }
];

// Get the container to show chapters
const chaptersGrid = document.getElementById("chaptersGrid");

// Dynamically create chapter cards
chapters.forEach((ch, index) => {
  const card = document.createElement("div");
  card.classList.add("chapter-card");
  card.innerHTML = `
    <h4>${ch.title}</h4>
    <button class="btn btn--primary" onclick="window.location.href='${ch.file}'">
      Read Chapter
    </button>
  `;
  chaptersGrid.appendChild(card);
});
