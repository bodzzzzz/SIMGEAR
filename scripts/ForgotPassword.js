/**
 * Forgot Password Page Script
 * Handles form validation and password reset request functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const form = document.querySelector('.form');
    const emailInput = document.querySelector('#email');

    /**
     * Form submission event handler
     * Prevents default form submission and processes the reset request
     */
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            processReset();
        }
    });

    /**
     * Validates the form input
     * Checks if the email field is filled out
     * @returns {boolean} - Whether the form is valid
     */
    function validateForm() {
        let isValid = true;

        // Check if email is empty
        if (!emailInput.value.trim()) {
            // Add error styling
            emailInput.classList.add('error');
            isValid = false;

            // Add error message if it doesn't exist
            if (!emailInput.nextElementSibling?.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                emailInput.insertAdjacentElement('afterend', errorMsg);
            }
        } else {
            // Remove error styling and message
            emailInput.classList.remove('error');
            const errorMsg = emailInput.nextElementSibling;
            if (errorMsg?.classList.contains('error-message')) {
                errorMsg.remove();
            }
        }

        return isValid;
    }

    /**
     * Process the password reset request
     * In a real application, this would send a request to the server
     */
    function processReset() {
        // Show success message
        alert('A password reset link has been sent to your email.');

        // Clear the form after a short delay
        setTimeout(() => {
            emailInput.value = '';
        }, 1000);
    }
});