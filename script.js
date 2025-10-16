document.addEventListener('DOMContentLoaded', () => {
    // Fullscreen banner video
    const heroVideo = document.getElementById('hero-video');
    
    if (heroVideo) {
        heroVideo.play().catch(error => {
            console.warn("Hero video autoplay failed initially:", error.message);
        });
    }

    // Portfolio playlist logic
    
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const closeBtn = document.querySelector('.close-btn');
    const gridItems = document.querySelectorAll('.portfolio-section .grid-item');

    // Open modal function
    function openModal(videoSrc) {
        // Set source and force load before playing video
        modalVideo.src = videoSrc;
        modalVideo.load(); 
        modal.style.display = 'block';
        
        modalVideo.play().catch(error => {
            console.error("Modal video play failed:", error);
        });
        
        document.body.style.overflow = 'hidden';
    }

    // Function to close the modal and stop video
    function closeModal() {
        modalVideo.pause();
        modalVideo.currentTime = 0;
        // Clearing the source to release the file from memory
        modalVideo.src = ''; 
        modal.style.display = 'none';
        
        document.body.style.overflow = ''; 
    }

    // Add click listener to each grid item
    gridItems.forEach(item => {
        item.addEventListener('click', () => {
            const videoSrc = item.getAttribute('data-video');
            if (videoSrc) {
                openModal(videoSrc);
            }
        });
    });

    // Close modal via the 'X' button
    closeBtn.addEventListener('click', closeModal);

    // Close modal by clicking outside the content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});