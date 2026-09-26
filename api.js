/* =====================================================================
   Kigarama Growers SACCO — Shared API helper
   ===================================================================== */

const API_BASE = (window.SACCO_CONFIG && window.SACCO_CONFIG.API_BASE_OVERRIDE)
    ? window.SACCO_CONFIG.API_BASE_OVERRIDE.replace(/\/$/, '') + '/api'
    : '/api';

async function apiRequest(path, options = {}) {
    const opts = {
        method: options.method || 'GET',
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        credentials: 'include',
    };
    if (options.body !== undefined) {
        opts.body = options.isForm ? options.body : JSON.stringify(options.body);
        if (options.isForm) delete opts.headers['Content-Type'];
    }
    const res = await fetch(API_BASE + path, opts);
    let data = null;
    try { data = await res.json(); } catch (e) { /* no body */ }
    if (!res.ok) {
        const message = (data && (data.error || data.message)) || `Request failed (${res.status})`;
        throw new Error(message);
    }
    return data;
}

function money(value) {
    if (value === null || value === undefined) return '—';
    const n = typeof value === 'string' ? parseFloat(value) : value;
    return 'UGX ' + n.toLocaleString('en-UG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(value) {
    if (!value) return '—';
    const d = new Date(value);
    return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function initials(name) {
    if (!name) return '?';
    return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function roleLabel(role) {
    const map = {
        SUPER_ADMIN: 'Super Admin',
        ADMIN: 'Admin',
        CASHIER: 'Cashier',
        RECEPTIONIST: 'Receptionist',
        MEMBER: 'Member',
    };
    return map[role] || role;
}

function dashboardForRole(role) {
    const map = {
        SUPER_ADMIN: 'dashboard-superadmin.html',
        ADMIN: 'dashboard-admin.html',
        CASHIER: 'dashboard-cashier.html',
        RECEPTIONIST: 'dashboard-receptionist.html',
        MEMBER: 'dashboard-member.html',
    };
    return map[role] || 'index.html';
}

/** Redirects to login if not authenticated; redirects away if wrong role for this page. Returns the user object. */
async function requireAuth(allowedRoles) {
    try {
        const user = await apiRequest('/auth/me');
        if (allowedRoles && !allowedRoles.includes(user.role)) {
            window.location.href = dashboardForRole(user.role);
            return null;
        }
        return user;
    } catch (e) {
        window.location.href = 'index.html';
        return null;
    }
}

async function logout() {
    try { await apiRequest('/auth/logout', { method: 'POST' }); } catch (e) { /* ignore */ }
    window.location.href = 'index.html';
}

function showAlert(containerEl, message, type = 'error') {
    containerEl.innerHTML = `<div class="alert ${type}">${escapeHtml(message)}</div>`;
}

function clearAlert(containerEl) {
    containerEl.innerHTML = '';
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
