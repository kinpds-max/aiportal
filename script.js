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

    // Memo Logic
    const memoIds = ['todo-memo', 'urgent-memo', 'done-memo'];
    const saveBtn = document.getElementById('save-memo');
    const lastSavedSpan = document.getElementById('last-saved');

    // Display last saved time
    const displayLastSaved = () => {
        const savedTime = localStorage.getItem('memo-last-saved');
        if (savedTime && lastSavedSpan) {
            lastSavedSpan.textContent = `최근 저장: ${savedTime}`;
        }
    };

    // Load saved memos
    memoIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = localStorage.getItem(id) || '';
        }
    });
    displayLastSaved();

    // Save functionality
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            memoIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    localStorage.setItem(id, element.value);
                }
            });

            // Save timestamp
            const now = new Date();
            const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            localStorage.setItem('memo-last-saved', timeStr);
            displayLastSaved();

            // Feedback: Show "Saved" state
            const originalHTML = saveBtn.innerHTML;
            const originalBG = saveBtn.style.backgroundColor;
            
            saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> 저장완료';
            saveBtn.style.backgroundColor = '#10b981';
            
            setTimeout(() => {
                saveBtn.innerHTML = originalHTML;
                saveBtn.style.backgroundColor = originalBG;
            }, 2000);
        });
    }
});
