let cart = [];
let wishlist = [];

// === SELECT ELEMENTS ===
const cartIcon = document.querySelector('.icon-cart span');
const listCart = document.querySelector('.listCart');
const items = document.querySelectorAll('.productsList .item');

// === MODAL ELEMENTS ===
const modal = document.getElementById("productModal");
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalAddToCart = document.getElementById("modalAddToCart");
const closeModal = document.querySelector(".close-modal");

let selectedProduct = null;

// === LOAD CART AND WISHLIST FROM LOCALSTORAGE ===
function loadCart() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        console.log('Loaded cart:', cart);
    }
}

function loadWishlist() {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
        wishlist = JSON.parse(storedWishlist);
        console.log('Loaded wishlist:', wishlist);
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Saved cart:', cart);
}

function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    console.log('Saved wishlist:', wishlist);
}

// === GET PRODUCTS FROM HTML ===
const products = Array.from(items).map((item, index) => {
    const image = item.querySelector('img').getAttribute('src');
    const name = item.querySelector('h2').textContent;
    const priceText = item.querySelector('.price').textContent.replace('$', '');
    const price = parseFloat(priceText);
    const category = item.querySelector('h4').textContent;

    // Get the current page name from the URL to create truly unique IDs
    const pageName = window.location.pathname.split('/').pop().replace('.html', '');

    return {
        id: `${pageName}-${category.toLowerCase().replace(/\s+/g, '-')}-${name.toLowerCase().replace(/\s+/g, '-')}`, // Truly unique IDs
        name,
        price,
        image,
        category,
        oldPrice: price + 10, // Example: old price is $10 more
        addedDate: new Date().toISOString().split('T')[0] // Current date
    };
});

// === ADD TO CART + MODAL + WISHLIST LISTENERS ===
items.forEach((item, index) => {
    const addCartBtn = item.querySelector('.addCart');
    const img = item.querySelector('img');
    const wishlistBtn = item.querySelector('.wishlist');

    addCartBtn.addEventListener('click', () => {
        console.log('Add to cart clicked for product:', products[index]);
        addToCart(products[index], addCartBtn);
    });

    img.addEventListener('click', () => {
        console.log('Image clicked, opening modal for:', products[index]);
        selectedProduct = products[index];
        modalImg.src = selectedProduct.image;
        modalName.textContent = selectedProduct.name;
        modalPrice.textContent = `$${selectedProduct.price}`;
        modal.style.display = "flex";
    });

    wishlistBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent .product-link navigation
        console.log('Wishlist button clicked for product:', products[index]);
        toggleWishlist(products[index], wishlistBtn);
    });
});

// === MODAL "Add to Cart" ===
modalAddToCart.addEventListener('click', () => {
    if (selectedProduct) {
        console.log('Modal add to cart clicked for:', selectedProduct);
        addToCart(selectedProduct, modalAddToCart);
        modal.style.display = "none";
    }
});

closeModal.addEventListener('click', () => {
    modal.style.display = "none";
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// === CART ===
function addToCart(product, button = null) {
    const itemInCart = cart.find(item => item.id === product.id);
    if (itemInCart) {
        itemInCart.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartDisplay();

    // Animate cart counter
    const cartCounter = document.querySelector('.icon-cart span');
    if (cartCounter) {
        cartCounter.classList.add('cart-bounce');
        setTimeout(() => {
            cartCounter.classList.remove('cart-bounce');
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

// === WISHLIST ===
function toggleWishlist(product, button) {
    try {
        const itemInWishlist = wishlist.find(item => item.id === product.id);
        const heartIcon = button.querySelector('i');

        if (itemInWishlist) {
            wishlist = wishlist.filter(item => item.id !== product.id);
            heartIcon.classList.remove('fa-solid');
            heartIcon.classList.add('fa-regular');
            console.log(`Removed ${product.name} from wishlist`);
        } else {
            wishlist.push({ ...product });
            heartIcon.classList.remove('fa-regular');
            heartIcon.classList.add('fa-solid');
            console.log(`Added ${product.name} to wishlist`);
        }
        saveWishlist();
    } catch (error) {
        console.error('Error in toggleWishlist:', error);
    }
}

// === UPDATE CART DISPLAY ===
function updateCartDisplay() {
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

    cartIcon.textContent = totalQty;

    // Reattach quantity update handlers
    document.querySelectorAll('.plus').forEach(btn =>
        btn.addEventListener('click', () => updateQty(btn.dataset.id, 1)));
    document.querySelectorAll('.minus').forEach(btn =>
        btn.addEventListener('click', () => updateQty(btn.dataset.id, -1)));
    }
}

// === UPDATE QUANTITY ===
function updateQty(id, change) {
    const item = cart.find(p => p.id == id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id != id);
    }

    saveCart();
    updateCartDisplay();
}

// === CART PANEL TOGGLE ===
document.addEventListener('DOMContentLoaded', () => {
    const cartIconBtn = document.querySelector('.icon-cart');
    const closeBtn = document.querySelector('.close');
    const cartTab = document.getElementById('cartTab');

    cartIconBtn.addEventListener('click', () => {
        cartTab.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        cartTab.classList.remove('active');
    });

    // Initialize cart and wishlist
    loadCart();
    loadWishlist();
    updateCartDisplay();

    // Update heart icons based on wishlist
    items.forEach((item, index) => {
        const wishlistBtn = item.querySelector('.wishlist');
        const heartIcon = wishlistBtn.querySelector('i');
        const productId = products[index].id;

        // Check if this product is in the wishlist by its unique ID
        if (wishlist.some(w => w.id === productId)) {
            heartIcon.classList.remove('fa-regular');
            heartIcon.classList.add('fa-solid');
            console.log(`Product ${productId} is in wishlist, filling heart icon`);
        } else {
            // Ensure heart is empty if not in wishlist
            heartIcon.classList.remove('fa-solid');
            heartIcon.classList.add('fa-regular');
            console.log(`Product ${productId} is not in wishlist, using empty heart icon`);
        }
    });
});