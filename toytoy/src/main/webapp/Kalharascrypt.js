// DOM Elements
const overlays = {
    auth: document.getElementById('auth-overlay'),
    profile: document.getElementById('profile-overlay'),
    premium: document.getElementById('premium-overlay'),
    premiumSuccess: document.getElementById('premium-overlay2'),
    cart: document.getElementById('cart-overlay'),
    forgot: document.getElementById('forgot-overlay'),
    logout: document.getElementById('logout-overlay')
};

const buttons = {
    login: document.getElementById('login-btn'),
    profile: document.getElementById('profile-btn'),
    premium: document.getElementById('premium-btn'),
    showRegister: document.getElementById('show-register'),
    showLogin: document.getElementById('show-login'),
    cart: document.getElementById('cart-btn'),
    getPremium: document.getElementById('get-premium-btn'),
    forgotPassword: document.getElementById('forgot-password-link'),
    showLoginFromForgot: document.getElementById('show-login-from-forgot'),
    loginSubmit: document.getElementById('login-submit'),
    registerSubmit: document.getElementById('register-submit'),
    resetPassword: document.getElementById('reset-password-btn'),
    loginClose: document.getElementById('login-close-btn'),
    logoutConfirm: document.getElementById('logout-confirm-btn'),
    logoutCancel: document.getElementById('logout-cancel-btn')
};

const mainContent = document.getElementById('main-content');

// Initialize the application
function init() {
    setupEventListeners();
    showOverlay('auth');
    showAuthForm('login');
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation buttons
    buttons.login?.addEventListener('click', (e) => {
        e.preventDefault();
        showOverlay('auth');
        showAuthForm('login');
    });

    buttons.profile?.addEventListener('click', (e) => {
        e.preventDefault();
        showOverlay('profile');
    });

    buttons.premium?.addEventListener('click', (e) => {
        e.preventDefault();
        showOverlay('premium');
    });

    buttons.cart?.addEventListener('click', (e) => {
        e.preventDefault();
        showOverlay('cart');
    });

    // Auth form buttons
    buttons.showRegister?.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthForm('register');
    });

    buttons.showLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthForm('login');
    });

    buttons.forgotPassword?.addEventListener('click', (e) => {
        e.preventDefault();
        showOverlay('forgot');
    });

    buttons.showLoginFromForgot?.addEventListener('click', (e) => {
        e.preventDefault();
        showOverlay('auth');
        showAuthForm('login');
    });

    // Form submissions
    buttons.loginSubmit?.addEventListener('click', handleLogin);
    buttons.registerSubmit?.addEventListener('click', handleRegister);
    buttons.resetPassword?.addEventListener('click', handleResetPassword);

    // Premium flow
    buttons.getPremium?.addEventListener('click', function(e) {
        e.preventDefault();
        fetch('/premium', {
            method: 'POST'
        })
        .then(response => response.text())
        .then(data => {
            if (data === 'success') {
                overlays.premiumSuccess.classList.remove('hidden');
                document.querySelector('.premium-wrapper').classList.add('hidden');
                buttons.premium.textContent = 'Premium👑 (Active)';
            } else {
                alert('Premium upgrade failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Premium upgrade failed');
        });
    });

    // Login close button with confirmation
    buttons.loginClose?.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm("You must login to access the site. Would you like to refresh the page?")) {
            location.reload();
        }
    });

    // Logout buttons
    buttons.logoutConfirm?.addEventListener('click', confirmLogout);
    buttons.logoutCancel?.addEventListener('click', () => {
        overlays.logout.classList.add('hidden');
    });

    // Close buttons
    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const overlay = this.closest('.overlay');
            
            // Special handling for premium success overlay
            if (overlay.id === 'premium-overlay2') {
                document.querySelector('.premium-wrapper').classList.remove('hidden');
                overlays.premium.classList.add('hidden');
            }
            
            overlay.classList.add('hidden');
        });
    });

    // Prevent closing auth overlay when clicking outside forms
    document.querySelectorAll('.auth-wrapper, .profile-container, .premium-container, .cart-container').forEach(form => {
        form.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

// Show specific overlay
function showOverlay(overlayKey) {
    // Hide all overlays except the one being shown
    Object.entries(overlays).forEach(([key, overlay]) => {
        if (overlay && key !== overlayKey) {
            overlay.classList.add('hidden');
        }
    });
    
    if (overlays[overlayKey]) {
        overlays[overlayKey].classList.remove('hidden');
    }
}

// Show specific auth form
function showAuthForm(formType) {
    if (formType === 'login') {
        document.getElementById('login-wrapper').classList.remove('hidden');
        document.getElementById('register-wrapper').classList.add('hidden');
    } else if (formType === 'register') {
        document.getElementById('register-wrapper').classList.remove('hidden');
        document.getElementById('login-wrapper').classList.add('hidden');
    }
}

// Handle login
function handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (username && password) {
        fetch('/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        })
        .then(response => response.text())
        .then(data => {
            if (data === 'success') {
                overlays.auth.classList.add('hidden');
                mainContent.classList.remove('hidden');
                buttons.login.innerHTML = `<a href="#" id="logout-btn" class="highlight">Logout (${username})↪️</a>`;
                document.getElementById('logout-btn').addEventListener('click', handleLogout);
            } else {
                alert('Invalid username or password');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login failed. Please try again.');
        });
    } else {
        alert('Please fill in all fields');
    }
}

// Handle register
function handleRegister() {
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    if (!username || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    fetch('/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=register&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&email=${encodeURIComponent(email)}&confirmPassword=${encodeURIComponent(confirmPassword)}`
    })
    .then(response => response.text())
    .then(data => {
        if (data === 'success') {
            overlays.auth.classList.add('hidden');
            mainContent.classList.remove('hidden');
            buttons.login.innerHTML = `<a href="#" id="logout-btn" class="highlight">Logout (${username})↪️</a>`;
            document.getElementById('logout-btn').addEventListener('click', handleLogout);
        } else if (data === 'username_exists') {
            alert('Username already exists');
        } else {
            alert('Registration failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Registration failed. Please try again.');
    });
}

// Handle password reset
function handleResetPassword() {
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;
    
    if (!newPassword || !confirmNewPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        alert('Passwords do not match');
        return;
    }
    
    alert('Password updated successfully!');
    showOverlay('auth');
    showAuthForm('login');
}

// Handle logout click (shows confirmation dialog)
function handleLogout(e) {
    e.preventDefault();
    showOverlay('logout');
}

// Confirm logout action
function confirmLogout() {
    fetch('/logout', {
        method: 'POST'
    })
    .then(response => response.text())
    .then(data => {
        if (data === 'success') {
            location.reload();
        } else {
            alert('Logout failed. Please try again.');
            overlays.logout.classList.add('hidden');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Logout failed. Please try again.');
        overlays.logout.classList.add('hidden');
    });
}

// Update profile handling
function handleProfileUpdate() {
    const email = document.getElementById('email').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    
    fetch('/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`
    })
    .then(response => response.text())
    .then(data => {
        if (data === 'success') {
            alert('Profile updated successfully');
            overlays.profile.classList.add('hidden');
        } else {
            alert('Profile update failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Profile update failed');
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);