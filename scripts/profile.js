let cart = [];

// Select elements
const cartIcon = document.querySelector('.icon-cart span');
const listCart = document.querySelector('.listCart');
const cartTab = document.getElementById('cartTab');
const closeBtn = document.querySelector('.close');
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');

// Load cart from localStorage
function loadCartFromLocalStorage() {
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            console.log('Profile page - Loaded cart:', cart);
            updateCartDisplay();
        }
    } catch (error) {
        console.error('Error loading cart from local storage:', error);
        cart = [];
        updateCartDisplay();
    }
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Profile page - Saved cart:', cart);
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

    // Add cart animation
    if (cartIcon) {
        cartIcon.classList.add('cart-bounce');
        setTimeout(() => {
            cartIcon.classList.remove('cart-bounce');
        }, 500);
    }
}

// Profile form handling
document.getElementById('pfpInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const dataUrl = event.target.result;
            document.getElementById('profileImage').src = dataUrl;
            localStorage.setItem('profileImage', dataUrl);
        };
        reader.readAsDataURL(file);
    }
});

window.addEventListener('load', () => {
    const fields = ['first-name', 'last-name', 'dob', 'gender', 'profileImage'];
    fields.forEach(id => {
        const saved = localStorage.getItem(id);
        if (saved) {
            if (id === 'profileImage') {
                document.getElementById('profileImage').src = saved;
            } else if (id === 'gender') {
                document.querySelector(`input[name="gender"][value="${saved}"]`).checked = true;
            } else {
                document.getElementById(id).value = saved;
            }
        }
    });
});

document.querySelectorAll('#first-name, #last-name, #dob').forEach(input => {
    input.addEventListener('input', () => {
        localStorage.setItem(input.id, input.value);
    });
});

document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.checked) {
            localStorage.setItem('gender', radio.value);
        }
    });
});

// Popup handling
window.Open = function() {
    popup.classList.add('open-popup');
    overlay.classList.add('overlay-open');
};

window.Close = function() {
    popup.classList.remove('open-popup');
    overlay.classList.remove('overlay-open');
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();

    const cartIconBtn = document.querySelector('.icon-cart');
    cartIconBtn.addEventListener('click', () => {
        cartTab.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        cartTab.classList.remove('active');
    });
});