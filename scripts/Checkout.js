
document.addEventListener('DOMContentLoaded', () => {
    const cartSection = document.querySelector('.cartdetails');
    const checkoutSection = document.querySelector('.right');
    const steps = document.querySelectorAll('.step');
    const totalQuantityElement = document.querySelector('.totalQuantity');
    const totalPriceElement = document.querySelector('.totalPrice');
    const cartList = document.querySelector('.cartdetails .list');
    let currentStep = 0;
    let cart = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cardNumberRegex = /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/;
    const cvvRegex = /^\d{3,4}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;

    function loadCart() {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) cart = JSON.parse(storedCart);
        updateCartDisplay();
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    showStep(currentStep);

    if (cartSection && checkoutSection) {
        cartSection.addEventListener('mouseenter', () => {
            cartSection.classList.add('active');
            checkoutSection.classList.remove('active');
        });

        checkoutSection.addEventListener('mouseenter', () => {
            checkoutSection.classList.add('active');
            cartSection.classList.remove('active');
        });
    }

    function setupRemoveButtons() {
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const item = button.closest('.item');
                if (item) showConfirmationModal(item);
            });
        });
    }

    function showConfirmationModal(item) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.innerHTML = `
            <p>Are you sure you want to remove this item?</p>
            <div class="modal-buttons">
                <button class="confirm-yes">Yes</button>
                <button class="confirm-no">No</button>
            </div>
        `;

        document.body.append(overlay, modal);
        overlay.classList.add('active');
        modal.classList.add('active');

        const closeModal = (removeItem = false) => {
            overlay.classList.remove('active');
            modal.classList.remove('active');

            if (removeItem) {
                const itemId = item.dataset.id;
                cart = cart.filter(cartItem => cartItem.id !== itemId);
                saveCart();
                updateCartDisplay();
                item.classList.add('removing');
                setTimeout(() => item.remove(), 300);
            }

            setTimeout(() => {
                overlay.remove();
                modal.remove();
            }, 300);
        };

        modal.querySelector('.confirm-yes').addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal(true);
        }, { once: true });

        modal.querySelector('.confirm-no').addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal(false);
        }, { once: true });

        overlay.addEventListener('click', () => closeModal(false), { once: true });
    }

    function updateCartDisplay() {
        cartList.innerHTML = cart.length === 0 ? '<p>Your cart is empty</p>' : '';
        cart.forEach(item => {
            if (item.id && item.image && item.name && item.price && item.quantity) {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');
                itemDiv.dataset.id = item.id;
                itemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="details">
                        <p>${item.name}</p>
                        <p>Price: $${item.price.toFixed(2)}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <i class="fa-solid fa-trash remove-item"></i>
                    </div>
                `;
                cartList.appendChild(itemDiv);
            }
        });
        setupRemoveButtons();
        updateTotals();
    }

    function updateTotals() {
        let totalQuantity = 0;
        let totalPrice = 0;

        cart.forEach(item => {
            const quantity = Number(item.quantity) || 0;
            const price = Number(item.price) || 0;
            totalQuantity += quantity;
            totalPrice += price * quantity;
        });

        if (totalQuantityElement) totalQuantityElement.textContent = totalQuantity;
        if (totalPriceElement) totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }

    function formatCardNumber(input) {
        let value = input.value.replace(/\D/g, '').slice(0, 16);
        input.value = value.match(/.{1,4}/g)?.join(' ') || value;
    }

    function formatExpiryDate(input) {
        let value = input.value.replace(/\D/g, '').slice(0, 4);
        if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2);
        input.value = value;
    }

    function isFutureDate(expiryValue) {
        const match = expiryValue.match(expiryDateRegex);
        if (!match) return false;
        const [, month, year] = match;
        const expiryMonth = parseInt(month, 10);
        const expiryYear = parseInt(year, 10) + 2000;
        const currentDate = new Date();
        return expiryYear > currentDate.getFullYear() || 
               (expiryYear === currentDate.getFullYear() && expiryMonth >= currentDate.getMonth() + 1);
    }

    const cardNumberInput = document.querySelector('#cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => formatCardNumber(e.target));
        cardNumberInput.addEventListener('keydown', (e) => {
            if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                e.preventDefault();
            }
        });
    }

    const cvvInput = document.querySelector('#cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });
        cvvInput.addEventListener('keydown', (e) => {
            if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                e.preventDefault();
            }
        });
    }

    const expiryDateInput = document.querySelector('#expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', (e) => formatExpiryDate(e.target));
        expiryDateInput.addEventListener('keydown', (e) => {
            if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '/'].includes(e.key)) {
                e.preventDefault();
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('buttonNext')) {
            e.preventDefault();
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
                scrollToTop();
            }
        } else if (e.target.classList.contains('buttonBack')) {
            e.preventDefault();
            currentStep--;
            showStep(currentStep);
            scrollToTop();
        } else if (e.target.classList.contains('buttonConfirm')) {
            e.preventDefault();
            if (validateStep(currentStep)) processPayment();
        }
    });

    function showStep(stepIndex) {
        if (stepIndex < 0) stepIndex = 0;
        if (stepIndex >= steps.length) stepIndex = steps.length - 1;
        currentStep = stepIndex;
        steps.forEach(step => step.classList.remove('active'));
        setTimeout(() => steps[stepIndex].classList.add('active'), 500);
    }

    function validateStep(stepIndex) {
        const currentStepElement = steps[stepIndex];
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            const value = input.value.trim();
            let errorMessage = 'This field is required';

            if (!value) {
                isValid = false;
            } else if (input.id === 'email' && !emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            } else if (input.id === 'cardNumber' && !cardNumberRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid 16-digit card number';
            } else if (input.id === 'cvv' && !cvvRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid 3 or 4-digit CVV';
            } else if (input.id === 'expiryDate') {
                if (!expiryDateRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid expiry date (MM/YY)';
                } else if (!isFutureDate(value)) {
                    isValid = false;
                    errorMessage = 'Expiry date must be in the future';
                }
            }

            if (!isValid) {
                input.classList.add('error');
                if (!input.nextElementSibling?.classList.contains('error-message')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = errorMessage;
                    errorMsg.style.color = '#e74c3c';
                    errorMsg.style.fontSize = '12px';
                    errorMsg.style.marginTop = '5px';
                    input.insertAdjacentElement('afterend', errorMsg);
                }
            } else {
                input.classList.remove('error');
                const errorMsg = input.nextElementSibling;
                if (errorMsg?.classList.contains('error-message')) errorMsg.remove();
            }
        });

        return isValid;
    }

    function processPayment() {
        setTimeout(() => {
            alert('Payment successful! Thank you for your order.');
            currentStep = 0;
            showStep(currentStep);
            document.querySelectorAll('input, select').forEach(input => input.value = '');
            cart = [];
            saveCart();
            updateCartDisplay();
            updateTotals();
        }, 300);
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    loadCart();
    updateTotals();
});