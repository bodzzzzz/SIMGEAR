/**
 * SIMGEAR Contact Form Functionality
 * Handles contact form validation and submission
 */

let animationFunctions = {};
try {
    import('/scripts/animations.js')
        .then(module => {
            animationFunctions = module;
        })
        .catch(() => {
            console.log('Animations module not available');
        });
} catch (e) {
    console.log('Animations import not supported');
}

/**
 * Initialize contact form validation and submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');

    if (!contactForm || !successMessage) {
        console.log('Contact form elements not found');
        return;
    }

    // Add form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate form
        if (validateForm(contactForm)) {
            handleFormSubmission(contactForm, successMessage);
        }
    });

    console.log('Contact form initialized');
}

/**
 * Handle form submission
 * @param {HTMLFormElement} form - The contact form element
 * @param {HTMLElement} successMessage - The success message element
 */
function handleFormSubmission(form, successMessage) {
    // Show success message
    successMessage.style.display = 'block';
    if (successMessage.classList) {
        successMessage.classList.add('success-animation');
    }

    // Reset form
    form.reset();

    // Hide success message after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

/**
 * Validate form fields
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(form) {
    let isValid = true;

    // Get form fields
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const subject = form.querySelector('#subject');
    const message = form.querySelector('#message');

    // Reset previous error states
    removeErrorStates([name, email, subject, message]);

    // Validate name
    if (!name.value.trim()) {
        addErrorState(name, 'Please enter your name');
        isValid = false;
    }

    // Validate email
    if (!email.value.trim()) {
        addErrorState(email, 'Please enter your email');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        addErrorState(email, 'Please enter a valid email address');
        isValid = false;
    }

    // Validate subject
    if (!subject.value) {
        addErrorState(subject, 'Please select a subject');
        isValid = false;
    }

    // Validate message
    if (!message.value.trim()) {
        addErrorState(message, 'Please enter your message');
        isValid = false;
    }

    return isValid;
}

/**
 * Add error state to a form field
 * @param {HTMLElement} element - The form field element
 * @param {string} message - The error message
 */
function addErrorState(element, message) {
    if (!element) return;

    element.classList.add('error');

    // Create error message element if it doesn't exist
    let errorElement = element.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        element.parentNode.appendChild(errorElement);
    }

    errorElement.textContent = message;

    // Add shake animation if available
    if (animationFunctions.addShakeAnimation) {
        animationFunctions.addShakeAnimation(element);
    } else {
        // Fallback animation if animations module not available
        element.classList.add('shake-animation');
        setTimeout(() => {
            element.classList.remove('shake-animation');
        }, 600);
    }
}

/**
 * Remove error states from form fields
 * @param {Array<HTMLElement>} elements - The form field elements
 */
function removeErrorStates(elements) {
    elements.forEach(element => {
        if (element) {
            element.classList.remove('error');

            // Remove error message if it exists
            const errorElement = element.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        }
    });
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Export functions for use in other scripts
export { initContactForm, validateForm };
