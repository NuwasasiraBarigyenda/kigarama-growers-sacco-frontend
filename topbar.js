/* Renders the notification bell + profile avatar into a page's #topbar container.
   Call renderTopbar(user) once requireAuth() has resolved the current user. */

let _notifPollTimer = null;
let _topbarUser = null;

function renderTopbar(user) {
    _topbarUser = user;
    const container = document.getElementById('topbar');
    if (!container) return;

    const avatarHtml = user.profilePicUrl
        ? `<img class="avatar-img" src="${user.profilePicUrl}" alt="">`
        : `<span class="avatar-fallback">${initials(user.fullName)}</span>`;

    container.innerHTML = `
        <div style="position:relative;">
            <button class="icon-btn" id="notifBtn" title="Notifications">
                🔔
                <span class="badge-dot" id="notifBadge" style="display:none;">0</span>
            </button>
            <div class="notif-dropdown" id="notifDropdown">
                <div class="notif-header">Notifications</div>
                <div id="notifList"><div class="notif-empty">No new messages.</div></div>
            </div>
        </div>
        <div class="topbar-profile" id="profileMenuBtn">
            ${avatarHtml}
            <div>
                <div class="name">${escapeHtml(user.fullName.split(' ')[0])}</div>
                <div class="role">${roleLabel(user.role)}</div>
            </div>
        </div>
    `;

    document.getElementById('profileMenuBtn').addEventListener('click', () => {
        window.location.href = 'profile.html';
    });

    const notifBtn = document.getElementById('notifBtn');
    const notifDropdown = document.getElementById('notifDropdown');
    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
        if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
            notifDropdown.classList.remove('open');
        }
    });

    loadNotifications();
    if (_notifPollTimer) clearInterval(_notifPollTimer);
    _notifPollTimer = setInterval(loadNotifications, 20000);
}

async function loadNotifications() {
    try {
        const data = await apiRequest('/notifications/summary');
        const badge = document.getElementById('notifBadge');
        const list = document.getElementById('notifList');
        if (!badge || !list) return;

        if (data.unreadCount > 0) {
            badge.style.display = 'flex';
            badge.textContent = data.unreadCount > 9 ? '9+' : data.unreadCount;
        } else {
            badge.style.display = 'none';
        }

        list.innerHTML = data.previews.length ? data.previews.map(p => `
            <div class="notif-item" data-from="${p.fromUserId}">
                <div class="from">${escapeHtml(p.fromName)}</div>
                <div class="snippet">${escapeHtml((p.message || 'Sent an attachment').slice(0, 60))}</div>
            </div>
        `).join('') : '<div class="notif-empty">No new messages.</div>';

        list.querySelectorAll('.notif-item').forEach(item => {
            item.addEventListener('click', () => {
                window.location.href = 'chat.html?with=' + item.dataset.from;
            });
        });
    } catch (e) { /* not fatal — notifications are a nice-to-have */ }
}
