document.addEventListener('DOMContentLoaded', () => {
  const chapters = [
    { title: "Prologue: Defiant Stand", file: "1-prologue.html", teaser: "No way in hell... Aditya's roar against Kanasura's spear.", date: "Oct 21, 2120" },
    { title: "Epilogue I: Tea & Revelations", file: "2-epilogue-1.html", teaser: "Quiet moments shatter with Venta's cosmic truth.", date: "TBA" },
    { title: "The Day Hell Opened", file: "3-the-day-hell-opened.html", teaser: "Portals ignite—timeline fractures in hell's fury.", date: "TBA" },
    { title: "Awakening the Ancients", file: "4-awakening-the-ancients.html", teaser: "God-ranks stir from eons of slumber.", date: "TBA" },
    { title: "Coming Soon...", file: "5-coming-soon.html", teaser: "The rank wars escalate—teaser drops weekly!", date: "Soon™" }
  ];

  const grid = document.getElementById('chaptersGrid');
  if (!grid) {
    console.error('Chapters grid not found—check index.html');
    return;
  }

  chapters.forEach(chap => {
    const link = document.createElement('a');
    link.href = `chapters/${chap.file}`;
    link.className = 'chapter-card';
    link.innerHTML = `
      <h3>${chap.title}</h3>
      <p class="teaser">${chap.teaser}</p>
      <small class="date">${chap.date}</small>
    `;
    link.addEventListener('error', () => console.warn(`Chapter ${chap.title} not found—update array?`));
    grid.appendChild(link);
  });

  const moreLink = document.createElement('a');
  moreLink.href = '#';
  moreLink.className = 'chapter-card upcoming';
  moreLink.innerHTML = '<h3>More Chapters Incoming</h3><p>Subscribe for alerts!</p>';
  moreLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Follow @Thunder2700c on X for drops!');
  });
  grid.appendChild(moreLink);
});
