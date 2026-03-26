document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.tool-card');
    
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const url = card.getAttribute('href');
            
            // Force open in a new window with features (Modern browsers treat this as a separate window)
            const windowFeatures = 'toolbar=yes,location=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=1400,height=900';
            window.open(url, '_blank', windowFeatures);
        });
    });

    console.log('Hamom AI Portal v2.5: Forcing New Window Mode');
});
