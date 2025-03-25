// dashboard.js - Handles user dashboard and navigation

// Initialize dashboard
function initDashboard() {
    // Set up navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // Set up auth buttons
    document.getElementById('login-btn').addEventListener('click', () => showPage('login'));
    document.getElementById('register-btn').addEventListener('click', () => showPage('register'));
    document.getElementById('logout-btn').addEventListener('click', logoutUser);
    
    // Set up profile dropdown
    document.getElementById('profile-btn').addEventListener('click', function() {
        const dropdown = document.getElementById('profile-dropdown');
        dropdown.classList.toggle('hidden');
    });
    
    // Set up login form
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const result = loginUser(email, password);
        if (result.success) {
            showPage('home');
        } else {
            alert(result.message);
        }
    });
    
    // Set up register form
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        const result = registerUser(name, email, password);
        if (result.success) {
            showPage('home');
        } else {
            alert(result.message);
        }
    });
    
    // Set up form toggle links
    document.getElementById('show-register').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('register');
    });
    
    document.getElementById('show-login').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('login');
    });
    
    // Set up get started button
    document.getElementById('get-started-btn').addEventListener('click', function() {
        if (currentUser) {
            showPage('verify');
        } else {
            showPage('login');
        }
    });
    
    // Set up verification result buttons
    document.getElementById('back-to-verify-btn').addEventListener('click', function() {
        showPage('verify');
    });
    
    document.getElementById('share-result-btn').addEventListener('click', function() {
        alert('Sharing functionality would be implemented in a production version.');
    });
    
    // Set up start verification button in certificates page
    document.getElementById('start-verification-btn').addEventListener('click', function() {
        showPage('verify');
    });
}

// Show specific page
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(page => {
        page.classList.add('hidden');
    });
    
    // Show requested page
    document.getElementById(`${pageId}-page`).classList.remove('hidden');
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
    
    // Special handling for certain pages
    if (pageId === 'certificates') {
        loadCertificatesGallery();
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', initDashboard);