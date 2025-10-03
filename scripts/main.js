const chapters = [
  { title:"PROLOGUE", file:"chapters/1-prologue.html" },
  { title:"EPILOGUE 1", file:"chapters/2-epilogue-1.html" },
  { title:"THE DAY HELL OPENED", file:"chapters/3-the-day-hell-opened.html" },
  { title:"AWAKENING THE ANCIENTS", file:"chapters/4-awakening-the-ancients.html" },
  { title:"COMING SOON", file:"chapters/5-coming-soon.html" }
];

document.addEventListener("DOMContentLoaded", ()=>{
  const grid = document.getElementById("chaptersGrid");
  if(!grid) return;
  grid.innerHTML="";
  
  chapters.forEach(ch=>{
    const card = document.createElement("a");
    card.classList.add("chapter-card");
    card.href = ch.file;
    card.innerHTML = `<h4>${ch.title}</h4><button class="btn">Read Chapter</button>`;
    grid.appendChild(card);
  });
});
