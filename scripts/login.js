/**
 * Login and Registration Page Script
 * Handles form toggling, validation, and submission for login and registration
 */

// Get DOM elements for form toggling
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const mobileRegisterBtn = document.getElementById('mobile-register');
const mobileLoginBtn = document.getElementById('mobile-login');

/**
 * Toggle to registration form when register button is clicked
 * Adds 'active' class to container to trigger CSS transition
 */
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

/**
 * Toggle to login form when login button is clicked
 * Removes 'active' class from container to trigger CSS transition
 */
loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

/**
 * Mobile-specific navigation buttons
 * These buttons appear only on mobile devices
 */
// Mobile register button handler
if (mobileRegisterBtn) {
    mobileRegisterBtn.addEventListener('click', () => {
        container.classList.add("active");
    });
}

// Mobile login button handler
if (mobileLoginBtn) {
    mobileLoginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });
}

/**
 * Form submission and redirection functionality
 * Handles login and registration form submissions
 */
document.addEventListener('DOMContentLoaded', () => {
    /**
     * Login form submission handler
     * Validates user input and redirects to home page on success
     */
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form values
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Simple validation - check if fields are filled
        if (username && password) {
            window.location.href = '/pages/index.html';
        }
    });

    /**
     * Registration form submission handler
     * Validates user input and redirects to home page on success
     */
    document.getElementById('registration-form').addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form values
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        // Simple validation - check if all fields are filled
        if (username && email && password) {
            window.location.href = '/pages/index.html';
        }
    });

    /**
     * Prevent default action for toggle buttons
     * This ensures they don't interfere with form submission
     */
    // Prevent default for desktop toggle buttons
    document.getElementById('login').addEventListener('click', function(e) {
        e.preventDefault();
    });

    document.getElementById('register').addEventListener('click', function(e) {
        e.preventDefault();
    });

    // Prevent default for mobile toggle buttons
    if (document.getElementById('mobile-login')) {
        document.getElementById('mobile-login').addEventListener('click', function(e) {
            e.preventDefault();
        });
    }

    if (document.getElementById('mobile-register')) {
        document.getElementById('mobile-register').addEventListener('click', function(e) {
            e.preventDefault();
        });
    }
});