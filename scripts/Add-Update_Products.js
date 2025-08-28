/**
 * Admin Product Management Script
 * Handles adding, updating, and removing products in the admin interface
 */

document.addEventListener('DOMContentLoaded', () => {
    // Array to store all products
    let products = [];

    // Load products from localStorage if it exists
    if (localStorage.getItem('products')) {
        try {
            // Parse stored products from JSON string to array
            products = JSON.parse(localStorage.getItem('products'));
            console.log('Loaded products from localStorage:', products);
        } catch (e) {
            // Handle JSON parsing errors
            console.error('Error parsing products from localStorage:', e);
            products = [];
        }
    }

    // Get DOM elements for popups
    let popup = document.getElementById("popup");
    let overlay = document.getElementById("overlay");
    let removePopup = document.getElementById("removePopup");
    let rowToRemove = null; // Variable to track which row to remove

    // Logout popup functions
    window.Open = function () {
        if (popup && overlay) {
            popup.classList.add("open-popup");
            overlay.classList.add("overlay-open");
        }
    };

    window.Close = function () {
        if (popup && overlay) {
            popup.classList.remove("open-popup");
            overlay.classList.remove("overlay-open");
        }
    };

    // Remove popup functions
    window.OpenRemove = function () {
        if (removePopup && overlay) {
            removePopup.classList.add("open-popup");
            overlay.classList.add("overlay-open");
        }
    };

    window.CloseRemove = function () {
        if (removePopup && overlay) {
            removePopup.classList.remove("open-popup");
            overlay.classList.remove("overlay-open");
            rowToRemove = null;
        }
    };

    // Function to render the table with products
    function renderTable() {
        const tbody = document.querySelector('.order-table tbody');
        if (!tbody) return; // Exit if table doesn't exist on this page

        tbody.innerHTML = ''; // Clear the table body

        products.forEach((product, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${product.image}" alt="${product.name}" class="order-image"></td>
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>${product.sold}</td>
                <td><button class="listBtn" onclick="showUpdateForm(${index})">Update Product</button></td>
                <td><i class="fa-solid fa-trash" style="width: 50%; height: 50%; cursor: pointer;" onclick="deleteRow(${index})"></i></td>
            `;
            tbody.appendChild(row);
        });
        console.log('Table rendered with products:', products);
    }

    // Function to show the update form
    window.showUpdateForm = function(index) {
        const product = products[index];
        const row = document.querySelector(`.order-table tbody tr:nth-child(${index + 1})`);

        if (!row) return;

        row.innerHTML = `
            <td><input type="text" id="edit-image-${index}" value="${product.image}" class="edit-input"></td>
            <td><input type="text" id="edit-name-${index}" value="${product.name}" class="edit-input"></td>
            <td><input type="number" id="edit-price-${index}" value="${product.price}" step="0.01" class="edit-input"></td>
            <td><input type="number" id="edit-stock-${index}" value="${product.stock}" class="edit-input"></td>
            <td><input type="number" id="edit-sold-${index}" value="${product.sold}" class="edit-input"></td>
            <td><button class="listBtn" onclick="saveUpdate(${index})">Save</button></td>
            <td><button class="listBtn" onclick="cancelUpdate(${index})">Cancel</button></td>
        `;
    };

    // Function to save the updated product
    window.saveUpdate = function(index) {
        const updatedProduct = {
            id: products[index].id,
            image: document.getElementById(`edit-image-${index}`).value,
            name: document.getElementById(`edit-name-${index}`).value,
            price: parseFloat(document.getElementById(`edit-price-${index}`).value),
            stock: parseInt(document.getElementById(`edit-stock-${index}`).value),
            sold: parseInt(document.getElementById(`edit-sold-${index}`).value)
        };

        products[index] = updatedProduct;
        try {
            localStorage.setItem('products', JSON.stringify(products));
            console.log('Product updated:', updatedProduct);
        } catch (e) {
            console.error('Error saving updated product to localStorage:', e);
            alert('Failed to update product. LocalStorage might be full or disabled. Try deleting some products to free up space.');
        }
        renderTable();
    };

    // Function to cancel the update and revert the row
    window.cancelUpdate = function(index) {
        renderTable();
    };

    // Function to handle delete action with popup
    window.deleteRow = function(index) {
        rowToRemove = index;
        OpenRemove();
    };

    // Handle Confirm Remove button click
    if (document.getElementById("confirmRemove")) {
        document.getElementById("confirmRemove").addEventListener("click", function () {
            if (rowToRemove !== null) {
                products.splice(rowToRemove, 1);
                try {
                    localStorage.setItem('products', JSON.stringify(products));
                    console.log('Product deleted, remaining products:', products);
                } catch (e) {
                    console.error('Error saving products after deletion to localStorage:', e);
                    alert('Failed to delete product. LocalStorage might be full or disabled.');
                }
                renderTable();
                CloseRemove();
            }
        });
    }

    // Handle Add Product form submission
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Add product form submitted');

            const formData = new FormData(addProductForm);
            const newProduct = {
                id: products.length + 1,
                name: formData.get('name'),
                description: formData.get('description'),
                price: parseFloat(formData.get('price')),
                category: formData.get('category'),
                stock: parseInt(formData.get('stock')),
                sold: 0,
                image: '/assets/beanie.jpg' // Default image
            };

            const imageFile = formData.get('image');
            if (imageFile && imageFile.size > 0) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    newProduct.image = event.target.result; // Store Base64 string
                    console.log('Image successfully read as Base64:', newProduct.image.substring(0, 50) + '...');
                    products.push(newProduct);
                    try {
                        localStorage.setItem('products', JSON.stringify(products));
                        console.log('Products after adding:', products);
                    } catch (e) {
                        console.error('Error saving products to localStorage:', e);
                        alert('Failed to add product. LocalStorage might be full due to large images. Try deleting some products to free up space.');
                    }
                    addProductForm.reset();
                    alert('Product added successfully!');
                    window.location.href = '/pages/AdminHomepage.html';
                };
                reader.onerror = () => {
                    console.error('Error reading image file');
                    products.push(newProduct);
                    try {
                        localStorage.setItem('products', JSON.stringify(products));
                        console.log('Products after adding (with default image):', products);
                    } catch (e) {
                        console.error('Error saving products to localStorage:', e);
                        alert('Failed to add product. LocalStorage might be full or disabled.');
                    }
                    addProductForm.reset();
                    alert('Product added successfully (image upload failed, using default image)!');
                    window.location.href = '/pages/AdminHomepage.html';
                };
                reader.readAsDataURL(imageFile);
            } else {
                console.log('No image uploaded, using default image');
                products.push(newProduct);
                try {
                    localStorage.setItem('products', JSON.stringify(products));
                    console.log('Products after adding:', products);
                } catch (e) {
                    console.error('Error saving products to localStorage:', e);
                    alert('Failed to add product. LocalStorage might be full or disabled.');
                }
                addProductForm.reset();
                alert('Product added successfully!');
                window.location.href = '/pages/AdminHomepage.html';
            }
        });
    }

    renderTable();
});