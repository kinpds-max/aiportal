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

    // --- Lock & Password Logic ---
    const CORRECT_PASSWORD = '1191004'; 
    const modal = document.getElementById('password-modal');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const modalMsg = document.getElementById('modal-msg');
    
    // Elements to unlock
    const challengeSec = document.getElementById('challenge-section');
    const educationSec = document.getElementById('education-section');
    const memoContainer = document.getElementById('memo-container');
    const lockMemoBtn = document.getElementById('lock-memo');

    let currentAction = null; // 'initial' or 'memo'

    const openModal = (action, message) => {
        currentAction = action;
        modalMsg.textContent = message;
        passwordInput.value = '';
        modal.style.display = 'flex';
        passwordInput.focus();
    };

    const closeModal = () => {
        modal.style.display = 'none';
        passwordInput.value = '';
    };

    const unlockMain = () => {
        challengeSec.classList.remove('locked-section');
        challengeSec.classList.add('unlocked-section');
        educationSec.classList.remove('locked-section');
        educationSec.classList.add('unlocked-section');
    };

    const unlockMemo = () => {
        memoContainer.classList.remove('memo-locked');
        lockMemoBtn.innerHTML = '<i class="fa-solid fa-unlock"></i> 잠금 (활성)';
        lockMemoBtn.style.background = '#a855f7'; // Purple-ish to match Antigravity
    };

    const lockMemo = () => {
        memoContainer.classList.add('memo-locked');
        lockMemoBtn.innerHTML = '<i class="fa-solid fa-lock"></i> 잠금해제';
        lockMemoBtn.style.background = '#64748b';
    };

    // Initial state for memo button
    lockMemo();

    // Initial check on load
    openModal('initial', '도전 및 교육 섹션에 접근하려면 비밀번호가 필요합니다.');

    // Lock button click
    lockMemoBtn.addEventListener('click', () => {
        if (memoContainer.classList.contains('memo-locked')) {
            openModal('memo', '메모장 잠금을 해제하려면 비밀번호를 입력하세요.');
        } else {
            lockMemo();
        }
    });

    // Password submission
    const handlePasswordSubmit = () => {
        const input = passwordInput.value;
        if (input === CORRECT_PASSWORD) {
            if (currentAction === 'initial') {
                unlockMain();
                alert('비밀번호가 확인되었습니다. 도전/교육 섹션이 활성화됩니다.');
            } else if (currentAction === 'memo') {
                unlockMemo();
            }
            closeModal();
        } else {
            alert('비밀번호가 틀렸습니다. 다시 시도해 주세요.');
            passwordInput.value = '';
        }
    };

    passwordSubmit.addEventListener('click', handlePasswordSubmit);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handlePasswordSubmit();
    });

    // Close modal if clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === modal && currentAction !== 'initial') {
            closeModal();
        }
    });
});
