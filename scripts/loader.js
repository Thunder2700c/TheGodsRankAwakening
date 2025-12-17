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
    const counterElement = document.querySelector(".loader-counter");
    
    // If no loader, exit early (for pages without loader)
    if (!loaderWrapper) {
        document.body.classList.add('gsap-loaded');
        return;
    }
    
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

    // ===================================================
    // COUNTER ANIMATION (0 → 100)
    // ===================================================
    
    function startLoader() {
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
    // PROCEED TO SITE - EXIT ANIMATION (FIXED)
    // ===================================================

    function proceedToSite() {
        
        const exitTl = gsap.timeline();
        
        // Fade out modal
        exitTl.to(musicModal, {
            duration: 0.4,
            opacity: 0,
            ease: "power2.in"
        })
        
        // Cleanup loader
        .call(() => {
            if (musicModal) {
                musicModal.style.visibility = 'hidden';
                musicModal.style.display = 'none';
            }
            
            if (loaderWrapper) {
                loaderWrapper.remove();
            }
            
            // Add gsap-loaded class NOW so CSS kicks in
            document.body.classList.add('gsap-loaded');
        })
        
        // ===================================================
        // REVEAL MAIN CONTENT (Use .fromTo for explicit control)
        // ===================================================
        
        .fromTo(".hero-image-wrapper", 
            { opacity: 0, y: 80, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power4.out" },
            "-=0.1"
        )
        
        .fromTo(".hero-title",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.7"
        )
        
        .fromTo(".hero-description",
            { opacity: 0, y: 30 },
            { opacity: 0.7, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.6"
        )
        
        .fromTo(".search-wrapper",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.5"
        )
        
        .fromTo(".continue-section",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
            "-=0.4"
        )
        
        .fromTo(".cast-section",
            { opacity: 0, y: 40, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
            "-=0.5"
        )
        
        .fromTo(".floating-dock",
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.5)" },
            "-=0.6"
        )
        
        // ===================================================
        // THEME TOGGLE - FIXED (use .fromTo)
        // ===================================================
        .fromTo(".theme-toggle",
            { opacity: 0, scale: 0, rotation: -45 },
            { 
                opacity: 1, 
                scale: 1, 
                rotation: 0,
                duration: 0.6, 
                ease: "back.out(1.7)" 
            },
            "-=0.5"
        )
        
        // Show music toggle
        .call(() => {
            if (musicToggle) {
                musicToggle.classList.add('visible');
                gsap.fromTo(musicToggle, 
                    { scale: 0, opacity: 0 },
                    { duration: 0.5, scale: 1, opacity: 1, ease: "back.out(1.7)" }
                );
            }
        }, null, "-=0.3")
        
        // Animate chapter cards after a tiny delay
        .call(() => {
            const cards = document.querySelectorAll('.chapter-card');
            if (cards.length > 0) {
                gsap.fromTo(cards,
                    { opacity: 0, y: 40 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.5, 
                        stagger: 0.1,
                        ease: "power2.out"
                    }
                );
            }
        }, null, "-=0.2");
    }

    // ===================================================
    // GSAP TIMELINE - EPIC INTRO (unchanged)
    // ===================================================
    
    const loaderTimeline = gsap.timeline();

    loaderTimeline.to(".loader-counter", {
        duration: 0.5,
        opacity: 0,
        ease: "power2.out"
    }, 3.5);

    loaderTimeline.to(".loader-bar", {
        duration: 1,
        y: "-100%",
        stagger: { amount: 0.4, from: "edges" },
        ease: "power4.inOut"
    }, 3.5);

    loaderTimeline.to(".loader-logo-reveal", {
        duration: 0.5,
        opacity: 1,
        ease: "power2.inOut"
    }, 4.3);

    loaderTimeline.to(".logo-divider", {
        duration: 0.8,
        height: "60%",
        ease: "power4.out"
    }, 4.5);

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

    loaderTimeline.to(".logo-divider", {
        duration: 0.6,
        height: "0%",
        ease: "power4.in"
    }, 5.8);

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

    loaderTimeline.to(".loader-logo-reveal", {
        duration: 0.5,
        opacity: 0,
        ease: "power2.inOut"
    }, 6.8);

    // ===================================================
    // MUSIC MODAL ANIMATION
    // ===================================================
    
    loaderTimeline.call(() => {
        if (!musicModal) return;
        
        document.body.appendChild(musicModal);
        musicModal.classList.add('active');
        musicModal.style.visibility = 'visible';
        
        const modalTl = gsap.timeline();
        
        modalTl.to(musicModal, { duration: 0.1, opacity: 0.3 })
        .to(musicModal, { duration: 0.05, opacity: 0 })
        .to(musicModal, { duration: 0.1, opacity: 0.6 })
        .to(musicModal, { duration: 0.05, opacity: 0.2 })
        .to(musicModal, { duration: 0.1, opacity: 1 })
        
        .from(".music-modal-content", {
            duration: 0.6,
            scale: 0.8,
            opacity: 0,
            ease: "back.out(1.7)"
        }, "-=0.2")
        
        .from(".music-icon", {
            duration: 0.5,
            scale: 0,
            rotation: -180,
            ease: "back.out(1.7)"
        }, "-=0.3")
        
        .from(".music-title", {
            duration: 0.4,
            y: 20,
            opacity: 0,
            ease: "power3.out"
        }, "-=0.2")
        .from(".music-subtitle", {
            duration: 0.4,
            y: 20,
            opacity: 0,
            ease: "power3.out"
        }, "-=0.3")
        
        .from(".music-yes", {
            duration: 0.5,
            x: 50,
            opacity: 0,
            ease: "power3.out"
        }, "-=0.2")
        .from(".music-no", {
            duration: 0.5,
            x: -50,
            opacity: 0,
            ease: "power3.out"
        }, "-=0.4")
        
        .from(".music-hint", {
            duration: 0.3,
            opacity: 0
        }, "-=0.2");

    }, null, 7.2);

    // ===================================================
    // MUSIC CONSENT BUTTONS
    // ===================================================

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
            themeAudio?.pause();
            musicEnabled = false;
            musicToggle.classList.remove('playing');
            musicToggleIcon?.classList.remove('fa-volume-high');
            musicToggleIcon?.classList.add('fa-volume-xmark');
            localStorage.setItem('musicEnabled', 'false');
        } else {
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
