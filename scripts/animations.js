

// Initialize page transition animations
function initPageTransitions() {
    // Add fade-in class to main content
    const pageContent = document.querySelector('.page-content');
    if (pageContent) {
        pageContent.classList.add('fade-in');
    }

    // Add hero fade animation to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.classList.add('hero-fade');
    }

    // Add staggered animations to product cards
    const productCards = document.querySelectorAll('.product-card');
    if (productCards.length > 0) {
        productCards.forEach((card, index) => {
            // Limit to 5 delay classes (we defined 5 in CSS)
            const delayClass = `stagger-delay-${Math.min(index + 1, 5)}`;
            card.classList.add('stagger-item', delayClass);
        });
    }

    // Add staggered animations to category cards
    const categoryCards = document.querySelectorAll('.category-card');
    if (categoryCards.length > 0) {
        categoryCards.forEach((card, index) => {
            const delayClass = `stagger-delay-${Math.min(index + 1, 5)}`;
            card.classList.add('stagger-item', delayClass);
        });
    }
}

// Initialize micro-interactions
function initMicroInteractions() {
    // Add button press effect to all buttons
    const buttons = document.querySelectorAll('button:not(.icon-cart)');
    if (buttons.length > 0) {
        buttons.forEach(button => {
            button.classList.add('button-press');
        });
    }

    // Add animated input effect to form inputs
    const formInputs = document.querySelectorAll('input, textarea, select');
    if (formInputs.length > 0) {
        formInputs.forEach(input => {
            input.classList.add('animated-input');
        });
    }

    // Add success message animation
    setupSuccessMessageAnimation();
}

// Add cart bounce animation to the cart counter
function addCartBounceAnimation() {
    const cartIcon = document.querySelector('.icon-cart span');
    if (cartIcon) {
        cartIcon.classList.add('cart-bounce');
        setTimeout(() => {
            cartIcon.classList.remove('cart-bounce');
        }, 500);
    }
}

// Setup success message animation
function setupSuccessMessageAnimation() {
    // Find success messages
    const successMessages = document.querySelectorAll('.success-message');

    if (successMessages.length > 0) {
        successMessages.forEach(message => {
            // Add animation class when the message is displayed
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'style' &&
                        message.style.display === 'block') {
                        message.classList.add('success-animation');
                    }
                });
            });

            observer.observe(message, { attributes: true });
        });
    }
}

// Add shake animation to an element (for error states)
function addShakeAnimation(element) {
    if (!element) return;

    // Add the animation class
    element.classList.add('shake-animation');

    // Remove the animation class after it completes
    setTimeout(() => {
        element.classList.remove('shake-animation');
    }, 600);
}

// Initialize all animations
function initAnimations() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initPageTransitions();
            initMicroInteractions();
        });
    } else {
        initPageTransitions();
        initMicroInteractions();
    }
}

// Run initialization
initAnimations();

// Export functions for use in other scripts
export {
    addShakeAnimation,
    addCartBounceAnimation
};
