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
    const emailInput = document.getElementById('email');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Iniciando sesión...';
            
            // Collect form data
            const credentials = {
                email: emailInput.value,
                password: passwordInput.value
            };
            
            // Send login request to the server
            loginUser(credentials)
                .then(response => {
                    // Handle successful login
                    console.log('Login successful', response);
                    
                    // Save JWT token in localStorage
                    if (response.token) {
                        localStorage.setItem('auth_token', response.token);
                    }
                    
                    // Redirect to folder page
                    window.location.href = 'folder-page.html';
                })
                .catch(error => {
                    // Handle login error
                    console.error('Login failed', error);
                    
                    // Show error message to user
                    showLoginError(error.message || 'Error al iniciar sesión. Por favor intente nuevamente.');
                })
                .finally(() => {
                    // Reset button state
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Iniciar sesión';
                });
        });
    }
}

/**
 * Send login request to the server
 * @param {Object} credentials - User credentials (email and password)
 * @returns {Promise} - Promise that resolves with the login response or rejects with error
 */
async function loginUser(credentials) {
    try {
        // Import the ApiService to use the mocks properly
        const { default: ApiService } = await import('../services/api-service.js');
        
        // Use ApiService instead of direct fetch
        const response = await ApiService.post('/auth/login', credentials);
        return response;
    } catch (error) {
        console.error('Login request failed:', error);
        throw error;
    }
}

/**
 * Show login error message to the user
 * @param {string} message - Error message to display
 */
function showLoginError(message) {
    // Check if error alert already exists
    let errorAlert = document.querySelector('.login-error');
    
    // If error alert doesn't exist, create it
    if (!errorAlert) {
        errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger login-error mt-3';
        errorAlert.role = 'alert';
        
        // Get form and insert error alert after it
        const form = document.querySelector('.login-form');
        form.insertAdjacentElement('afterbegin', errorAlert);
    }
    
    // Update error message
    errorAlert.textContent = message;
}