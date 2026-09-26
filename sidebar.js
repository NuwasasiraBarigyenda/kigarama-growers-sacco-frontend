/* Renders the left navigation sidebar based on the logged-in user's role, and wires up the
   mobile hamburger toggle (menu button + backdrop) that the page markup provides. */

const NAV_ITEMS = {
    SUPER_ADMIN: [
        { key: 'overview', label: 'Overview', href: 'dashboard-superadmin.html' },
        { key: 'users', label: 'Manage Accounts', href: 'manage-users.html' },
        { key: 'prices', label: 'Produce Prices', href: 'manage-prices.html' },
        { key: 'produce', label: 'Produce Records', href: 'produce-records.html' },
        { key: 'loans', label: 'Loan Applications', href: 'manage-loans.html' },
        { key: 'mobilemoney', label: 'Mobile Money', href: 'mobile-money-approvals.html' },
        { key: 'transactions', label: 'Transactions', href: 'transactions.html' },
        { key: 'chat', label: 'Messages', href: 'chat.html' },
        { key: 'profile', label: 'My Profile', href: 'profile.html' },
    ],
    ADMIN: [
        { key: 'overview', label: 'Overview', href: 'dashboard-admin.html' },
        { key: 'users', label: 'Manage Accounts', href: 'manage-users.html' },
        { key: 'prices', label: 'Produce Prices', href: 'manage-prices.html' },
        { key: 'produce', label: 'Produce Records', href: 'produce-records.html' },
        { key: 'loans', label: 'Loan Applications', href: 'manage-loans.html' },
        { key: 'mobilemoney', label: 'Mobile Money', href: 'mobile-money-approvals.html' },
        { key: 'transactions', label: 'Transactions', href: 'transactions.html' },
        { key: 'chat', label: 'Messages', href: 'chat.html' },
        { key: 'profile', label: 'My Profile', href: 'profile.html' },
    ],
    CASHIER: [
        { key: 'overview', label: 'Overview', href: 'dashboard-cashier.html' },
        { key: 'deposit', label: 'Deposit / Withdraw', href: 'cashier-teller.html' },
        { key: 'produce', label: 'Produce Intake', href: 'cashier-produce.html' },
        { key: 'loans', label: 'Loan Disbursement', href: 'manage-loans.html' },
        { key: 'mobilemoney', label: 'Mobile Money', href: 'mobile-money-approvals.html' },
        { key: 'transactions', label: 'Transactions', href: 'transactions.html' },
        { key: 'chat', label: 'Messages', href: 'chat.html' },
        { key: 'profile', label: 'My Profile', href: 'profile.html' },
    ],
    RECEPTIONIST: [
        { key: 'overview', label: 'Overview', href: 'dashboard-receptionist.html' },
        { key: 'directory', label: 'Member Directory', href: 'member-directory.html' },
        { key: 'chat', label: 'Messages', href: 'chat.html' },
        { key: 'profile', label: 'My Profile', href: 'profile.html' },
    ],
    MEMBER: [
        { key: 'overview', label: 'My Account', href: 'dashboard-member.html' },
        { key: 'produce', label: 'My Produce History', href: 'member-produce.html' },
        { key: 'mobilemoney', label: 'Mobile Money Deposit', href: 'mobile-money.html' },
        { key: 'loans', label: 'Loans', href: 'loans.html' },
        { key: 'chat', label: 'Messages', href: 'chat.html' },
        { key: 'profile', label: 'My Profile', href: 'profile.html' },
    ],
};

function renderSidebar(containerEl, user, activeKey) {
    const items = NAV_ITEMS[user.role] || [];
    const navHtml = items.map(item => `
        <a href="${item.href}" class="${item.key === activeKey ? 'active' : ''}">${item.label}</a>
    `).join('');

    containerEl.innerHTML = `
        <div class="brand">
            <img src="images/coffee-basket.jpg" alt="logo">
            <span>Kigarama Growers<br>SACCO</span>
        </div>
        <nav>
            ${navHtml}
            <button class="nav-link" id="logoutBtn">Log Out</button>
        </nav>
        <div class="user-box">
            <div>${escapeHtml(user.fullName)}</div>
            <span class="role-badge">${roleLabel(user.role)}</span>
        </div>
    `;
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Close the mobile sidebar automatically after navigating to a page.
    containerEl.querySelectorAll('nav a').forEach(a => {
        a.addEventListener('click', closeMobileSidebar);
    });

    setupMobileToggle();
}

/** Wires up the hamburger button + backdrop that dashboard pages include in their markup. */
function setupMobileToggle() {
    const menuBtn = document.getElementById('menuBtn');
    const backdrop = document.getElementById('sidebarBackdrop');
    const sidebar = document.querySelector('.sidebar');
    if (!menuBtn || !backdrop || !sidebar) return; // page doesn't have the mobile header (shouldn't happen)

    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('open');
    });
    backdrop.addEventListener('click', closeMobileSidebar);
}

function closeMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
}
