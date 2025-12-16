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
        // The actual play() will happen after the modal, but we set the flag.
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


    // Counter animation (The manual animation loop you had)
    function startLoader() {
        let counterElement = document.querySelector(".loader-counter");
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
    // CORE FUNCTION: PROCEED TO SITE (Unblocks the page)
    // ===================================================

    function proceedToSite() {
        
        // 1. Hide Music Modal immediately with animation
        gsap.to(musicModal, {
            duration: 0.4,
            opacity: 0,
            ease: "power2.in",
            onComplete: () => {
                musicModal.style.display = 'none';
            }
        });
        
        // 2. Hide the main loader wrapper immediately
        if (loaderWrapper) {
            gsap.to(loaderWrapper, {
                duration: 0.1,
                opacity: 0,
                pointerEvents: "none",
                zIndex: -1,
                onComplete: () => {
                    loaderWrapper.remove();
                }
            });
        }

        // 3. Show music toggle button
        gsap.to(musicToggle, {
            duration: 0.5,
            opacity: 1,
            scale: 1,
            ease: "back.out(1.7)",
            delay: 0.3,
            onStart: () => {
                musicToggle.classList.add('visible');
            }
        });

        // 4. Animate main content (as you had it)
        gsap.from(".hero-container", {
            duration: 1.2,
            y: 80,
            opacity: 0,
            ease: "power4.out",
            delay: 0.3
        });

        gsap.from(".floating-dock", {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: "power4.out",
            delay: 0.5
        });

        gsap.from(".theme-toggle", {
            duration: 0.8,
            scale: 0,
            opacity: 0,
            ease: "back.out(1.7)",
            delay: 0.7
        });
    }


    // ===================================================
    // GSAP TIMELINE (Epic Intro)
    // ===================================================
    
    // ... (Steps 1 through 8 of your GSAP timeline are here) ... 
    // ... (I omitted them for brevity, but they should remain the same as your previous working version) ...
    const loaderTimeline = gsap.timeline();

    // Step 1: Fade out counter
    loaderTimeline.to(".loader-counter", {
        duration: 0.5,
        opacity: 0,
        ease: "power2.out"
    }, 3.5);

    // Step 2: Slide bars up
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
    // ... (End of Steps 1 through 8) ...


    // Step 9: Glitchy entrance for Music Modal
    loaderTimeline.call(() => {
        // CRITICAL FIX: Move the modal outside the main document flow
        if (musicModal) {
            document.body.appendChild(musicModal);
            
            musicModal.style.visibility = 'visible';
            musicModal.style.opacity = '1';
            musicModal.style.zIndex = '999999';
            musicModal.classList.add('active');
        }

        const tl = gsap.timeline();
        
        // Background fade
        tl.to(musicModal, {
            duration: 0.3, opacity: 1, ease: "power2.out"
        })
        // Glitch effect on content
        .from(".music-modal-content", {
            duration: 0.1, x: -10, opacity: 0,
        })
        .to(".music-modal-content", {
            duration: 0.1, x: 10,
        })
        .to(".music-modal-content", {
            duration: 0.1, x: -5,
        })
        .to(".music-modal-content", {
            duration: 0.1, x: 0,
        })
        // Icon spins in
        .from(".music-icon", {
            duration: 0.6, scale: 0, rotation: 360, ease: "power4.out"
        }, "-=0.2")
        // Text glitches in
        .from(".music-title", {
            duration: 0.4, opacity: 0, skewX: 20, ease: "power4.out"
        })
        .from(".music-subtitle", {
            duration: 0.3, opacity: 0, ease: "power2.out"
        })
        // Buttons slide from sides
        .fromTo(".music-yes", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" })
        .fromTo(".music-no", { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, "-=0.4")
        .fromTo(".music-hint", { opacity: 0 }, { opacity: 1, duration: 0.3 });

    }, null, 7.2);


    // ===================================================
    // MUSIC CONSENT BUTTONS AND TOGGLE LOGIC
    // ===================================================

    // YES - Play music
    document.getElementById('musicYes')?.addEventListener('click', function() {
        musicEnabled = true;
        themeAudio.volume = 0.5;
        themeAudio.loop = true;
        themeAudio.play().catch(e => console.error("Audio play failed:", e));
        
        // Update both the state and the floating toggle icon
        musicToggle?.classList.add('playing');
        musicToggleIcon?.classList.remove('fa-volume-xmark');
        musicToggleIcon?.classList.add('fa-volume-high');
        
        localStorage.setItem('musicEnabled', 'true');
        proceedToSite();
    });

    // NO - Skip music
    document.getElementById('musicNo')?.addEventListener('click', function() {
        musicEnabled = false;
        themeAudio.pause(); // Ensure it is stopped if somehow running
        localStorage.setItem('musicEnabled', 'false');
        proceedToSite();
    });

    // FLOATING MUSIC TOGGLE (The logic you asked about)
    musicToggle?.addEventListener('click', function() {
        if (musicEnabled) {
            // Turn off
            themeAudio.pause();
            musicEnabled = false;
            musicToggle.classList.remove('playing');
            musicToggleIcon?.classList.remove('fa-volume-high');
            musicToggleIcon?.classList.add('fa-volume-xmark');
            localStorage.setItem('musicEnabled', 'false');
        } else {
            // Turn on
            themeAudio.play().catch(e => console.error("Audio play failed:", e));
            musicEnabled = true;
            musicToggle.classList.add('playing');
            musicToggleIcon?.classList.remove('fa-volume-xmark');
            musicToggleIcon?.classList.add('fa-volume-high');
            localStorage.setItem('musicEnabled', 'true');
        }
    });

    // KEYBOARD SHORTCUT (M to toggle music)
    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 'm' && musicToggle?.classList.contains('visible')) {
            musicToggle.click();
        }
    });

});
