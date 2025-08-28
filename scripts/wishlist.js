
let cart = [];
let wishlist = [];

const cartIcon = document.querySelector('.icon-cart span');
const listCart = document.querySelector('.listCart');
const wishlistTableBody = document.querySelector('.wishlist-table tbody');
const emptyMessage = document.getElementById('empty');

function loadCartFromLocalStorage() {
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartDisplay();
        }
    } catch (error) {
        console.error("Error loading cart:", error);
        cart = [];
        updateCartDisplay();
    }
}

function loadWishlistFromLocalStorage() {
    try {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            wishlist = JSON.parse(savedWishlist);
            updateWishlistDisplay();
        }
    } catch (error) {
        console.error("Error loading wishlist:", error);
        wishlist = [];
        updateWishlistDisplay();
    }
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function saveWishlistToLocalStorage() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function updateWishlistDisplay() {
    wishlistTableBody.innerHTML = '';
    if (wishlist.length === 0) {
        emptyMessage.style.display = 'block';
        document.querySelector('.wishlist-table').style.display = 'none';
        return;
    }

    emptyMessage.style.display = 'none';
    document.querySelector('.wishlist-table').style.display = 'table';

    wishlist.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="product-info">
                <img src="${item.image}" alt="${item.name}" class="product-img">
                <span>${item.name}</span>
            </td>
            <td>
                ${item.oldPrice ? `<span class="old-price">$${item.oldPrice.toFixed(2)}</span> ` : ''}
                <span class="new-price">$${item.price.toFixed(2)}</span>
            </td>
            <td class="stock-info">
                <span>In Stock</span>
                <small>Added on: ${item.addedDate ? new Date(item.addedDate).toLocaleDateString() : 'Unknown'}</small>
                <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
            </td>
            <td>
                <i class="fa-solid fa-trash delete-icon" data-id="${item.id}"></i>
            </td>
        `;
        wishlistTableBody.appendChild(row);
    });
}

function initializeEventListeners() {
    const wishlistTable = document.querySelector('.wishlist-table');
    if (!wishlistTable) return;

    wishlistTable.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('add-to-cart')) {
            const product = wishlist.find(item => item.id === target.dataset.id);
            if (product) addToCart(product, target);
        } else if (target.classList.contains('delete-icon')) {
            showConfirmationModal(target.dataset.id);
        }
    });

    listCart.addEventListener('click', (event) => {
        const plus = event.target.closest('.plus');
        const minus = event.target.closest('.minus');
        if (plus) updateQty(plus.dataset.id, 1);
        if (minus) updateQty(minus.dataset.id, -1);
    });
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

    if (cartIcon) {
        cartIcon.classList.add('cart-bounce');
        setTimeout(() => cartIcon.classList.remove('cart-bounce'), 500);
    }

    if (button) {
        button.classList.add('add-to-cart-animation');
        setTimeout(() => button.classList.remove('add-to-cart-animation'), 500);
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
            itemDiv.innerHTML = `
                <div class="image">
                    <img src="${item.image || ''}" alt="${item.name || 'Unknown Item'}">
                </div>
                <div class="name">${item.name || 'Unknown Item'}</div>
                <div class="totalPrice">$${(price * qty).toFixed(2)}</div>
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

    if (cartIcon) {
        cartIcon.classList.add('cart-bounce');
        setTimeout(() => cartIcon.classList.remove('cart-bounce'), 500);
    }
}

function showConfirmationModal(id) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    const modal = document.createElement('div');
    modal.className = 'confirmation-modal';
    modal.innerHTML = `
        <p>Are you sure you want to remove this item from your wishlist?</p>
        <div class="modal-buttons">
            <button class="confirm-yes">Yes</button>
            <button class="confirm-no">No</button>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    setTimeout(() => {
        overlay.classList.add('active');
        modal.classList.add('active');
    }, 10);

    const closeModal = () => {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            overlay.remove();
        }, 300);
    };

    modal.querySelector('.confirm-yes').addEventListener('click', () => {
        wishlist = wishlist.filter(item => item.id !== id);
        saveWishlistToLocalStorage();
        updateWishlistDisplay();
        closeModal();
    }, { once: true });

    modal.querySelector('.confirm-no').addEventListener('click', closeModal, { once: true });
    overlay.addEventListener('click', closeModal, { once: true });
}

document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    loadWishlistFromLocalStorage();
    updateWishlistDisplay();
    initializeEventListeners();

    const cartIconBtn = document.querySelector('.icon-cart');
    const closeBtn = document.querySelector('.close');
    const cartTab = document.getElementById('cartTab');

    if (cartIconBtn && cartTab) {
        cartIconBtn.addEventListener('click', () => cartTab.classList.add('active'));
    }

    if (closeBtn && cartTab) {
        closeBtn.addEventListener('click', () => cartTab.classList.remove('active'));
    }
});
