/**
 * Order Management Page Script
 * Handles order management functionality including order removal and confirmation popups
 */

document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements
    const removeButtons = document.querySelectorAll(".remove-button");
    let popup = document.getElementById("popup");
    let overlay = document.getElementById("overlay");
    let removePopup = document.getElementById("removePopup");
    let rowToRemove = null; // Variable to store the row to be removed

    /**
     * Open logout confirmation popup
     * Makes the popup and overlay visible
     */
    window.Open = function () {
        popup.classList.add("open-popup");
        overlay.classList.add("overlay-open");
    };

    /**
     * Close logout confirmation popup
     * Hides the popup and overlay
     */
    window.Close = function () {
        popup.classList.remove("open-popup");
        overlay.classList.remove("overlay-open");
    };

    /**
     * Open order removal confirmation popup
     * Makes the removal popup and overlay visible
     */
    window.OpenRemove = function () {
        removePopup.classList.add("open-popup");
        overlay.classList.add("overlay-open");
    };

    /**
     * Close order removal confirmation popup
     * Hides the removal popup and overlay, and resets the row to remove
     */
    window.CloseRemove = function () {
        removePopup.classList.remove("open-popup");
        overlay.classList.remove("overlay-open");
        rowToRemove = null; // Reset the row to remove
    };

    /**
     * Set up event listeners for all remove buttons
     * When clicked, store the row and open the confirmation popup
     */
    removeButtons.forEach(button => {
        button.addEventListener("click", function () {
            rowToRemove = this.closest("tr"); // Store the row to be removed
            OpenRemove(); // Open the remove confirmation popup
        });
    });

    /**
     * Handle confirmation of order removal
     * Removes the order row from the table when confirmed
     */
    document.getElementById("confirmRemove").addEventListener("click", function () {
        if (rowToRemove) {
            rowToRemove.remove(); // Remove the row from the DOM
            CloseRemove(); // Close the popup
            // In a real application, you would also update the database
        }
    });
});