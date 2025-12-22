document.addEventListener("DOMContentLoaded", () => {
    
    // ===================================================
    // APPLE LIQUID GLASS LOADER - ENHANCED VERSION
    // Features:
    // 1. Smooth GSAP Counter Tween
    // 2. Fluid Morph Transitions
    // 3. Reactive Background Energy
    // 4. Staggered Layout Entrance
    // 5. Liquid Wash Reveal (7 seconds)
    // ===================================================

    // Elements
    const themeAudio = document.getElementById('themeAudio');
    const musicModal = document.getElementById('musicModal');
    const musicToggle = document.getElementById('musicToggle');
    const musicToggleIcon = document.getElementById('musicToggleIcon');
    const themeToggle = document.getElementById('themeToggle');
    const loaderWrapper = document.getElementById("loaderWrapper");
    const loaderCounter = document.getElementById("loaderCounter");
    const loaderLabel = document.getElementById("loaderLabel");
    const progressRing = document.getElementById("progressRing");
    const glassLoaderCard = document.getElementById("glassLoaderCard");
    const glassLoaderContainer = document.getElementById("glassLoaderContainer");
    const mainSpecular = document.getElementById("mainSpecular");
    const backgroundLayer = document.getElementById("backgroundLayer");
    const colorShiftOverlay = document.getElementById("colorShiftOverlay");
    const energyRipples = document.getElementById("energyRipples");
    const liquidWashContainer = document.getElementById("liquidWashContainer");
    const soundWaveIndicator = document.getElementById("soundWaveIndicator");
    
    // Exit if no loader
    if (!loaderWrapper) {
        document.body.classList.add('gsap-loaded');
        initThemeToggle();
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
    // 1. SMOOTH GSAP COUNTER TWEEN
    // No more teleporting numbers!
    // ===================================================
    
    const counterObj = { value: 0 };
    const circumference = 2 * Math.PI * 165;
    
    if (progressRing) {
        progressRing.style.strokeDasharray = circumference;
        progressRing.style.strokeDashoffset = circumference;
    }
    
    // Milestone values for energy pulses
    const milestones = [25, 50, 75, 100];
    let lastMilestone = 0;
    
    // Smooth counter animation using GSAP
    const counterTween = gsap.to(counterObj, {
        value: 100,
        duration: 3.5,
        ease: "power2.inOut",
        onUpdate: function() {
            const currentValue = Math.round(counterObj.value);
            
            if (loaderCounter) {
                loaderCounter.textContent = currentValue;
            }
            
            // Update progress ring smoothly
            if (progressRing) {
                const offset = circumference - (counterObj.value / 100) * circumference;
                progressRing.style.strokeDashoffset = offset;
            }
            
            // Check for milestones and trigger energy effects
            milestones.forEach(milestone => {
                if (currentValue >= milestone && lastMilestone < milestone) {
                    lastMilestone = milestone;
                    triggerEnergyPulse();
                    triggerMilestoneEffect();
                }
            });
            
            // 3. SYNC BACKGROUND ENERGY
            updateBackgroundEnergy(counterObj.value);
        },
        onComplete: function() {
            if (loaderLabel) {
                loaderLabel.textContent = "Complete";
            }
        }
    });

    // ===================================================
    // 3. SYNC BACKGROUND ENERGY
    // Reactive ripples and color shifts
    // ===================================================
    
    function updateBackgroundEnergy(progress) {
        // Color shift based on progress
        if (colorShiftOverlay) {
            const hue1 = 240 + (progress * 0.6); // Blue to purple
            const hue2 = 280 + (progress * 0.4); // Purple to pink
            const intensity = 0.1 + (progress / 100) * 0.2;
            
            colorShiftOverlay.style.background = `
                radial-gradient(
                    ellipse at ${50 + Math.sin(progress * 0.05) * 20}% ${50 + Math.cos(progress * 0.05) * 20}%,
                    hsla(${hue1}, 70%, 60%, ${intensity}) 0%,
                    hsla(${hue2}, 70%, 50%, ${intensity * 0.5}) 50%,
                    transparent 100%
                )
            `;
            colorShiftOverlay.style.opacity = 1;
        }
        
        // Animate blobs based on progress
        const blobs = document.querySelectorAll('.color-blob');
        blobs.forEach((blob, index) => {
            const scale = 1 + (progress / 100) * 0.2;
            const blur = 80 + (progress / 100) * 20;
            blob.style.filter = `blur(${blur}px)`;
            blob.style.opacity = 0.7 + (progress / 100) * 0.2;
        });
    }
    
    function triggerEnergyPulse() {
        const rings = document.querySelectorAll('.energy-ring');
        rings.forEach((ring, index) => {
            setTimeout(() => {
                ring.classList.remove('pulse');
                void ring.offsetWidth; // Trigger reflow
                ring.classList.add('pulse');
                
                // Remove class after animation
                setTimeout(() => {
                    ring.classList.remove('pulse');
                }, 1500);
            }, index * 150);
        });
    }
    
    function triggerMilestoneEffect() {
        if (loaderCounter) {
            loaderCounter.classList.add('milestone');
            setTimeout(() => {
                loaderCounter.classList.remove('milestone');
            }, 500);
        }
        
        // Flash the glass card
        if (glassLoaderCard) {
            gsap.to(glassLoaderCard, {
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(102, 126, 234, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2)',
                duration: 0.3,
                yoyo: true,
                repeat: 1
            });
        }
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
    
    setupSpecularEffect(glassLoaderCard, mainSpecular);

    // ===================================================
    // ANIMATE FLOATING PILLS
    // ===================================================
    
    function animatePills() {
        const pills = document.querySelectorAll('.glass-pill');
        
        pills.forEach((pill, index) => {
            gsap.to(pill, {
                opacity: 0.8,
                duration: 1,
                delay: 0.3 + (index * 0.15),
                ease: "power2.out"
            });
            
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
    // 6. LIQUID WASH REVEAL (7 seconds)
    // ===================================================
    
    function createLiquidDroplets() {
        const dropletsContainer = document.getElementById('liquidDroplets');
        if (!dropletsContainer) return;
        
        for (let i = 0; i < 30; i++) {
            const droplet = document.createElement('div');
            droplet.className = 'liquid-droplet';
            droplet.style.left = `${Math.random() * 100}%`;
            droplet.style.top = `${Math.random() * 30}%`;
            droplet.style.width = `${10 + Math.random() * 20}px`;
            droplet.style.height = `${15 + Math.random() * 25}px`;
            droplet.style.animationDelay = `${Math.random() * 2}s`;
            dropletsContainer.appendChild(droplet);
        }
    }
    
    function triggerLiquidWash() {
        return new Promise((resolve) => {
            if (!liquidWashContainer) {
                resolve();
                return;
            }
            
            createLiquidDroplets();
            liquidWashContainer.classList.add('active');
            
            const layers = liquidWashContainer.querySelectorAll('.liquid-layer');
            const droplets = liquidWashContainer.querySelectorAll('.liquid-droplet');
            const foam = liquidWashContainer.querySelector('.liquid-foam');
            
            const tl = gsap.timeline({
                onComplete: () => {
                    gsap.to(liquidWashContainer, {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            liquidWashContainer.classList.remove('active');
                            liquidWashContainer.remove();
                            resolve();
                        }
                    });
                }
            });
            
            // Animate liquid layers washing down
            tl.to(layers, {
                y: '220%',
                duration: 5,
                stagger: 0.3,
                ease: "power1.inOut"
            }, 0);
            
            // Droplets fall
            tl.to(droplets, {
                opacity: 1,
                y: '100vh',
                duration: 3,
                stagger: {
                    each: 0.05,
                    from: "random"
                },
                ease: "power2.in"
            }, 0.5);
            
            // Foam effect
            if (foam) {
                tl.to(foam, {
                    opacity: 0.6,
                    y: '-100vh',
                    duration: 4,
                    ease: "power1.out"
                }, 1);
            }
            
            // Turbulence animation for liquid effect
            const liquidTurbulence = document.getElementById('liquidTurbulence');
            if (liquidTurbulence) {
                gsap.to({}, {
                    duration: 5,
                    onUpdate: function() {
                        const progress = this.progress();
                        const freq = 0.01 + progress * 0.02;
                        liquidTurbulence.setAttribute('baseFrequency', freq);
                    }
                });
            }
        });
    }

    // ===================================================
    // 2. FLUID MORPH TRANSITION
    // Card morphs into music modal instead of hard cut
    // ===================================================
    
    function morphToMusicModal() {
        return new Promise((resolve) => {
            if (!musicModal || !glassLoaderCard) {
                resolve();
                return;
            }
            
            const loaderRect = glassLoaderCard.getBoundingClientRect();
            const targetWidth = Math.min(420, window.innerWidth * 0.9);
            const targetHeight = 500;
            
            // Get center positions
            const loaderCenterX = loaderRect.left + loaderRect.width / 2;
            const loaderCenterY = loaderRect.top + loaderRect.height / 2;
            const targetCenterX = window.innerWidth / 2;
            const targetCenterY = window.innerHeight / 2;
            
            const morphTL = gsap.timeline({
                onComplete: resolve
            });
            
            // Phase 1: Fade out counter content
            morphTL.to([loaderCounter, loaderLabel], {
                opacity: 0,
                scale: 0.8,
                duration: 0.4,
                ease: "power2.in"
            });
            
            // Fade out progress ring
            morphTL.to(".progress-ring-wrapper", {
                opacity: 0,
                scale: 0.9,
                duration: 0.4,
                ease: "power2.in"
            }, "-=0.3");
            
            // Fade out pills
            morphTL.to(".glass-pill", {
                opacity: 0,
                scale: 0.8,
                duration: 0.3,
                stagger: 0.05,
                ease: "power2.in"
            }, "-=0.2");
            
            // Fade out brand
            morphTL.to(".loader-brand", {
                opacity: 0,
                y: -20,
                duration: 0.3,
                ease: "power2.in"
            }, "-=0.2");
            
            // Phase 2: Morph the card
            morphTL.to(glassLoaderCard, {
                width: targetWidth,
                height: targetHeight,
                borderRadius: 32,
                duration: 0.8,
                ease: "power3.inOut"
            });
            
            // Move container to center
            morphTL.to(glassLoaderContainer, {
                x: targetCenterX - loaderCenterX,
                y: targetCenterY - loaderCenterY,
                duration: 0.8,
                ease: "power3.inOut"
            }, "-=0.8");
            
            // Change background color
            morphTL.to(glassLoaderCard.querySelector('.glass-overlay'), {
                background: 'rgba(255, 255, 255, 0.12)',
                duration: 0.5
            }, "-=0.4");
            
            // Phase 3: Transition to music modal
            morphTL.call(() => {
                // Hide loader elements
                loaderWrapper.style.pointerEvents = 'none';
                
                // Show music modal
                musicModal.classList.add('active');
                musicModal.style.visibility = 'visible';
            });
            
            // Fade in modal background
            morphTL.fromTo(musicModal, 
                { opacity: 0 },
                { opacity: 1, duration: 0.4 }
            );
            
            // Fade out loader card as modal card appears
            morphTL.to(glassLoaderCard, {
                opacity: 0,
                duration: 0.3
            }, "-=0.2");
            
            // Background blobs
            morphTL.fromTo(["#musicBlob1", "#musicBlob2"],
                { scale: 0.5, opacity: 0 },
                { scale: 1, opacity: 0.4, duration: 0.8, stagger: 0.1 },
                "-=0.3"
            );
            
            // 4. STAGGERED ENTRANCE
            // Music modal card appears
            morphTL.fromTo(".music-glass-card",
                { opacity: 0, y: 50, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" },
                "-=0.4"
            );
            
            // Stagger 1: Icon drops in
            morphTL.fromTo("#musicIconContainer",
                { opacity: 0, scale: 0, y: -30 },
                { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" },
                "-=0.2"
            );
            
            // Add animation to icon
            morphTL.call(() => {
                document.getElementById('musicIconContainer')?.classList.add('animate');
            });
            
            // Stagger 2: Text fades in
            morphTL.fromTo("#musicTitle",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
                "-=0.2"
            );
            
            morphTL.fromTo("#musicSubtitle",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
                "-=0.2"
            );
            
            // Stagger 3: Buttons fade in last
            morphTL.fromTo("#musicButtons",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
                "-=0.1"
            );
            
            morphTL.fromTo("#musicHint",
                { opacity: 0 },
                { opacity: 1, duration: 0.3 },
                "-=0.1"
            );
            
            // Setup specular effect for music card
            const musicCard = document.getElementById('musicGlassCard');
            const musicSpecular = document.getElementById('musicSpecular');
            setupSpecularEffect(musicCard, musicSpecular);
        });
    }

    // ===================================================
    // PROCEED TO SITE WITH LIQUID WASH
    // ===================================================

    async function proceedToSite() {
        const tl = gsap.timeline();
        
        // Fade out modal quickly
        tl.to(musicModal, {
            opacity: 0,
            scale: 0.98,
            duration: 0.3,
            ease: "power2.in"
        });
        
        tl.call(() => {
            musicModal.style.visibility = 'hidden';
            musicModal.style.display = 'none';
            loaderWrapper?.remove();
        });
        
        // Trigger liquid wash reveal
        await triggerLiquidWash();
        
        // Now reveal the site content
        document.body.classList.add('gsap-loaded');
        
        const revealTL = gsap.timeline();
        
        // Hero elements
        revealTL.fromTo(".hero-image-wrapper", 
            { opacity: 0, y: 60, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
        );
        
        revealTL.fromTo(".hero-title",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            "-=0.5"
        );
        
        revealTL.fromTo(".hero-description",
            { opacity: 0, y: 30 },
            { opacity: 0.7, y: 0, duration: 0.6, ease: "power2.out" },
            "-=0.4"
        );
        
        revealTL.fromTo(".search-wrapper",
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "-=0.3"
        );
        
        revealTL.fromTo(".continue-section",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            "-=0.2"
        );
        
        revealTL.fromTo(".cast-section",
            { opacity: 0, y: 35 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "-=0.3"
        );
        
        revealTL.fromTo(".floating-dock",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" },
            "-=0.3"
        );
        
        // Show theme toggle and music toggle
        revealTL.call(() => {
            if (themeToggle) {
                themeToggle.classList.add('visible');
                gsap.fromTo(themeToggle, 
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
                );
            }
            
            if (musicToggle) {
                musicToggle.classList.add('visible');
                gsap.fromTo(musicToggle, 
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)", delay: 0.1 }
                );
            }
            
            // Chapter cards
            const cards = document.querySelectorAll('.chapter-card');
            if (cards.length > 0) {
                gsap.fromTo(cards,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }
                );
            }
            
            // Initialize theme toggle functionality
            initThemeToggle();
        });
    }

    // ===================================================
    // MAIN TIMELINE
    // ===================================================
    
    const mainTL = gsap.timeline();

    // Wait for counter to complete, then morph
    mainTL.call(() => {
        // Counter animation is running separately
    });
    
    // After 4 seconds (counter complete + buffer), start morph
    mainTL.call(async () => {
        await morphToMusicModal();
    }, null, 4);

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
    // MUSIC TOGGLE (Futuristic with Sound Wave)
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

    // Keyboard shortcut
    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 'm' && musicToggle?.classList.contains('visible')) {
            musicToggle.click();
        }
        if (e.key.toLowerCase() === 'd' && themeToggle?.classList.contains('visible')) {
            themeToggle.click();
        }
    });

    // ===================================================
    // DARK MODE TOGGLE (Restored!)
    // ===================================================
    
    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        // Check for saved preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-mode');
        }
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            // Animate the toggle
            gsap.to(themeToggle, {
                scale: 0.9,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        });
    }

});
