// Authentication Module
const Auth = (function() {
    // Default users
    const defaultUsers = [
        { username: 'admin', password: 'admin', role: 'expert', name: 'Administrator' },
        { username: 'user', password: 'user', role: 'user', name: 'User' }
    ];

    let currentMode = 'user'; // 'user' or 'expert'

    // Initialize users in localStorage if not exists
    function initUsers() {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }
    }

    // Set user mode (for default user access)
    function setUserMode() {
        currentMode = 'user';
        localStorage.removeItem('currentUser');
    }

    // Check if user is logged in as admin
    function isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    }

    // Get current user
    function getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            return JSON.parse(userData);
        }
        
        // Return default user data if not logged in as admin
        return {
            username: 'user',
            role: 'user',
            name: 'User'
        };
    }

    // Login function (only for admin)
    function login(username, password) {
        // Reset data when logging in as admin
        if (username === 'admin') {
            DataManager.resetData();
        }
        
        // Always use defaultUsers for authentication
        const user = defaultUsers.find(u => u.username === username && u.password === password);
        
        if (user && user.role === 'expert') {
            const userData = {
                username: user.username,
                role: user.role,
                name: user.name
            };
            localStorage.setItem('currentUser', JSON.stringify(userData));
            currentMode = 'expert';
            return userData;
        }
        
        return null;
    }

    // Logout function
    function logout() {
        localStorage.removeItem('currentUser');
        currentMode = 'user';
        // Don't clear all localStorage data, just reset to user mode
    }

    // Get current mode
    function getCurrentMode() {
        return currentMode;
    }

    // Initialize
    initUsers();

    // Public API
    return {
        isLoggedIn,
        getCurrentUser,
        login,
        logout,
        setUserMode,
        getCurrentMode
    };
})();