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
    const memoIds = ['todo-memo', 'urgent-memo', 'done-memo', 'memo-4', 'memo-5', 'memo-6'];
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
    const memoUnlockOverlay = document.getElementById('memo-unlock-overlay');
    const unlockMemoBtn = document.getElementById('unlock-memo-btn');
    const memoWrapper = document.getElementById('memo-container-wrapper');

    let currentAction = null; // 'all', 'education', 'memo'

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

    const unlockSection = (id) => {
        const sec = document.getElementById(id);
        if (sec) {
            sec.classList.remove('locked-section');
            sec.classList.add('unlocked-section');
        }
    };

    const unlockMemo = () => {
        memoContainer.classList.remove('memo-locked');
        if (memoWrapper) memoWrapper.classList.remove('locked-section');
        if (memoUnlockOverlay) memoUnlockOverlay.style.display = 'none';
    };

    const lockMemo = () => {
        memoContainer.classList.add('memo-locked');
        if (memoWrapper) memoWrapper.classList.add('locked-section');
        if (memoUnlockOverlay) memoUnlockOverlay.style.display = 'block';
    };

    // Initial state
    lockMemo();

    // Section Unlock buttons (Challenge / Education)
    document.querySelectorAll('.unlock-btn').forEach(btn => {
        if (btn.id === 'unlock-memo-btn') return; // Skip memo btn for now
        btn.addEventListener('click', (e) => {
            const target = btn.getAttribute('data-target');
            const msg = target === 'all' 
                ? '준비과정에 접근하려면 비밀번호를 입력하세요. (전체 해제)'
                : '교육 섹션을 해제하려면 비밀번호를 입력하세요.';
            openModal(target, msg);
        });
    });

    // New Unlock button click (Memo)
    if (unlockMemoBtn) {
        unlockMemoBtn.addEventListener('click', () => {
            openModal('memo', '메모장 잠금을 해제하려면 비밀번호를 입력하세요.');
        });
    }

    // Auto-save logic
    memoIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', () => {
                localStorage.setItem(id, element.value);
                
                // Show subtle auto-save indicator
                if (lastSavedSpan) {
                    lastSavedSpan.textContent = '자동 저장 중...';
                    clearTimeout(window.autoSaveTimeout);
                    window.autoSaveTimeout = setTimeout(() => {
                        const now = new Date();
                        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
                        lastSavedSpan.textContent = `자동 저장됨 (${timeStr})`;
                    }, 1000);
                }
            });
        }
    });

    // Password submission
    const handlePasswordSubmit = () => {
        const input = passwordInput.value;
        if (input === CORRECT_PASSWORD) {
            if (currentAction === 'all') {
                unlockSection('challenge-section');
                unlockSection('education-section');
                unlockMemo();
            } else if (currentAction === 'education') {
                unlockSection('education-section');
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
        if (e.target === modal) {
            closeModal();
        }
    });

    // --- Schedule & Calendar Logic ---
    let schedules = JSON.parse(localStorage.getItem('hamom-schedules')) || [];

    const schedDateInput = document.getElementById('sched-date');
    const schedContentInput = document.getElementById('sched-content');
    const schedUrgentInput = document.getElementById('sched-urgent');
    const addSchedBtn = document.getElementById('add-schedule');
    const calendarWrapper = document.getElementById('calendar-wrapper');
    const urgentDDayList = document.getElementById('urgent-d-day-list');
    const regularDDayList = document.getElementById('regular-d-day-list');

    const saveSchedules = () => {
        localStorage.setItem('hamom-schedules', JSON.stringify(schedules));
        renderAll();
    };

    const deleteSchedule = (id) => {
        schedules = schedules.filter(s => s.id !== id);
        saveSchedules();
    };

    const calculateDDay = (targetDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = new Date(targetDate);
        target.setHours(0, 0, 0, 0);
        const diffTime = target - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'D-Day';
        if (diffDays > 0) return `D-${diffDays}`;
        return `D+${Math.abs(diffDays)}`;
    };

    const renderDDayLists = () => {
        const sorted = [...schedules].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const urgentItems = sorted.filter(s => s.isUrgent);
        const regularItems = sorted.filter(s => !s.isUrgent);

        const renderList = (items, element, emptyMsg) => {
            if (items.length === 0) {
                element.innerHTML = emptyMsg;
                return;
            }
            element.innerHTML = items.map(item => `
                <div class="d-day-item">
                    <span>${calculateDDay(item.date)}</span> ${item.content} (${item.date})
                </div>
            `).join('');
        };

        renderList(urgentItems, urgentDDayList, '등록된 긴급 일정이 없습니다.');
        renderList(regularItems, regularDDayList, '등록된 일반 일정이 없습니다.');
    };

    const renderCalendar = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        let html = `<table class="calendar-table">
            <thead>
                <tr>
                    <th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th>
                </tr>
            </thead>
            <tbody><tr>`;

        for (let i = 0; i < firstDay; i++) {
            html += '<td class="calendar-day other-month"></td>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            if ((firstDay + day - 1) % 7 === 0 && day !== 1) {
                html += '</tr><tr>';
            }
            
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
            
            const daySchedules = schedules.filter(s => s.date === dateStr);
            
            html += `<td class="calendar-day ${isToday ? 'today' : ''}">
                <span class="day-number">${day}</span>
                ${daySchedules.map(s => `
                    <div class="calendar-event ${s.isUrgent ? 'ev-urgent' : 'ev-regular'}" title="${s.content}">
                        <span class="ev-text">${s.content.substring(0, 8)}</span>
                        <i class="fa-solid fa-xmark delete-ev" onclick="window.deleteScheduleHandler('${s.id}')"></i>
                    </div>
                `).join('')}
            </td>`;
        }

        html += '</tr></tbody></table>';
        calendarWrapper.innerHTML = html;
    };

    // Global handler for deletion (since it's inside string-based HTML)
    window.deleteScheduleHandler = (id) => {
        if (confirm('이 일정을 삭제하시겠습니까?')) {
            deleteSchedule(id);
        }
    };

    const renderAll = () => {
        renderDDayLists();
        renderCalendar();
    };

    if (addSchedBtn) {
        addSchedBtn.addEventListener('click', () => {
            const date = schedDateInput.value;
            const content = schedContentInput.value;
            const isUrgent = schedUrgentInput.checked;

            if (!date || !content) {
                alert('날짜와 내용을 모두 입력해주세요.');
                return;
            }

            const newSchedule = {
                id: Date.now().toString(),
                date,
                content,
                isUrgent
            };

            schedules.push(newSchedule);
            saveSchedules();
            
            // Clear inputs
            schedContentInput.value = '';
            schedUrgentInput.checked = false;
        });
    }

    // Initial render
    if (schedDateInput) {
        const today = new Date();
        schedDateInput.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }
    renderAll();
});
