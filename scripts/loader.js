document.addEventListener("DOMContentLoaded", () => {
  
  // ===================================================
  // LOADER COOLDOWN CHECK (2 hours or new session)
  // ===================================================
  
  const tgraLoader = document.getElementById('tgraLoader');
  const terminalModal = document.getElementById('terminalModal');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeAudio = document.getElementById('themeAudio');
  
  let musicEnabled = localStorage.getItem('musicEnabled') === 'true';
  
  // Cooldown settings
  const COOLDOWN_HOURS = 2;
  const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000;
  
  function shouldShowLoader() {
    const sessionVisited = sessionStorage.getItem('tgra-visited');
    const lastVisit = localStorage.getItem('tgra-last-visit');
    const now = Date.now();
    
    // Already visited in this session
    if (sessionVisited) return false;
    
    // Within cooldown period
    if (lastVisit && (now - parseInt(lastVisit)) < COOLDOWN_MS) {
      return false;
    }
    
    return true;
  }
  
  function markAsVisited() {
    sessionStorage.setItem('tgra-visited', 'true');
    localStorage.setItem('tgra-last-visit', Date.now().toString());
  }
  
  function skipLoader() {
    // Hide loader elements
    if (tgraLoader) tgraLoader.style.display = 'none';
    if (terminalModal) terminalModal.style.display = 'none';
    
    // Show site
    document.body.classList.add('gsap-loaded');
    
    // Show and setup toggles
    showToggles();
    initThemeToggle();
    initMusicToggle();
    
    // Auto-play music if enabled
    if (musicEnabled && themeAudio) {
      themeAudio.volume = 0.5;
      themeAudio.play().catch(e => console.log("Audio autoplay prevented"));
    }
  }
  
  // ===================================================
  // CHECK: Show loader or skip?
  // ===================================================
  
  if (!tgraLoader || !shouldShowLoader()) {
    skipLoader();
    return;
  }
  
  markAsVisited();

  // ===================================================
  // BACKGROUND PARTICLES
  // ===================================================
  
  const bgParticles = document.getElementById('bgParticles');
  const loaderTerminal = document.getElementById('loaderTerminal');
  const terminalLines = document.getElementById('terminalLines');
  const asciiLogo = document.getElementById('asciiLogo');
  const terminalProgress = document.getElementById('terminalProgress');
  const progressBarFill = document.getElementById('progressBarFill');
  const progressPercent = document.getElementById('progressPercent');
  const tgraLogo = document.getElementById('tgraLogo');
  const musicTerminal = document.getElementById('musicTerminal');
  const musicLine1 = document.getElementById('musicLine1');
  const musicLine2 = document.getElementById('musicLine2');
  const musicLine3 = document.getElementById('musicLine3');
  const musicInputLine = document.getElementById('musicInputLine');
  const terminalYes = document.getElementById('terminalYes');
  const terminalNo = document.getElementById('terminalNo');
  
  function createBackgroundParticles() {
    if (!bgParticles) return;
    
    const chars = ['0', '1', '{', '}', '<', '>', '/', '*', '#', '@', '$', '%', '&'];
    
    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      particle.className = 'bg-particle';
      particle.textContent = chars[Math.floor(Math.random() * chars.length)];
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 20}s`;
      particle.style.animationDuration = `${15 + Math.random() * 15}s`;
      particle.style.fontSize = `${10 + Math.random() * 8}px`;
      bgParticles.appendChild(particle);
    }
  }
  
  createBackgroundParticles();

  // ===================================================
  // TERMINAL BOOT SEQUENCE
  // ===================================================
  
  const bootMessages = [
    { text: "Initializing TGRA systems...", class: "info", delay: 0 },
    { text: "Loading core modules... ", class: "", delay: 400 },
    { text: "[OK] Kernel loaded", class: "success", delay: 300 },
    { text: "[OK] Memory allocated", class: "success", delay: 200 },
    { text: "Connecting to multiverse gateway...", class: "purple", delay: 500 },
    { text: "[OK] Connection established", class: "success", delay: 400 },
    { text: "Fetching chapter data...", class: "info", delay: 300 },
    { text: "[OK] 5 chapters found", class: "success", delay: 200 },
    { text: "Preparing immersive experience...", class: "warning", delay: 400 },
  ];

  let currentLine = 0;

  function startBootSequence() {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    
    tl.to(asciiLogo, { opacity: 1, duration: 0.8 });
    tl.to(terminalProgress, { opacity: 1, duration: 0.5 }, "-=0.3");
    tl.call(() => animateProgress());
    tl.call(() => typeBootMessages(), null, "+=0.3");
    tl.to('.terminal-cursor-line', { opacity: 1, duration: 0.3 }, "+=0.2");
  }

  function typeBootMessages() {
    if (currentLine >= bootMessages.length) return;
    
    const msg = bootMessages[currentLine];
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `
      <span class="prompt">$</span>
      <span class="text ${msg.class}"></span>
    `;
    
    terminalLines.appendChild(line);
    gsap.to(line, { opacity: 1, duration: 0.15, ease: "power1.out" });
    
    const textSpan = line.querySelector('.text');
    typeText(textSpan, msg.text, () => {
      currentLine++;
      setTimeout(typeBootMessages, msg.delay);
    });
  }

  function typeText(element, text, callback) {
    let i = 0;
    const speed = 25;
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    }
    type();
  }

  // ===================================================
  // PROGRESS ANIMATION
  // ===================================================
  
  function animateProgress() {
    gsap.to({ value: 0 }, {
      value: 100,
      duration: 4.5,
      ease: "power1.inOut",
      onUpdate: function() {
        const progressValue = Math.round(this.targets()[0].value);
        if (progressPercent) progressPercent.textContent = `${progressValue}%`;
        if (progressBarFill) progressBarFill.style.width = `${this.targets()[0].value}%`;
      },
      onComplete: () => {
        const completeLine = document.createElement('div');
        completeLine.className = 'terminal-line';
        completeLine.innerHTML = `
          <span class="prompt">$</span>
          <span class="text success">[COMPLETE] System ready. Launching...</span>
        `;
        terminalLines.appendChild(completeLine);
        gsap.to(completeLine, { opacity: 1, duration: 0.3, ease: "power2.out" });
        setTimeout(transitionToMusicModal, 1000);
      }
    });
  }

  setTimeout(startBootSequence, 600);

  // ===================================================
  // TRANSITION TO MUSIC MODAL
  // ===================================================
  
  function transitionToMusicModal() {
    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    
    tl.to(loaderTerminal, {
      x: "random(-3, 3)",
      duration: 0.03,
      repeat: 6,
      yoyo: true,
      ease: "none"
    });
    
    tl.to(loaderTerminal, {
      opacity: 0,
      scale: 0.97,
      y: -20,
      duration: 0.7,
      ease: "power2.inOut"
    });
    
    tl.to('.loader-bg', { opacity: 0, duration: 0.5 }, "-=0.4");
    tl.set(tgraLoader, { display: 'none' });
    
    tl.call(() => terminalModal.classList.add('active'));
    tl.to(terminalModal, { opacity: 1, duration: 0.5, ease: "power2.out" });
    
    tl.to(tgraLogo, { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.4)" });
    
    tl.fromTo('.logo-left', 
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      "-=0.5"
    );
    
    tl.fromTo('.logo-right',
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      "-=0.6"
    );
    
    tl.fromTo('.logo-divider',
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
      "-=0.4"
    );
    
    tl.to(musicTerminal, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.2)"
    });
    
    tl.to(musicLine1, { opacity: 1, duration: 0.15 });
    tl.call(() => typeText(musicLine1.querySelector('.text'), "Audio subsystem initialized."));
    
    tl.to(musicLine2, { opacity: 1, duration: 0.15 }, "+=0.7");
    tl.call(() => typeText(musicLine2.querySelector('.text'), "Background music available."));
    
    tl.to(musicLine3, { opacity: 1, duration: 0.15 }, "+=0.7");
    tl.call(() => {
      typeText(musicLine3.querySelector('.text'), "Enhance your experience?", () => {
        gsap.to(musicInputLine, { opacity: 1, duration: 0.4, delay: 0.4, ease: "power2.out" });
      });
    });
  }

  // ===================================================
  // MUSIC CHOICE HANDLERS
  // ===================================================
  
  function handleMusicChoice(enableMusic) {
    musicEnabled = enableMusic;
    localStorage.setItem('musicEnabled', enableMusic ? 'true' : 'false');
    
    gsap.to(musicInputLine, { opacity: 0, duration: 0.3, ease: "power2.out" });
    
    const response = document.createElement('div');
    response.className = 'terminal-line';
    response.style.opacity = '0';
    response.innerHTML = `
      <span class="prompt">></span>
      <span class="text" style="color: ${enableMusic ? 'var(--terminal-green)' : 'var(--terminal-red)'}">
        ${enableMusic ? '[Y] Audio enabled. Enjoy the experience! ♪' : '[N] Continuing in silent mode.'}
      </span>
    `;
    
    musicTerminal.querySelector('.terminal-body').appendChild(response);
    gsap.to(response, { opacity: 1, duration: 0.4, delay: 0.2, ease: "power2.out" });
    
    if (enableMusic && themeAudio) {
      themeAudio.volume = 0.5;
      themeAudio.play().catch(e => console.log("Audio play prevented:", e));
    }
    
    setTimeout(revealSite, 1200);
  }
  
  terminalYes?.addEventListener('click', () => handleMusicChoice(true));
  terminalNo?.addEventListener('click', () => handleMusicChoice(false));

  // ===================================================
  // REVEAL MAIN SITE
  // ===================================================
  
  function revealSite() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    tl.to(terminalModal, { opacity: 0, duration: 0.6, ease: "power2.inOut" });
    
    tl.call(() => {
      terminalModal.style.display = 'none';
      document.body.classList.add('gsap-loaded');
    });
    
    tl.fromTo(".hero-image-wrapper", 
      { opacity: 0, y: 40, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 1 }
    );
    
    tl.fromTo(".hero-title",
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.7"
    );
    
    tl.fromTo(".hero-description",
      { opacity: 0, y: 20 },
      { opacity: 0.7, y: 0, duration: 0.7 },
      "-=0.5"
    );
    
    tl.fromTo(".search-wrapper",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.4"
    );
    
    tl.fromTo(".cast-section",
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.7 },
      "-=0.3"
    );
    
    tl.fromTo(".floating-dock",
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" },
      "-=0.3"
    );
    
    tl.call(() => {
      showToggles();
      initThemeToggle();
      initMusicToggle();
    });
    
    tl.fromTo(".chapter-card",
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
      "-=0.4"
    );
  }

  // ===================================================
  // SHOW TOGGLES
  // ===================================================
  
  function showToggles() {
    if (musicToggle) {
      musicToggle.classList.add('visible');
      gsap.fromTo(musicToggle,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
      
      if (musicEnabled) {
        musicToggle.classList.add('playing');
        musicIcon?.classList.remove('fa-volume-xmark');
        musicIcon?.classList.add('fa-volume-high');
      }
    }
    
    if (themeToggle) {
      themeToggle.classList.add('visible');
      gsap.fromTo(themeToggle,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, delay: 0.1, ease: "back.out(1.7)" }
      );
    }
  }

  // ===================================================
  // THEME TOGGLE
  // ===================================================
  
  function initThemeToggle() {
    if (!themeToggle) return;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
      updateThemeIcon(true);
    }
    
    themeToggle.addEventListener('click', function() {
      const isLight = document.body.classList.toggle('light-mode');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      updateThemeIcon(isLight);
      
      gsap.fromTo(themeIcon,
        { rotation: 0, scale: 0.5 },
        { rotation: 360, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    });
  }
  
  function updateThemeIcon(isLight) {
    if (!themeIcon) return;
    if (isLight) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  }

  // ===================================================
  // MUSIC TOGGLE
  // ===================================================
  
  function initMusicToggle() {
    if (!musicToggle) return;
    
    musicToggle.addEventListener('click', function() {
      if (musicEnabled) {
        themeAudio?.pause();
        musicEnabled = false;
        this.classList.remove('playing');
        musicIcon?.classList.remove('fa-volume-high');
        musicIcon?.classList.add('fa-volume-xmark');
        
        gsap.to(this, {
          scale: 0.9,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });
      } else {
        if (themeAudio) {
          themeAudio.volume = 0.5;
          themeAudio.play().catch(e => console.log("Audio play prevented:", e));
        }
        musicEnabled = true;
        this.classList.add('playing');
        musicIcon?.classList.remove('fa-volume-xmark');
        musicIcon?.classList.add('fa-volume-high');
        
        gsap.to(this, {
          scale: 1.1,
          duration: 0.15,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });
      }
      localStorage.setItem('musicEnabled', musicEnabled ? 'true' : 'false');
    });
  }

  // ===================================================
  // KEYBOARD SHORTCUTS
  // ===================================================
  
  document.addEventListener('keydown', function(e) {
    if (e.key.toLowerCase() === 'm' && musicToggle?.classList.contains('visible')) {
      musicToggle.click();
    }
    if (e.key.toLowerCase() === 'd' && themeToggle?.classList.contains('visible')) {
      themeToggle.click();
    }
  });

});
