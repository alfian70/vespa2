// Main Application Module
const App = (function() {
    let sidebarCollapsed = false;
    let isMobile = false;

    // Initialize application
    function init() {
        // Check if mobile
        checkMobile();
        
        // Initialize theme toggle
        initThemeToggle();
        
        // Initialize sidebar toggle
        initSidebarToggle();
        
        // Initialize admin login
        initAdminLogin();
        
        // Start as user by default
        startAsUser();
        
        // Add window resize listener
        window.addEventListener('resize', checkMobile);
    }

    // Check if device is mobile
    function checkMobile() {
        isMobile = window.innerWidth <= 768;
        const sidebar = document.getElementById('sidebar');
        
        if (isMobile) {
            sidebar.classList.remove('collapsed');
            sidebar.classList.remove('mobile-open');
            sidebarCollapsed = false;
        }
    }

    // Initialize sidebar toggle functionality
    function initSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        const mobileOverlay = document.getElementById('mobile-overlay');
        
        sidebarToggle.addEventListener('click', function() {
            if (isMobile) {
                // Mobile: toggle sidebar visibility
                sidebar.classList.toggle('mobile-open');
                mobileOverlay.classList.toggle('active');
            } else {
                // Desktop: toggle sidebar collapse
                sidebarCollapsed = !sidebarCollapsed;
                sidebar.classList.toggle('collapsed', sidebarCollapsed);
            }
        });
        
        // Close mobile sidebar when overlay is clicked
        mobileOverlay.addEventListener('click', function() {
            sidebar.classList.remove('mobile-open');
            mobileOverlay.classList.remove('active');
        });
    }

    // Initialize theme toggle functionality
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        const html = document.documentElement;
        
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
        
        function updateThemeIcon(theme) {
            if (theme === 'dark') {
                themeIcon.className = 'fas fa-sun';
            } else {
                themeIcon.className = 'fas fa-moon';
            }
        }
    }

    // Initialize admin login functionality
    function initAdminLogin() {
        const adminLoginBtn = document.getElementById('admin-login-btn');
        const adminLoginModal = document.getElementById('admin-login-modal');
        const adminLoginClose = document.getElementById('admin-login-close');
        const adminLoginCancel = document.getElementById('admin-login-cancel');
        const adminLoginSubmit = document.getElementById('admin-login-submit');
        const logoutBtn = document.getElementById('logout-btn');
        
        // Show admin login modal
        adminLoginBtn.addEventListener('click', function() {
            adminLoginModal.classList.remove('hidden');
            document.getElementById('admin-username').focus();
        });
        
        // Close admin login modal
        function closeAdminLogin() {
            adminLoginModal.classList.add('hidden');
            document.getElementById('admin-username').value = '';
            document.getElementById('admin-password').value = '';
        }
        
        adminLoginClose.addEventListener('click', closeAdminLogin);
        adminLoginCancel.addEventListener('click', closeAdminLogin);
        
        // Handle admin login
        adminLoginSubmit.addEventListener('click', handleAdminLogin);
        
        // Handle enter key in admin login
        adminLoginModal.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleAdminLogin();
            }
        });
        
        // Handle logout
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Start as user
    function startAsUser() {
        // Set user mode
        Auth.setUserMode();
        
        // Update UI
        updateUIForUser();
        
        // Initialize navigation for user
        Navigation.init();
    }

    // Handle admin login
    function handleAdminLogin() {
        const username = document.getElementById('admin-username').value.trim();
        const password = document.getElementById('admin-password').value.trim();
        
        if (!username || !password) {
            alert('Mohon isi username dan password!');
            return;
        }
        
        const user = Auth.login(username, password);
        
        if (user && user.role === 'expert') {
            // Close modal
            document.getElementById('admin-login-modal').classList.add('hidden');
            
            // Update UI for admin
            updateUIForAdmin(user);
            
            // Initialize navigation for admin
            Navigation.init();
        } else {
            alert('Username atau password admin salah!');
            document.getElementById('admin-password').value = '';
            document.getElementById('admin-password').focus();
        }
    }

    // Handle logout
    function handleLogout() {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            Auth.logout();
            startAsUser();
        }
    }

    // Update UI for user
    function updateUIForUser() {
        const userSection = document.getElementById('user-section');
        const userInfo = document.querySelector('#user-info span');
        const logoutBtn = document.getElementById('logout-btn');
        
        userSection.innerHTML = `
            <button class="admin-login-btn" id="admin-login-btn">
                <i class="fas fa-user-shield"></i>
                <span>Admin</span>
            </button>
        `;
        
        userInfo.textContent = 'User';
        logoutBtn.classList.add('hidden');
        
        // Re-attach admin login event
        document.getElementById('admin-login-btn').addEventListener('click', function() {
            document.getElementById('admin-login-modal').classList.remove('hidden');
            document.getElementById('admin-username').focus();
        });
    }

    // Update UI for admin
    function updateUIForAdmin(user) {
        const userSection = document.getElementById('user-section');
        const userInfo = document.querySelector('#user-info span');
        const logoutBtn = document.getElementById('logout-btn');
        
        userSection.innerHTML = `
            <div class="user-info">
                <i class="fas fa-user-shield"></i>
                <span>${user.name}</span>
            </div>
        `;
        
        userInfo.textContent = user.name;
        logoutBtn.classList.remove('hidden');
    }

    // Public API
    return {
        init
    };
})();

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});