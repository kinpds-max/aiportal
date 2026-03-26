document.addEventListener('DOMContentLoaded', () => {
    // Select all tool cards
    const cards = document.querySelectorAll('.tool-card');
    
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Stop the default behavior (opening in a new tab via href/target)
            e.preventDefault();
            e.stopPropagation();
            
            const url = card.getAttribute('href');
            if (!url) return;

            // Define window features that prioritize opening a separate window
            // Specifying width, height, left, and top is the best way to force a new window in modern browsers.
            const w = 1400;
            const h = 900;
            const left = (window.screen.width / 2) - (w / 2);
            const top = (window.screen.height / 2) - (h / 2);
            
            const windowFeatures = `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes,location=yes`;
            
            // Generate a unique window name using the URL or timestamp to avoid overwriting existing windows
            const windowName = 'AI_Tool_Window_' + url.replace(/[^a-z0-9]/gi, '_');

            const newWindow = window.open(url, windowName, windowFeatures);
            
            if (newWindow) {
                newWindow.focus();
            } else {
                // If blocked by popup blocker, alert the user
                alert('팝업 차단이 되어 있어 새 창을 열 수 없습니다. 브라우저 설정에서 팝업을 허용해 주세요.');
            }
        });
    });

    console.log('Hamom AI Portal v2.9: Strict New Window Mode Active');
});
