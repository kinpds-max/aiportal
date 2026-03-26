document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.tool-card');
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        // Initial state set in CSS animation fadeIn, but observer can help with scroll
        // observer.observe(card);
    });

    // Simple interaction feedback
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Can add sound or extra micro-animations here
        });
    });
});
