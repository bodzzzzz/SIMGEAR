// Track status and cart functionality
let cart = [];
const cartIcon = document.querySelector('.icon-cart span');
const listCart = document.querySelector('.listCart');

// Track order status popup functions
function openStatusPopup() {
    document.getElementById('statusPopup').classList.add('open-popup');
    document.getElementById('overlay').classList.add('overlay-open');
}

function closeStatusPopup() {
    document.getElementById('statusPopup').classList.remove('open-popup');
    document.getElementById('overlay').classList.remove('overlay-open');
}

// Initialize cart buttons using event delegation
function initializeCartButtons() {
    const table = document.querySelector('.history-table');
    if (table) {
        table.addEventListener('click', handleCartButtonClick);
    }
}

function handleCartButtonClick(event) {
    if (event.target.classList.contains('add-to-cart')) {
        const button = event.target;
        const row = button.closest('tr');
        const name = row.querySelector('.product-info span').textContent.trim();
        const priceElement = row.querySelector('.new-price') || row.querySelector('.price') || row.querySelector('.old-price');
        const priceText = priceElement?.textContent.replace('$', '') || '0';
        const price = parseFloat(priceText);
        const img = row.querySelector('.product-img').getAttribute('src');

        const product = {
            id: name || 'unknown',
            name: name || 'Unknown Item',
            price: isNaN(price) ? 0 : price,
            image: img || ''
        };

        addToCart(product, button);
    }
}

function addToCart(product, button = null) {
    const itemInCart = cart.find(item => item.id === product.id);
    if (itemInCart) {
        itemInCart.quantity = (itemInCart.quantity || 0) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCartToLocalStorage();
    updateCartDisplay();

    // Add cart animation
    if (cartIcon) {
        cartIcon.classList.add('cart-bounce');
        setTimeout(() => {
            cartIcon.classList.remove('cart-bounce');
        }, 500);
    }

    // Animate button if provided
    if (button) {
        button.classList.add('add-to-cart-animation');
        setTimeout(() => {
            button.classList.remove('add-to-cart-animation');
        }, 500);
    }
}

function updateCartDisplay() {
    if (!listCart || !cartIcon) return;

    listCart.innerHTML = '';
    let totalQty = 0;

    if (cart.length === 0) {
        listCart.innerHTML = '<div class="item"><div class="name">Your cart is empty!</div></div>';
    } else {
        cart.forEach(item => {
            const qty = Number(item.quantity) || 0;
            totalQty += qty;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            const price = Number(item.price) || 0;
            const displayPrice = (price * qty).toFixed(2);
            itemDiv.innerHTML = `
                <div class="image">
                    <img src="${item.image || ''}" alt="${item.name || 'Unknown Item'}">
                </div>
                <div class="name">${item.name || 'Unknown Item'}</div>
                <div class="totalPrice">$${displayPrice}</div>
                <div class="quantity">
                    <span class="minus" data-id="${item.id || ''}">-</span>
                    <span class="quantity-text">${qty}</span>
                    <span class="plus" data-id="${item.id || ''}">+</span>
                </div>
            `;
            listCart.appendChild(itemDiv);
        });
    }

    cartIcon.textContent = totalQty;

    // Add event listeners for quantity buttons
    document.querySelectorAll('.plus').forEach(btn =>
        btn.addEventListener('click', () => updateQty(btn.dataset.id, 1)));
    document.querySelectorAll('.minus').forEach(btn =>
        btn.addEventListener('click', () => updateQty(btn.dataset.id, -1)));
}

function updateQty(id, change) {
    const item = cart.find(p => p.id === id);
    if (!item) return;

    item.quantity = (Number(item.quantity) || 0) + change;
    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }
    saveCartToLocalStorage();
    updateCartDisplay();

    // Add cart animation
    if (cartIcon) {
        cartIcon.classList.add('cart-bounce');
        setTimeout(() => {
            cartIcon.classList.remove('cart-bounce');
        }, 500);
    }
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartDisplay();
        }
    } catch (error) {
        console.error("Error loading cart from local storage:", error);
        cart = [];
        updateCartDisplay();
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart
    loadCartFromLocalStorage();
    initializeCartButtons();

    // Set up cart toggle functionality
    const cartIconBtn = document.querySelector('.icon-cart');
    const closeBtn = document.querySelector('.close');
    const cartTab = document.getElementById('cartTab');

    if (cartIconBtn) {
        cartIconBtn.addEventListener('click', () => {
            cartTab.classList.add('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            cartTab.classList.remove('active');
        });
    }
});
