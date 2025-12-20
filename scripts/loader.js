document.addEventListener("DOMContentLoaded", () => {
    
    // ===================================================
    // APPLE LIQUID GLASS LOADER
    // ===================================================

    // Elements
    const themeAudio = document.getElementById('themeAudio');
    const musicModal = document.getElementById('musicModal');
    const musicToggle = document.getElementById('musicToggle');
    const musicToggleIcon = document.getElementById('musicToggleIcon');
    const loaderWrapper = document.getElementById("loaderWrapper");
    const loaderCounter = document.getElementById("loaderCounter");
    const progressRing = document.getElementById("progressRing");
    const logoReveal = document.getElementById("logoReveal");
    const logoText = document.getElementById("logoText");
    const logoSubtitle = document.getElementById("logoSubtitle");
    const glassLoaderCard = document.getElementById("glassLoaderCard");
    const mainSpecular = document.getElementById("mainSpecular");
    
    // Exit if no loader
    if (!loaderWrapper) {
        document.body.classList.add('gsap-loaded');
        return;
    }
    
    // Music state
    let musicEnabled = localStorage.getItem('musicEnabled') === 'true';
    
    if (musicToggleIcon && musicEnabled) {
        musicToggleIcon.classList.remove('fa-volume-xmark');
        musicToggleIcon.classList.add('fa-volume-high');
        musicToggle?.classList.add('playing');
    }

    // ===================================================
    // MOUSE TRACKING FOR SPECULAR HIGHLIGHTS
    // ===================================================
    
    function setupSpecularEffect(element, specularLayer) {
        if (!element || !specularLayer) return;
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            specularLayer.style.background = `radial-gradient(
                circle at ${x}px ${y}px,
                rgba(255,255,255,0.25) 0%,
                rgba(255,255,255,0.1) 25%,
                rgba(255,255,255,0) 50%
            )`;
        });
        
        element.addEventListener('mouseleave', () => {
            specularLayer.style.background = 'none';
            specularLayer.style.boxShadow = 'inset 1px 1px 1px rgba(255,255,255,0.75)';
        });
    }
    
    // Setup for main glass card
    setupSpecularEffect(glassLoaderCard, mainSpecular);

    // ===================================================
    // ANIMATE FLOATING PILLS
    // ===================================================
    
    function animatePills() {
        const pills = document.querySelectorAll('.glass-pill');
        
        pills.forEach((pill, index) => {
            // Fade in with stagger
            gsap.to(pill, {
                opacity: 0.8,
                duration: 1,
                delay: 0.3 + (index * 0.15),
                ease: "power2.out"
            });
            
            // Floating animation
            gsap.to(pill, {
                y: `random(-15, 15)`,
                x: `random(-10, 10)`,
                rotation: `+=${gsap.utils.random(-3, 3)}`,
                duration: gsap.utils.random(4, 6),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: index * 0.3
            });
        });
    }
    
    animatePills();

    // ===================================================
    // PROGRESS RING
    // ===================================================
    
    const circumference = 2 * Math.PI * 165;
    
    if (progressRing) {
        progressRing.style.strokeDasharray = circumference;
        progressRing.style.strokeDashoffset = circumference;
    }
    
    function setProgress(percent) {
        if (!progressRing) return;
        const offset = circumference - (percent / 100) * circumference;
        gsap.to(progressRing, {
            strokeDashoffset: offset,
            duration: 0.3,
            ease: "power1.out"
        });
    }

    // ===================================================
    // COUNTER ANIMATION
    // ===================================================
    
    let currentValue = 0;
    
    function updateCounter() {
        if (currentValue >= 100) return;

        currentValue += Math.floor(Math.random() * 3) + 1;
        if (currentValue > 100) currentValue = 100;

        if (loaderCounter) {
            loaderCounter.textContent = currentValue;
        }
        
        setProgress(currentValue);

        const delay = Math.floor(Math.random() * 50) + 25;
        setTimeout(updateCounter, delay);
    }

    updateCounter();

    // ===================================================
    // PROCEED TO SITE
    // ===================================================

    function proceedToSite() {
        
        const tl = gsap.timeline();
        
        // Fade out modal
        tl.to(musicModal, {
            opacity: 0,
            scale: 0.95,
            duration: 0.4,
            ease: "power2.in"
        })
        
        .call(() => {
            musicModal.style.visibility = 'hidden';
            musicModal.style.display = 'none';
            loaderWrapper?.remove();
            logoReveal?.remove();
            document.body.classList.add('gsap-loaded');
        })
        
        // Reveal content
        .fromTo(".hero-image-wrapper", 
            { opacity: 0, y: 50, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
        )
        
        .fromTo(".hero-title",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            "-=0.5"
        )
        
        .fromTo(".hero-description",
            { opacity: 0, y: 20 },
            { opacity: 0.7, y: 0, duration: 0.6, ease: "power2.out" },
            "-=0.4"
        )
        
        .fromTo(".search-wrapper",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "-=0.3"
        )
        
        .fromTo(".continue-section",
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            "-=0.2"
        )
        
        .fromTo(".cast-section",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "-=0.3"
        )
        
        .fromTo(".floating-dock",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" },
            "-=0.3"
        )
        
        .fromTo(".theme-toggle",
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" },
            "-=0.2"
        )
        
        .call(() => {
            if (musicToggle) {
                musicToggle.classList.add('visible');
                gsap.fromTo(musicToggle, 
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
                );
            }
            
            const cards = document.querySelectorAll('.chapter-card');
            if (cards.length > 0) {
                gsap.fromTo(cards,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }
                );
            }
        });
    }

    // ===================================================
    // MAIN TIMELINE
    // ===================================================
    
    const mainTL = gsap.timeline();

    // Phase 1: Fade out glass card and pills
    mainTL.to(".glass-loader-card", {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: "power2.in"
    }, 3.5);

    mainTL.to(".progress-ring-wrapper", {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        ease: "power2.in"
    }, 3.5);

    mainTL.to(".glass-pill", {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.in"
    }, 3.5);

    mainTL.to(".loader-brand", {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.in"
    }, 3.6);

    // Phase 2: Fade background
    mainTL.to(".background-layer", {
        opacity: 0,
        scale: 1.1,
        duration: 0.8,
        ease: "power2.inOut"
    }, 3.8);

    // Phase 3: Fade wrapper
    mainTL.to(loaderWrapper, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
    }, 4.2);

    // Phase 4: Logo reveal
    mainTL.set(logoReveal, {
        opacity: 1,
        visibility: "visible"
    }, 4.6);

    mainTL.fromTo(["#logoBlob1", "#logoBlob2"],
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 0.6, duration: 0.8, stagger: 0.1, ease: "power2.out" },
        4.6
    );

    mainTL.to(logoText, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
    }, 4.9);

    mainTL.to(logoSubtitle, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
    }, 5.3);

    // Hold
    mainTL.to({}, { duration: 0.7 }, 5.7);

    // Fade out logo
    mainTL.to([logoText, logoSubtitle], {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.in"
    }, 6.4);

    mainTL.to(logoReveal, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out"
    }, 6.7);

    // Phase 5: Music modal
    mainTL.call(() => {
        if (!musicModal) return;
        
        musicModal.classList.add('active');
        musicModal.style.visibility = 'visible';
        
        gsap.fromTo(musicModal,
            { opacity: 0 },
            { opacity: 1, duration: 0.5, ease: "power2.out" }
        );
        
        gsap.fromTo(["#musicBlob1", "#musicBlob2"],
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 0.4, duration: 1, stagger: 0.2, ease: "power2.out" }
        );
        
        gsap.fromTo(".music-glass-card",
            { opacity: 0, y: 40, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.2, ease: "power3.out" }
        );
        
        gsap.fromTo(".music-icon-container",
            { scale: 0 },
            { scale: 1, duration: 0.5, delay: 0.5, ease: "back.out(1.7)" }
        );
        
        gsap.fromTo(".music-btn",
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.4, delay: 0.7, stagger: 0.1, ease: "power2.out" }
        );
        
        // Setup specular for music card
        const musicCard = document.getElementById('musicGlassCard');
        const musicSpecular = document.getElementById('musicSpecular');
        setupSpecularEffect(musicCard, musicSpecular);
        
    }, null, 7);

    // ===================================================
    // MUSIC BUTTONS
    // ===================================================

    document.getElementById('musicYes')?.addEventListener('click', function() {
        musicEnabled = true;
        
        if (themeAudio) {
            themeAudio.volume = 0.5;
            themeAudio.loop = true;
            themeAudio.play().catch(e => console.log("Audio blocked:", e));
        }
        
        musicToggle?.classList.add('playing');
        musicToggleIcon?.classList.remove('fa-volume-xmark');
        musicToggleIcon?.classList.add('fa-volume-high');
        
        localStorage.setItem('musicEnabled', 'true');
        proceedToSite();
    });

    document.getElementById('musicNo')?.addEventListener('click', function() {
        musicEnabled = false;
        themeAudio?.pause();
        localStorage.setItem('musicEnabled', 'false');
        proceedToSite();
    });

    // ===================================================
    // MUSIC TOGGLE
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
            themeAudio?.play().catch(e => console.log("Audio blocked:", e));
            musicEnabled = true;
            musicToggle.classList.add('playing');
            musicToggleIcon?.classList.remove('fa-volume-xmark');
            musicToggleIcon?.classList.add('fa-volume-high');
            localStorage.setItem('musicEnabled', 'true');
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 'm' && musicToggle?.classList.contains('visible')) {
            musicToggle.click();
        }
    });

});
