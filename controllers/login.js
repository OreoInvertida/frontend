/**
 * Login Page Controller
 * Handles login form functionality
 */

import { 
    setupPasswordToggle,
    setupPasswordValidation,
    isValidPassword
} from '../utilities/form-utils.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the login page components
    initLoginPage();
});

/**
 * Initialize the login page components
 */
function initLoginPage() {
    // Setup password toggle functionality
    setupPasswordToggle();
    
    // Setup password validation with requirements feedback
    setupPasswordValidation('password');
    
    // Setup form submission
    setupLoginForm();
}

/**
 * Setup login form validation and submission
 */
function setupLoginForm() {
    const form = document.querySelector('.login-form');
    const passwordInput = document.getElementById('password');
    const submitButton = document.querySelector('.login-button');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validate password (if needed during login)
            const password = passwordInput.value;
            
            // Collect form data
            const formData = {
                idNumber: document.getElementById('id-number').value,
                password: password
            };
            
            // You can implement form submission here
            console.log('Login form submitted', formData);
            
            // Redirect to folder page after successful login
            // In a real app, you would check the response first
            window.location.href = 'folder-page.html';
        });
    }
}