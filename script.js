document.addEventListener('DOMContentLoaded', () => {
    
    const heroVideo = document.getElementById('hero-video');
    
    if (heroVideo) {
        const source = heroVideo.querySelector('source');
        const videoSrc = source ? source.src : null;

        if (videoSrc && videoSrc.includes('.m3u8')) {
            // Check if hls.js is supported
            if (window.Hls && Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(videoSrc);
                hls.attachMedia(heroVideo);
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    heroVideo.play().catch(error => {
                        console.warn("Hero HLS video autoplay failed initially:", error.message);
                    });
                });
            } else if (heroVideo.canPlayType('application/vnd.apple.mpegurl')) {
                // native HLS playback
                heroVideo.src = videoSrc;
                heroVideo.play().catch(error => {
                    console.warn("Hero native HLS video autoplay failed initially:", error.message);
                });
            } else {
                console.error("HLS is not supported on this browser.");
            }
        } else if (heroVideo) {
            // fallback for non-HLS video
             heroVideo.play().catch(error => {
                console.warn("Hero MP4 video autoplay failed initially:", error.message);
            });
        }
    }


    const modal = document.getElementById('videoModal');
    const modalContent = document.querySelector('.modal-content');
    const closeBtn = document.querySelector('.close-btn');
    const gridItems = document.querySelectorAll('.portfolio-section .grid-item');
    
    // open the modal and play the video
    function openModal(videoUID) {
        const customerId = 'pjcim1po4vrrcwsx'; 
        const videoSrc = `https://customer-${customerId}.cloudflarestream.com/${videoUID}/iframe?autoplay=true`;
        
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', videoSrc);
        iframe.setAttribute('allow', 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;');
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('style', 'border: none; width: 100%; height: 100%;');

        modalContent.innerHTML = '';
        modalContent.appendChild(iframe);
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalContent.innerHTML = ''; 
        
        modal.style.display = 'none';
        document.body.style.overflow = ''; 
    }

    // click listener added to each grid item
    gridItems.forEach(item => {
        item.addEventListener('click', () => {
            const videoUID = item.getAttribute('data-video');
            if (videoUID) {
                openModal(videoUID);
            }
        });
    });

    // close modal with x button
    closeBtn.addEventListener('click', closeModal);

    // close modal by clicking outside the content borders
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});