document.addEventListener("DOMContentLoaded", () => {
    
    // ===================================================
    // LOADER ANIMATION - TGRA Epic Intro + Music
    // ===================================================

    // 1. SELECT ELEMENTS
    const themeAudio = document.getElementById('themeAudio');
    const musicModal = document.getElementById('musicModal');
    const musicToggle = document.getElementById('musicToggle');
    const musicToggleIcon = document.getElementById('musicToggleIcon');
    const loaderWrapper = document.getElementById("loaderWrapper");
    
    // Load initial music state from storage
    let musicEnabled = localStorage.getItem('musicEnabled') === 'true'; 
    
    // Apply saved state if music was previously enabled
    if (musicEnabled && themeAudio) {
        themeAudio.volume = 0.5;
        themeAudio.loop = true;
    }

    // Initialize toggle icon state based on saved preference
    if (musicToggleIcon) {
        if (musicEnabled) {
            musicToggleIcon.classList.remove('fa-volume-xmark');
            musicToggleIcon.classList.add('fa-volume-high');
            musicToggle?.classList.add('playing');
        } else {
            musicToggleIcon.classList.remove('fa-volume-high');
            musicToggleIcon.classList.add('fa-volume-xmark');
            musicToggle?.classList.remove('playing');
        }
    }

    // Counter animation
    function startLoader() {
        let counterElement = document.querySelector(".loader-counter");
        if (!counterElement) return;
        
        let currentValue = 0;

        function updateCounter() {
            if (currentValue === 100) return;

            currentValue += Math.floor(Math.random() * 10) + 1;
            if (currentValue > 100) currentValue = 100;

            counterElement.textContent = currentValue;

            let delay = Math.floor(Math.random() * 200) + 50;
            setTimeout(updateCounter, delay);
        }

        updateCounter();
    }

    startLoader();

    // ===================================================
    // EPIC EXIT ANIMATION - PROCEED TO SITE
    // ===================================================

    function proceedToSite() {
        
        const exitTl = gsap.timeline();
        
        // ===== PHASE 1: Buttons Split Apart =====
        exitTl.to(".music-yes", {
            duration: 0.4,
            x: -100,
            opacity: 0,
            ease: "power3.in"
        })
        .to(".music-no", {
            duration: 0.4,
            x: 100,
            opacity: 0,
            ease: "power3.in"
        }, "-=0.4")
        
        // ===== PHASE 2: Content Collapses Back to Line =====
        .to(".music-modal-content", {
            duration: 0.5,
            clipPath: "inset(0 50% 0 50%)",
            opacity: 0,
            ease: "power4.in"
        }, "-=0.2")
        
        // ===== PHASE 3: Glitch Out Background =====
        .to(musicModal, { duration: 0.1, opacity: 0.5 })
        .to(musicModal, { duration: 0.05, opacity: 0.8 })
        .to(musicModal, { duration: 0.1, opacity: 0.3 })
        .to(musicModal, { duration: 0.1, opacity: 0 })
        
        // ===== PHASE 4: Cleanup =====
        .call(() => {
            if (musicModal) {
                musicModal.style.visibility = 'hidden';
                musicModal.style.display = 'none';
            }
            
            if (loaderWrapper) {
                loaderWrapper.remove();
            }
        })
        
        // ===== PHASE 5: Reveal Main Content =====
        .from(".hero-container", {
            duration: 1.2,
            y: 80,
            opacity: 0,
            ease: "power4.out"
        }, "-=0.3")
        
        .from(".floating-dock", {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: "power4.out"
        }, "-=0.9")
        
        .from(".theme-toggle", {
            duration: 0.8,
            scale: 0,
            opacity: 0,
            ease: "back.out(1.7)"
        }, "-=0.7")
        
        // ===== PHASE 6: Show Music Toggle =====
        .call(() => {
            if (musicToggle) {
                musicToggle.classList.add('visible');
                gsap.fromTo(musicToggle, 
                    { scale: 0, opacity: 0 },
                    { 
                        duration: 0.5, 
                        scale: 1, 
                        opacity: 1, 
                        ease: "back.out(1.7)" 
                    }
                );
            }
        }, null, "-=0.5");
    }

    // ===================================================
    // GSAP TIMELINE - EPIC INTRO
    // ===================================================
    
    const loaderTimeline = gsap.timeline();

    // Step 1: Fade out counter
    loaderTimeline.to(".loader-counter", {
        duration: 0.5,
        opacity: 0,
        ease: "power2.out"
    }, 3.5);

    // Step 2: Slide bars up from edges
    loaderTimeline.to(".loader-bar", {
        duration: 1,
        y: "-100%",
        stagger: {
            amount: 0.4,
            from: "edges"
        },
        ease: "power4.inOut"
    }, 3.5);

    // Step 3: Show logo reveal
    loaderTimeline.to(".loader-logo-reveal", {
        duration: 0.5,
        opacity: 1,
        ease: "power2.inOut"
    }, 4.3);

    // Step 4: Divider grows
    loaderTimeline.to(".logo-divider", {
        duration: 0.8,
        height: "60%",
        ease: "power4.out"
    }, 4.5);

    // Step 5: Letters animate in
    loaderTimeline.from(".logo-left span", {
        duration: 0.8,
        x: 100,
        opacity: 0,
        ease: "power4.out"
    }, 4.6);

    loaderTimeline.from(".logo-right span", {
        duration: 0.8,
        x: -100,
        opacity: 0,
        ease: "power4.out"
    }, 4.6);

    // Step 6: Divider shrinks
    loaderTimeline.to(".logo-divider", {
        duration: 0.6,
        height: "0%",
        ease: "power4.in"
    }, 5.8);

    // Step 7: Split TG | RA
    loaderTimeline.to(".logo-left", {
        duration: 1,
        x: "-100%",
        ease: "power4.inOut"
    }, 6.2);

    loaderTimeline.to(".logo-right", {
        duration: 1,
        x: "100%",
        ease: "power4.inOut"
    }, 6.2);

    // Step 8: Fade out logo reveal
    loaderTimeline.to(".loader-logo-reveal", {
        duration: 0.5,
        opacity: 0,
        ease: "power2.inOut"
    }, 6.8);

    // ===================================================
    // Step 9: EPIC MUSIC MODAL ANIMATION
    // Glitch Background + Split Reveal + Staggered Content
    // ===================================================
    
    loaderTimeline.call(() => {
        if (!musicModal) return;
        
        // Move modal to body root for proper z-index
        document.body.appendChild(musicModal);
        
        // Prepare modal
        musicModal.style.visibility = 'visible';
        musicModal.style.zIndex = '999999';
        musicModal.classList.add('active');
        
        // Set initial state for clip-path animation
        gsap.set(".music-modal-content", {
            clipPath: "inset(0 50% 0 50%)",
            opacity: 0
        });
        
        const modalTl = gsap.timeline();
        
        // ===== PHASE 1: Glitch Background Entry =====
        modalTl.to(musicModal, { duration: 0.1, opacity: 0.3 })
        .to(musicModal, { duration: 0.05, opacity: 0 })
        .to(musicModal, { duration: 0.1, opacity: 0.6 })
        .to(musicModal, { duration: 0.05, opacity: 0.2 })
        .to(musicModal, { duration: 0.1, opacity: 1 })
        
        // ===== PHASE 2: Split Reveal on Content =====
        .to(".music-modal-content", {
            duration: 0.8,
            clipPath: "inset(0 0% 0 0%)",
            opacity: 1,
            ease: "power4.out"
        })
        
        // ===== PHASE 3: Staggered Content Reveal =====
        
        // Icon pops with rotation
        .from(".music-icon", {
            duration: 0.6,
            scale: 0,
            rotation: -180,
            ease: "back.out(1.7)"
        }, "-=0.3")
        
        // Title glitches in
        .from(".music-title", {
            duration: 0.1,
            opacity: 0,
            x: -10,
        }, "-=0.2")
        .to(".music-title", {
            duration: 0.05,
            x: 10,
        })
        .to(".music-title", {
            duration: 0.05,
            x: -5,
        })
        .to(".music-title", {
            duration: 0.1,
            x: 0,
        })
        
        // Subtitle fades up
        .from(".music-subtitle", {
            duration: 0.4,
            y: 15,
            opacity: 0,
            ease: "power3.out"
        }, "-=0.1")
        
        // Buttons split from center (like TG | RA)
        .from(".music-yes", {
            duration: 0.6,
            x: 50,
            opacity: 0,
            ease: "power4.out"
        }, "-=0.2")
        .from(".music-no", {
            duration: 0.6,
            x: -50,
            opacity: 0,
            ease: "power4.out"
        }, "-=0.5")
        
        // Hint fades in last
        .from(".music-hint", {
            duration: 0.4,
            opacity: 0,
            y: 10,
            ease: "power2.out"
        }, "-=0.2");

    }, null, 7.2);

    // ===================================================
    // MUSIC CONSENT BUTTONS
    // ===================================================

    // YES - Play music
    document.getElementById('musicYes')?.addEventListener('click', function() {
        musicEnabled = true;
        
        if (themeAudio) {
            themeAudio.volume = 0.5;
            themeAudio.loop = true;
            themeAudio.play().catch(e => console.error("Audio play failed:", e));
        }
        
        musicToggle?.classList.add('playing');
        musicToggleIcon?.classList.remove('fa-volume-xmark');
        musicToggleIcon?.classList.add('fa-volume-high');
        
        localStorage.setItem('musicEnabled', 'true');
        proceedToSite();
    });

    // NO - Skip music
    document.getElementById('musicNo')?.addEventListener('click', function() {
        musicEnabled = false;
        
        if (themeAudio) {
            themeAudio.pause();
        }
        
        localStorage.setItem('musicEnabled', 'false');
        proceedToSite();
    });

    // ===================================================
    // FLOATING MUSIC TOGGLE
    // ===================================================

    musicToggle?.addEventListener('click', function() {
        if (musicEnabled) {
            // Turn off
            themeAudio?.pause();
            musicEnabled = false;
            musicToggle.classList.remove('playing');
            musicToggleIcon?.classList.remove('fa-volume-high');
            musicToggleIcon?.classList.add('fa-volume-xmark');
            localStorage.setItem('musicEnabled', 'false');
        } else {
            // Turn on
            themeAudio?.play().catch(e => console.error("Audio play failed:", e));
            musicEnabled = true;
            musicToggle.classList.add('playing');
            musicToggleIcon?.classList.remove('fa-volume-xmark');
            musicToggleIcon?.classList.add('fa-volume-high');
            localStorage.setItem('musicEnabled', 'true');
        }
    });

    // ===================================================
    // KEYBOARD SHORTCUT (M to toggle music)
    // ===================================================

    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 'm' && musicToggle?.classList.contains('visible')) {
            musicToggle.click();
        }
    });

});
