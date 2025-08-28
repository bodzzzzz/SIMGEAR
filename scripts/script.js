let cart = [];

// Select elements
const cartIcon = document.querySelector('.icon-cart span');
const listCart = document.querySelector('.listCart');
const cartTab = document.getElementById('cartTab');
const closeBtn = document.querySelector('.close');

// Load cart from localStorage
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

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart display
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
            const displayQty = qty;

            // Updated innerHTML to match the style in allProducts.js
            itemDiv.innerHTML = `
                <div class="image">
                    <img src="${item.image || ''}" alt="${item.name || 'Unknown Item'}">
                </div>
                <div class="name">${item.name || 'Unknown Item'}</div>
                <div class="totalPrice">$${displayPrice}</div>
                <div class="quantity">
                    <span class="minus" data-id="${item.id || ''}">-</span>
                    <span class="quantity-text">${displayQty}</span>
                    <span class="plus" data-id="${item.id || ''}">+</span>
                </div>
            `;
            listCart.appendChild(itemDiv);
        });
    }

    cartIcon.textContent = totalQty;

    // Reattach quantity update handlers
    document.querySelectorAll('.plus').forEach(btn =>
        btn.addEventListener('click', () => updateQty(btn.dataset.id, 1)));
    document.querySelectorAll('.minus').forEach(btn =>
        btn.addEventListener('click', () => updateQty(btn.dataset.id, -1)));
}

// Update quantity
function updateQty(id, change) {
    const item = cart.find(p => p.id === id);
    if (!item) return;

    item.quantity = (Number(item.quantity) || 0) + change;
    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }
    saveCartToLocalStorage();
    updateCartDisplay();
}

// Import cart animations
import { animateCartCounter, animateAddToCartButton } from '/scripts/cart-animations.js';

// Add to cart
function addToCart(product, button = null) {
    const itemInCart = cart.find(item => item.id === product.id);
    if (itemInCart) {
        itemInCart.quantity = (itemInCart.quantity || 0) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCartToLocalStorage();
    updateCartDisplay();

    // Animate cart counter
    animateCartCounter();

    // Animate button if provided
    if (button) {
        animateAddToCartButton(button);
    }
}

// Initialize cart functionality
function initializeCart() {
    loadCartFromLocalStorage();

    const cartIconBtn = document.querySelector('.icon-cart');
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
}

// Initialize featured products functionality
function initializeFeaturedProducts() {
    const modal = document.getElementById("productModal");
    const modalImg = document.getElementById("modalImg");
    const modalName = document.getElementById("modalName");
    const modalPrice = document.getElementById("modalPrice");
    const modalAddToCart = document.getElementById("modalAddToCart");
    const closeModal = document.querySelector(".close-modal");

    let selectedProduct = null;

    // Get featured products
    const featuredProducts = document.querySelectorAll('.product-link');

    // Add click event listeners to featured products
    featuredProducts.forEach((productLink, index) => {
        const productCard = productLink.querySelector('.product-card');
        const img = productCard.querySelector('img');
        const name = productCard.querySelector('h3').textContent;
        const priceText = productCard.querySelector('.price').textContent
            .replace('LE ', '')
            .replace('$', '')
            .split(' ')[0]; // Get first price if there's an old price
        const price = parseFloat(priceText);

        const product = {
            id: `featured-${index + 1}`,
            name,
            price,
            image: img.src,
        };

        // Prevent default anchor behavior and show modal
        productLink.addEventListener('click', (e) => {
            e.preventDefault();
            selectedProduct = product;
            modalImg.src = product.image;
            modalName.textContent = product.name;
            modalPrice.textContent = `$ ${product.price}`;
            modal.style.display = "flex";
        });
    });

    // Add to cart from modal
    modalAddToCart.addEventListener('click', () => {
        if (selectedProduct) {
            addToCart(selectedProduct, modalAddToCart);
            modal.style.display = "none";
        }
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = "none";
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

// Update exports to include the new function
export { initializeCart, addToCart, updateCartDisplay, initializeFeaturedProducts };