document.addEventListener("DOMContentLoaded", () => {

    // ─── Scroll Fade-in Animation ────────────────────────────────────────────────
    const fadeEls = document.querySelectorAll(
        '.project-card, .hobby-item, .about-content, .quote-frame, .section-header, .profile-wrapper, .about-desc'
    );
    fadeEls.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    fadeEls.forEach(el => observer.observe(el));

    // ─── Active Nav Link on Scroll ───────────────────────────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Check if the middle of the viewport intersects the section
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                current = section.getAttribute('id');
            }
        });

        // If user scrolled to the very bottom, force the last section
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            current = 'hobbies';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ─── Background Music Player ──────────────────────────────────────────────────
    const bgAudio = document.getElementById('bg-audio');
    const musicToggle = document.getElementById('music-toggle');
    
    if (bgAudio && musicToggle) {
        bgAudio.volume = 0.2; // Soft peaceful volume
        
        const playMusic = () => {
            bgAudio.play().then(() => {
                musicToggle.textContent = '🔊';
            }).catch(e => console.log('Autoplay blocked:', e));
        };

        // Autoplay requires user interaction in most browsers, listen for first click anywhere
        document.body.addEventListener('click', () => {
            if (bgAudio.paused) playMusic();
        }, { once: true });

        // Toggle button logic
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (bgAudio.paused) {
                bgAudio.play();
                musicToggle.textContent = '🔊';
            } else {
                bgAudio.pause();
                musicToggle.textContent = '🔈';
            }
        });
        
        // Initial attempt
        playMusic();
    }

    // ─── Easter Egg ─────────────────────────────────────────────────────────────
    const logoLink = document.querySelector('.nav-logo');
    const easterEggOverlay = document.getElementById('easter-egg-overlay');
    const easterEggVideo = document.getElementById('easter-egg-video');
    const closeEasterEggBtn = document.getElementById('close-easter-egg');

    if (logoLink && easterEggOverlay && easterEggVideo && closeEasterEggBtn) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link navigation
            easterEggOverlay.style.display = 'flex';
            easterEggVideo.play().catch(err => console.log('Video autoplay blocked:', err));

            // Stop the ambient music so Sauron takes full effect!
            if (bgAudio && !bgAudio.paused) {
                bgAudio.pause();
                if(musicToggle) musicToggle.textContent = '🔈';
            }
        });

        const closeEasterEgg = () => {
            easterEggOverlay.style.display = 'none';
            easterEggVideo.pause();
            easterEggVideo.currentTime = 0; // reset video to start
        };

        closeEasterEggBtn.addEventListener('click', closeEasterEgg);
        easterEggVideo.addEventListener('ended', closeEasterEgg);
    }
});
