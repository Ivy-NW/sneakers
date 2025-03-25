// auth.js - Handles user authentication and management

// Initialize user state
let currentUser = null;

// Check if user is already logged in
function checkAuthState() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
}

// Register a new user
function registerUser(name, email, password) {
    // Get existing users or initialize empty array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
        return { success: false, message: 'Email already registered' };
    }
    
    // Create new user object
    const newUser = {
        id: generateUserId(),
        name,
        email,
        password, // In a real app, this would be hashed
        credits: 100, // Give new users 10 free credits
        wallet: generateMockWalletAddress(),
        createdAt: new Date().toISOString(),
        verifications: [],
        certificates: []
    };
    
    // Add to users array and save
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set as current user
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    return { success: true, user: newUser };
}

// Login existing user
function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return { success: false, message: 'Invalid email or password' };
    }
    
    // Set as current user
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    return { success: true, user };
}

// Logout current user
function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForLoggedOutUser();
}

// Update UI for logged in state
function updateUIForLoggedInUser() {
    // Hide auth buttons, show user profile
    document.getElementById('auth-buttons').classList.add('hidden');
    document.getElementById('user-profile').classList.remove('hidden');
    
    // Update user info
    document.getElementById('username').textContent = currentUser.name.split(' ')[0];
    document.getElementById('user-initial').textContent = currentUser.name.charAt(0);
    document.getElementById('user-credits').textContent = `${currentUser.credits} Credits`;
    
    // Enable restricted pages
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('disabled'));
}

// Update UI for logged out state
function updateUIForLoggedOutUser() {
    // Show auth buttons, hide user profile
    document.getElementById('auth-buttons').classList.remove('hidden');
    document.getElementById('user-profile').classList.add('hidden');
    
    // Navigate to home page
    showPage('home');
}

// Helper functions
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

function generateMockWalletAddress() {
    return '0.0.' + Math.floor(Math.random() * 1000000);
}

// Add credits to user account
function addCreditsToUser(userId, amount) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return false;
    
    // Update user credits
    users[userIndex].credits += amount;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current user if it's the same user
    if (currentUser && currentUser.id === userId) {
        currentUser.credits += amount;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        document.getElementById('user-credits').textContent = `${currentUser.credits} Credits`;
    }
    
    return true;
}

// Deduct credits from user account
function deductCreditsFromUser(userId, amount) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return false;
    if (users[userIndex].credits < amount) return false;
    
    // Update user credits
    users[userIndex].credits -= amount;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current user if it's the same user
    if (currentUser && currentUser.id === userId) {
        currentUser.credits -= amount;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        document.getElementById('user-credits').textContent = `${currentUser.credits} Credits`;
    }
    
    return true;
}

// Initialize auth state on page load
document.addEventListener('DOMContentLoaded', checkAuthState);