document.addEventListener("DOMContentLoaded", () => {
  
  // ===================================================
  // TGRA TERMINAL LOADER
  // Hacker/Console Style Loading Screen
  // ===================================================

  // === ELEMENTS ===
  const tgraLoader = document.getElementById('tgraLoader');
  const loaderTerminal = document.getElementById('loaderTerminal');
  const terminalBody = document.getElementById('terminalBody');
  const terminalLines = document.getElementById('terminalLines');
  const asciiLogo = document.getElementById('asciiLogo');
  const terminalProgress = document.getElementById('terminalProgress');
  const progressBarFill = document.getElementById('progressBarFill');
  const progressPercent = document.getElementById('progressPercent');
  const bgParticles = document.getElementById('bgParticles');
  
  const terminalModal = document.getElementById('terminalModal');
  const tgraLogo = document.getElementById('tgraLogo');
  const musicTerminal = document.getElementById('musicTerminal');
  const musicLine1 = document.getElementById('musicLine1');
  const musicLine2 = document.getElementById('musicLine2');
  const musicLine3 = document.getElementById('musicLine3');
  const musicInputLine = document.getElementById('musicInputLine');
  const terminalYes = document.getElementById('terminalYes');
  const terminalNo = document.getElementById('terminalNo');
  
  const sunReveal = document.getElementById('sunReveal');
  const sunCore = document.getElementById('sunCore');
  const sunFlash = document.getElementById('sunFlash');
  
  const themeAudio = document.getElementById('themeAudio');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  
  // Exit if no loader
  if (!tgraLoader) {
    document.body.classList.add('gsap-loaded');
    return;
  }

  let musicEnabled = localStorage.getItem('musicEnabled') === 'true';

  // ===================================================
  // BACKGROUND PARTICLES (Matrix-style characters)
  // ===================================================
  
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
  let progressValue = 0;

  // Start boot sequence
  function startBootSequence() {
    const tl = gsap.timeline();
    
    // Fade in ASCII logo first
    tl.to(asciiLogo, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    });
    
    // Then show progress bar
    tl.to(terminalProgress, {
      opacity: 1,
      duration: 0.3
    }, "+=0.3");
    
    // Start progress animation
    tl.call(() => {
      animateProgress();
    });
    
    // Start typing boot messages
    tl.call(() => {
      typeBootMessages();
    }, null, "+=0.5");
    
    // Show cursor line
    tl.to('.terminal-cursor-line', {
      opacity: 1,
      duration: 0.3
    }, "+=0.3");
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
    
    // Animate line appearing
    gsap.to(line, {
      opacity: 1,
      duration: 0.1
    });
    
    // Type text
    const textSpan = line.querySelector('.text');
    typeText(textSpan, msg.text, () => {
      currentLine++;
      setTimeout(typeBootMessages, msg.delay);
    });
  }

  function typeText(element, text, callback) {
    let i = 0;
    const speed = 20;
    
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
      duration: 4,
      ease: "power1.inOut",
      onUpdate: function() {
        progressValue = Math.round(this.targets()[0].value);
        
        if (progressPercent) {
          progressPercent.textContent = `${progressValue}%`;
        }
        
        if (progressBarFill) {
          progressBarFill.style.width = `${progressValue}%`;
        }
      },
      onComplete: () => {
        // Add completion message
        const completeLine = document.createElement('div');
        completeLine.className = 'terminal-line';
        completeLine.innerHTML = `
          <span class="prompt">$</span>
          <span class="text success">[COMPLETE] System ready. Launching...</span>
        `;
        terminalLines.appendChild(completeLine);
        gsap.to(completeLine, { opacity: 1, duration: 0.2 });
        
        // Transition after short delay
        setTimeout(transitionToMusicModal, 800);
      }
    });
  }

  // Start the sequence
  setTimeout(startBootSequence, 500);

  // ===================================================
  // TRANSITION: LOADER → MUSIC MODAL
  // ===================================================
  
  function transitionToMusicModal() {
    const tl = gsap.timeline();
    
    // Glitch effect on terminal
    tl.to(loaderTerminal, {
      x: "random(-5, 5)",
      duration: 0.05,
      repeat: 5,
      yoyo: true
    });
    
    // Fade out loader terminal
    tl.to(loaderTerminal, {
      opacity: 0,
      scale: 0.95,
      y: -30,
      duration: 0.5,
      ease: "power2.in"
    });
    
    // Fade out background
    tl.to('.loader-bg', {
      opacity: 0,
      duration: 0.4
    }, "-=0.3");
    
    // Hide loader
    tl.set(tgraLoader, { display: 'none' });
    
    // Show music modal
    tl.call(() => {
      terminalModal.classList.add('active');
    });
    
    tl.to(terminalModal, {
      opacity: 1,
      duration: 0.4
    });
    
    // Logo animates in
    tl.to(tgraLogo, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)"
    });
    
    // Logo parts split in
    tl.fromTo('.logo-left', 
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      "-=0.3"
    );
    
    tl.fromTo('.logo-right',
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      "-=0.5"
    );
    
    tl.fromTo('.logo-divider',
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 0.3, ease: "power2.out" },
      "-=0.3"
    );
    
    // Music terminal appears
    tl.to(musicTerminal, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.5)"
    });
    
    // Type terminal lines
    tl.to(musicLine1, { opacity: 1, duration: 0.1 });
    tl.call(() => {
      typeText(musicLine1.querySelector('.text'), "Audio subsystem initialized.");
    });
    
    tl.to(musicLine2, { opacity: 1, duration: 0.1 }, "+=0.6");
    tl.call(() => {
      typeText(musicLine2.querySelector('.text'), "Background music available.");
    });
    
    tl.to(musicLine3, { opacity: 1, duration: 0.1 }, "+=0.6");
    tl.call(() => {
      typeText(musicLine3.querySelector('.text'), "Enhance your experience?", () => {
        // Show input line after typing
        gsap.to(musicInputLine, { opacity: 1, duration: 0.3, delay: 0.3 });
      });
    });
  }

  // ===================================================
  // MUSIC CHOICE HANDLERS
  // ===================================================
  
  function handleMusicChoice(enableMusic) {
    musicEnabled = enableMusic;
    localStorage.setItem('musicEnabled', enableMusic ? 'true' : 'false');
    
    // Hide input line
    gsap.to(musicInputLine, { opacity: 0, duration: 0.2 });
    
    // Add response line
    const response = document.createElement('div');
    response.className = 'terminal-line';
    response.style.opacity = '0';
    response.innerHTML = `
      <span class="prompt">></span>
      <span class="text ${enableMusic ? 'success' : ''}" style="color: ${enableMusic ? 'var(--terminal-green)' : 'var(--terminal-red)'}">
        ${enableMusic ? '[Y] Audio enabled. Enjoy the experience! ♪' : '[N] Continuing in silent mode.'}
      </span>
    `;
    
    musicTerminal.querySelector('.terminal-body').appendChild(response);
    gsap.to(response, { opacity: 1, duration: 0.3, delay: 0.2 });
    
    // Start audio if enabled
    if (enableMusic && themeAudio) {
      themeAudio.volume = 0.5;
      themeAudio.play().catch(e => console.log("Audio blocked:", e));
      musicToggle?.classList.add('playing');
      musicIcon?.classList.remove('fa-volume-xmark');
      musicIcon?.classList.add('fa-volume-high');
    }
    
    // Trigger sun reveal
    setTimeout(triggerSunReveal, 1200);
  }
  
  terminalYes?.addEventListener('click', () => handleMusicChoice(true));
  terminalNo?.addEventListener('click', () => handleMusicChoice(false));

  // ===================================================
  // SUN RAY REVEAL (Green/Terminal themed)
  // ===================================================
  
  function triggerSunReveal() {
    const tl = gsap.timeline();
    
    // Fade out modal
    tl.to(terminalModal, {
      opacity: 0,
      duration: 0.4
    });
    
    tl.set(terminalModal, { display: 'none' });
    
    // Show sun reveal
    tl.call(() => {
      sunReveal.classList.add('active');
    });
    
    tl.to(sunReveal, { opacity: 1, duration: 0.1 });
    
    // Sun core expands
    tl.to(sunCore, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
    
    // Rays shoot out
    tl.to('.ray', {
      opacity: 1,
      duration: 0.05,
      stagger: {
        each: 0.02,
        from: "random"
      }
    });
    
    tl.to('.ray', {
      scaleX: 1.5,
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.1");
    
    // Flash
    tl.to(sunFlash, {
      opacity: 1,
      duration: 0.2,
      ease: "power2.in"
    });
    
    // Core expands massively
    tl.to(sunCore, {
      scale: 60,
      duration: 0.6,
      ease: "power2.in"
    }, "-=0.1");
    
    // Fade out
    tl.to(sunReveal, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
    
    // Cleanup and reveal site
    tl.call(() => {
      sunReveal.remove();
      document.body.classList.add('gsap-loaded');
      revealMainSite();
    });
  }

  // ===================================================
  // REVEAL MAIN SITE
  // ===================================================
  
  function revealMainSite() {
    const tl = gsap.timeline();
    
    tl.fromTo(".hero-image-wrapper", 
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
    );
    
    tl.fromTo(".hero-title",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.5"
    );
    
    tl.fromTo(".hero-description",
      { opacity: 0, y: 20 },
      { opacity: 0.7, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );
    
    tl.fromTo(".search-wrapper",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.3"
    );
    
    tl.fromTo(".cast-section",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.2"
    );
    
    tl.fromTo(".floating-dock",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" },
      "-=0.2"
    );
    
    // Show music toggle
    tl.call(() => {
      if (musicToggle) {
        musicToggle.classList.add('visible');
        if (musicEnabled) {
          musicToggle.classList.add('playing');
        }
      }
    });
    
    // Stagger chapter cards
    tl.fromTo(".chapter-card",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" },
      "-=0.3"
    );
  }

  // ===================================================
  // MUSIC TOGGLE
  // ===================================================
  
  musicToggle?.addEventListener('click', function() {
    if (musicEnabled) {
      themeAudio?.pause();
      musicEnabled = false;
      this.classList.remove('playing');
      musicIcon?.classList.remove('fa-volume-high');
      musicIcon?.classList.add('fa-volume-xmark');
    } else {
      themeAudio?.play().catch(e => console.log("Audio blocked:", e));
      musicEnabled = true;
      this.classList.add('playing');
      musicIcon?.classList.remove('fa-volume-xmark');
      musicIcon?.classList.add('fa-volume-high');
    }
    localStorage.setItem('musicEnabled', musicEnabled ? 'true' : 'false');
  });
  
  // Keyboard shortcut
  document.addEventListener('keydown', function(e) {
    if (e.key.toLowerCase() === 'm' && musicToggle?.classList.contains('visible')) {
      musicToggle.click();
    }
  });

});
