document.addEventListener('DOMContentLoaded', () => {

    // Header scroll effect
    const header = document.getElementById('main-header');
    if (header && !document.body.classList.contains('faq-page')) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    // Scroll reveal (all .reveal, .reveal-left, .reveal-right)
    const revealSelectors = '.reveal, .reveal-left, .reveal-right';
    const revealEls = document.querySelectorAll(revealSelectors);

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -48px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));

    // ─── Roadmap Items (staggered) ───────────────────────────────────
    const roadmapItems = document.querySelectorAll('.roadmap-item');

    const roadmapObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // small stagger per item
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, i * 80);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    roadmapItems.forEach(item => roadmapObserver.observe(item));

    // Hero video — subtle zoom-out on load, HLS support
    const heroVideo = document.getElementById('hero-video');

    if (heroVideo) {
        const source = heroVideo.querySelector('source');
        const videoSrc = source ? source.src : null;

        const markLoaded = () => heroVideo.classList.add('loaded');
        heroVideo.addEventListener('canplay', markLoaded, { once: true });

        if (videoSrc && videoSrc.includes('.m3u8')) {
            if (window.Hls && Hls.isSupported()) {
                const hls = new Hls({ startLevel: -1 });
                hls.loadSource(videoSrc);
                hls.attachMedia(heroVideo);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    heroVideo.play().catch(() => {});
                });
            } else if (heroVideo.canPlayType('application/vnd.apple.mpegurl')) {
                heroVideo.src = videoSrc;
                heroVideo.play().catch(() => {});
            }
        } else if (heroVideo) {
            heroVideo.play().catch(() => {});
        }
    }

    // FAQ Hero image zoom on load
    const faqHeroImg = document.getElementById('faqHeroImg');
    if (faqHeroImg) {
        if (faqHeroImg.complete) {
            faqHeroImg.classList.add('loaded');
        } else {
            faqHeroImg.addEventListener('load', () => faqHeroImg.classList.add('loaded'));
        }
    }

    // Portfolio modal
    const modal       = document.getElementById('videoModal');
    const modalContent = modal ? modal.querySelector('.modal-content') : null;
    const closeBtn    = modal ? modal.querySelector('.close-btn') : null;
    const gridItems   = document.querySelectorAll('.portfolio-section .grid-item');

    function openModal(videoUID) {
        if (!modal || !modalContent) return;
        const src = `https://customer-pjcim1po4vrrcwsx.cloudflarestream.com/${videoUID}/iframe?autoplay=true`;
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.setAttribute('allow', 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;');
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.style.cssText = 'border:none; width:100%; height:100%; border-radius:2px;';
        modalContent.innerHTML = '';
        modalContent.appendChild(iframe);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal || !modalContent) return;
        modalContent.innerHTML = '';
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    gridItems.forEach(item => {
        item.addEventListener('click', () => {
            const uid = item.getAttribute('data-video');
            if (uid) openModal(uid);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') closeModal();
    });

});
