/**
 * SIMGEAR Cart Animations
 * Simple, direct animations for the cart functionality
 */

// Function to animate the cart counter
function animateCartCounter() {
    const cartCounter = document.querySelector('.icon-cart span');
    if (!cartCounter) return;
    
    // Add the animation class
    cartCounter.classList.add('cart-bounce');
    
    // Remove the animation class after it completes
    setTimeout(() => {
        cartCounter.classList.remove('cart-bounce');
    }, 500);
}

// Function to animate an add to cart button
function animateAddToCartButton(button) {
    if (!button) return;
    
    // Add the animation class
    button.classList.add('add-to-cart-animation');
    
    // Remove the animation class after it completes
    setTimeout(() => {
        button.classList.remove('add-to-cart-animation');
    }, 500);
}

// Export the functions
export { animateCartCounter, animateAddToCartButton };
