// app.js - Main application initialization and coordination

// Initialize application
function initApp() {
    console.log('Initializing SneakerVerify application...');
    
    // Check for existing users, create demo user if none exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
        console.log('Creating demo user...');
        registerUser('Demo User', 'demo@example.com', 'password');
    }
    
    // Set up click outside handler for dropdowns
    document.addEventListener('click', function(event) {
        const profileBtn = document.getElementById('profile-btn');
        const profileDropdown = document.getElementById('profile-dropdown');
        
        if (profileBtn && profileDropdown && !profileBtn.contains(event.target) && !profileDropdown.contains(event.target)) {
            profileDropdown.classList.add('hidden');
        }
    });
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', function() {
        const currentPage = window.location.hash.substring(1) || 'home';
        showPage(currentPage);
    });
    
    // Set initial page based on URL hash
    const initialPage = window.location.hash.substring(1) || 'home';
    showPage(initialPage);
    
    console.log('Application initialized');
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);