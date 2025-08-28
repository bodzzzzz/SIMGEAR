/**
 * Support pages functionality
 * Handles FAQ accordion and other interactive elements
 */

// Initialize FAQ accordion functionality
function initFaqAccordion() {
    const questions = document.querySelectorAll('.faq-question');

    if (questions.length === 0) return; // Exit if no FAQ questions found

    questions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = answer.classList.contains('show');

            // Close all answers
            document.querySelectorAll('.faq-answer').forEach(item => {
                item.classList.remove('show');
            });
            document.querySelectorAll('.faq-question').forEach(item => {
                item.classList.remove('active');
            });

            // Open clicked answer if it was closed
            if (!isOpen) {
                answer.classList.add('show');
                question.classList.add('active');
            }
        });
    });

    console.log('FAQ accordion initialized');
}

// Initialize all support page functionality
function initSupportPages() {
    // Initialize FAQ accordion if on FAQ page
    initFaqAccordion();
}

// Export functions for use in other scripts if needed
export { initFaqAccordion, initSupportPages };
