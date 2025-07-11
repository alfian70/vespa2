// Navigation Module
const Navigation = (function() {
    // Navigation items for different roles
    const navItems = {
        expert: [
            { id: 'beranda', icon: 'fas fa-home fa-fw', text: 'Beranda' },
            { id: 'gejala', icon: 'fas fa-list-check fa-fw', text: 'Kode Gejala' },
            { id: 'kerusakan', icon: 'fas fa-triangle-exclamation fa-fw', text: 'Kode Kerusakan' },
            { id: 'diagnosa', icon: 'fas fa-stethoscope fa-fw', text: 'Diagnosa' }
        ],
        user: [
            { id: 'beranda', icon: 'fas fa-home fa-fw', text: 'Beranda' },
            { id: 'gejala', icon: 'fas fa-list-check fa-fw', text: 'Kode Gejala' },
            { id: 'kerusakan', icon: 'fas fa-triangle-exclamation fa-fw', text: 'Kode Kerusakan' },
            { id: 'diagnosa', icon: 'fas fa-stethoscope fa-fw', text: 'Diagnosa' }
        ]
    };

    // Initialize navigation based on user role
    function init() {
        const currentUser = Auth.getCurrentUser();
        const navContainer = document.getElementById('main-nav');
        
        if (!currentUser) return;
        
        // Clear existing navigation
        navContainer.innerHTML = '';
        
        // Create navigation items based on role
        const items = navItems[currentUser.role];
        items.forEach(item => {
            const navItem = document.createElement('div');
            navItem.className = 'nav-item';
            navItem.dataset.page = item.id;
            navItem.innerHTML = `<i class="${item.icon}"></i> <span>${item.text}</span>`;
            
            navItem.addEventListener('click', function() {
                setActivePage(item.id);
                
                // Close mobile sidebar after navigation
                if (window.innerWidth <= 768) {
                    document.getElementById('sidebar').classList.remove('mobile-open');
                    document.getElementById('mobile-overlay').classList.remove('active');
                }
            });
            
            navContainer.appendChild(navItem);
        });
        
        // Set default active page
        setActivePage('beranda');
    }

    // Set active page
    function setActivePage(pageId) {
        // Update navigation active state
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.dataset.page === pageId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Load page content
        UIController.loadPage(pageId);
    }

    // Public API
    return {
        init,
        setActivePage
    };
})();